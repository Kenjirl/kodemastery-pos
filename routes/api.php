<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::post('payment-notification', [NotificationController::class, 'paymentNotification']);
