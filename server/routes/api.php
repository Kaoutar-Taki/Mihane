<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CardController;

Route::apiResource('cards', CardController::class);
