<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\ProfessionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ArtisanProfileController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StatsController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{region}', [RegionController::class, 'show']);

Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/{city}', [CityController::class, 'show']);

Route::get('/genders', [GenderController::class, 'index']);
Route::get('/professions', [ProfessionController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faqs/{faq}', [FaqController::class, 'show']);
Route::get('/artisans', [ArtisanProfileController::class, 'index']);
Route::get('/artisans/{artisan}', [ArtisanProfileController::class, 'show']);
Route::get('/artisans/{artisan}/reviews', [ReviewController::class, 'indexByProfile']);

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

    
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
    Route::post('/testimonials/{id}/restore', [TestimonialController::class, 'restore']);
    Route::delete('/testimonials/{id}/force', [TestimonialController::class, 'forceDestroy']);

    Route::post('/genders', [GenderController::class, 'store']);
    Route::put('/genders/{gender}', [GenderController::class, 'update']);
    Route::delete('/genders/{gender}', [GenderController::class, 'destroy']);
    Route::post('/genders/{id}/restore', [GenderController::class, 'restore']);
    Route::delete('/genders/{id}/force', [GenderController::class, 'forceDestroy']);

    Route::post('/professions', [ProfessionController::class, 'store']);
    Route::put('/professions/{profession}', [ProfessionController::class, 'update']);
    Route::delete('/professions/{profession}', [ProfessionController::class, 'destroy']);
    Route::post('/professions/{id}/restore', [ProfessionController::class, 'restore']);
    Route::delete('/professions/{id}/force', [ProfessionController::class, 'forceDestroy']);
    Route::post('/professions/{profession}/image', [ProfessionController::class, 'uploadImage']);

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::post('/categories/{id}/restore', [CategoryController::class, 'restore']);
    Route::delete('/categories/{id}/force', [CategoryController::class, 'forceDestroy']);

    Route::post('/faqs', [FaqController::class, 'store']);
    Route::put('/faqs/{faq}', [FaqController::class, 'update']);
    Route::delete('/faqs/{faq}', [FaqController::class, 'destroy']);
    Route::post('/faqs/{id}/restore', [FaqController::class, 'restore']);
    Route::delete('/faqs/{id}/force', [FaqController::class, 'forceDestroy']);

    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}/force', [UserController::class, 'forceDestroy']);

    Route::post('/artisans', [ArtisanProfileController::class, 'store']);
    Route::put('/artisans/{artisan}', [ArtisanProfileController::class, 'update']);
    Route::delete('/artisans/{artisan}', [ArtisanProfileController::class, 'destroy']);
    Route::post('/artisans/{id}/restore', [ArtisanProfileController::class, 'restore']);
    Route::delete('/artisans/{id}/force', [ArtisanProfileController::class, 'forceDestroy']);

    Route::post('/uploads/images', [UploadController::class, 'uploadImages']);

    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{review}/respond', [ReviewController::class, 'respond']);
    Route::put('/reviews/{review}/status', [ReviewController::class, 'updateStatus']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Dashboard stats
    Route::get('/stats/overview', [StatsController::class, 'overview']);
});
