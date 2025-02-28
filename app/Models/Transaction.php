<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Transaction extends Model
{
    protected $guarded = [];

    // Relasi dengan model Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi dengan model TransactionDetail
    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    // Event boot untuk logika tambahan saat model di-create
    protected static function boot()
    {
        parent::boot();

        // Menambahkan logika khusus saat transaksi dibuat
        static::creating(function ($transaction) {
            // Menghasilkan invoice dengan format INV-YYYYMMDDHHMMSS-RANDOM5
            $transaction->invoice = 'INV-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(5));

            // Menetapkan tanggal transaksi jika belum diisi
            if (empty($transaction->transaction_date)) {
                $transaction->transaction_date = Carbon::now();
            }
        });
    }
}
