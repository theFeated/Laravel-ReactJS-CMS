<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});


Route::get('/authentication', function () {
    return Inertia::render('Auth/LogReg');
})->name('authentication');

// Route::middleware([''])->group(function () {
    // Add the route for the profile page
    Route::get('/profile', function () {
        return Inertia::render('Profile');
    });

    // Add other routes that require authentication here
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    });
// });