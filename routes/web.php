<?php

use App\Http\Controllers\Google2FAController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecoveryCodeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TwoFactorController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth', 'google2fa', 'autologout', 'twofactorauth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['verified'])->name('dashboard');
    
    Route::prefix('/')->controller(ProfileController::class)->group(function () {
        Route::get('profile', 'edit')->name('profile.edit');
        Route::patch('update', 'update')->name('profile.update');
        Route::post('photo', 'updatePhoto')->name('profile.updatePhoto');
        Route::delete('destroy', 'destroy')->name('profile.destroy');
    });

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/api/settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/update-web-icon-and-name', [SettingsController::class, 'updateWebIconAndName']);
    Route::post('/settings/upload-logo', [SettingsController::class, 'uploadLogo']);

});

Route::middleware('auth')->group(function () {
    Route::get('/twofactor', [TwoFactorController::class, 'index'])->name('twofactor.index');
    Route::post('/twofactor/verify', [TwoFactorController::class, 'verify'])->name('twofactor.verify');
    Route::post('/twofactor/resend', [TwoFactorController::class, 'resend'])->name('twofactor.resend');

    Route::get('/setup-2fa', [Google2FAController::class, 'show2FASetup'])->name('setup-2fa');
    Route::get('/verify-2fa', [Google2FAController::class, 'show2FAVerify'])->name('verify-2fa');
    Route::post('/verify-2fa', [Google2FAController::class, 'verify2FA']);

    Route::post('/setup-2fa', [Google2FAController::class, 'setup2FA'])->name('2fa.setup');
    Route::post('/verify-2fa', [Google2FAController::class, 'verify2FA'])->name('2fa.verify');  
    
    Route::post('/api/recovery-codes/generate', [RecoveryCodeController::class, 'generate']);
    Route::get('/api/recovery-codes', [RecoveryCodeController::class, 'index']); 
    Route::post('/api/recovery-codes/verify', [RecoveryCodeController::class, 'verify']);});
    Route::post('/api/recovery-codes/mark-copied', [RecoveryCodeController::class, 'markCopied']);

//Login featch the settings for the gogle auth
Route::get('/api/settings', [SettingsController::class, 'getSettings']);

Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');


require __DIR__.'/auth.php';