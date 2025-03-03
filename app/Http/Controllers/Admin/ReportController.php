<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Tampilkan halaman awal dengan transactions kosong.
        return Inertia::render('Admin/Report/Index', [
            'transactions' => [],
        ]);
    }

 public function generate(Request $request)
{
    // Validasi input agar start_date dan end_date benar
    $request->validate([
        'start_date' => 'required|date',
        'end_date'   => 'required|date|after_or_equal:start_date',
    ]);

    // Tambahkan jam 00:00:00 ke start_date dan 23:59:59 ke end_date
    $startDateTime = $request->start_date . ' 00:00:00';
    $endDateTime   = $request->end_date   . ' 23:59:59';

    // Tampilkan halaman dengan data transactions berdasarkan tanggal yang dipilih
    return Inertia::render('Admin/Report/Index', [
        'transactions' => Inertia::defer(function () use ($startDateTime, $endDateTime) {
            return Transaction::with(['customer'])
                ->withSum('transactionDetails as total_quantity', 'quantity')
                ->whereBetween('transaction_date', [$startDateTime, $endDateTime])
                ->orderBy('transaction_date', 'desc')
                ->get();
        }),
        'start_date' => $request->start_date,
        'end_date'   => $request->end_date,
    ]);
}
}
