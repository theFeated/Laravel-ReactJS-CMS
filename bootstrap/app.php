<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\AutoLogout::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            
        ]);
        $middleware->alias([
            'google2fa' =>  \App\Http\Middleware\Verify2FAMiddleware::class,    
            'autologout' => \App\Http\Middleware\AutoLogout::class,
            'twofactorauth' => \App\Http\Middleware\CheckTwoFactorAuthentication::class,
   
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
