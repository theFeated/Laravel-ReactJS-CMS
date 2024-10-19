<?php

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    
    Route::prefix('profile')->controller(ProfileController::class)->group(function () {
    Route::get('/edit', 'edit')->name('profile.edit');
    Route::patch('/update', 'update')->name('profile.update');
    Route::post('/photo', 'updatePhoto')->name('profile.updatePhoto');
    Route::delete('/destroy', 'destroy')->name('profile.destroy');
    });

});

Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');


require __DIR__.'/auth.php';