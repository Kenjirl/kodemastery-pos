<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function paymentNotification(Request $request)
    {
        // Ambil payload dari request
        $payload = $request->getContent();
        $notification = json_decode($payload);

        // Verifikasi signature untuk memastikan keamanan
        $signatureKey = hash('sha512',
            $notification->order_id .
            $notification->status_code .
            $notification->gross_amount .
            config('services.midtrans.server_key')
        );

        if ($notification->signature_key !== $signatureKey) {
            return;
        }

        // Ambil data status transaksi dan tipe pembayaran
        $transactionStatus = $notification->transaction_status;
        $paymentType = $notification->payment_type;
        $orderId = $notification->order_id;

        // Cari transaksi berdasarkan invoice yang sama dengan order_id
        $transaction = Transaction::where('invoice', $orderId)->first();

        if (!$transaction) {
            return;
        }

        // Tentukan status transaksi berdasarkan status dari Midtrans
        switch ($transactionStatus) {
            case 'capture':
                $transaction->update([
                    'status' => 'success',
                    'payment_method' => 'online',
                ]);
                break;

            case 'settlement':
                $transaction->update([
                    'status' => 'success',
                    'payment_method' => 'online',
                ]);
                break;

            case 'pending':
                $transaction->update([
                    'status' => 'pending',
                    'payment_method' => 'online',
                ]);
                break;

            case 'deny':
                $transaction->update([
                    'status' => 'failed',
                    'payment_method' => 'online',
                ]);
                break;

            case 'expire':
                $transaction->update([
                    'status' => 'expired',
                    'payment_method' => 'online',
                ]);
                break;

            case 'cancel':
                $transaction->update([
                    'status' => 'failed',
                    'payment_method' => 'online',
                ]);
                break;

            default:
                return;
        }

    }
}
