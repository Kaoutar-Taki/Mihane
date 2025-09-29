<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\CityController;

Route::get('/health', function () {
    return response()->json([
        'ok' => true,
        'app' => config('app.name'),
        'env' => config('app.env'),
        'time' => now()->toDateTimeString(),
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{region}', [RegionController::class, 'show']);

Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{city}', [CityController::class, 'show']);

Route::get('/genders', function () {
    return response()->json(DB::table('genders')->select('id','key','name_ar','name')->orderBy('id')->get());
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::post('/regions', [RegionController::class, 'store']);
    Route::put('/regions/{region}', [RegionController::class, 'update']);
    Route::delete('/regions/{region}', [RegionController::class, 'destroy']);
    Route::post('/regions/{id}/restore', [RegionController::class, 'restore']);
    Route::delete('/regions/{id}/force', [RegionController::class, 'forceDestroy']);

    Route::post('/cities', [CityController::class, 'store']);
    Route::put('/cities/{city}', [CityController::class, 'update']);
    Route::delete('/cities/{city}', [CityController::class, 'destroy']);
    Route::post('/cities/{id}/restore', [CityController::class, 'restore']);
    Route::delete('/cities/{id}/force', [CityController::class, 'forceDestroy']);
});
