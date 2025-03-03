<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    /**
     * Menangani proses logout pengguna.
     *
     * Method ini akan:
     * - Melakukan logout pengguna
     * - Mengarahkan pengguna ke halaman login
     */
    public function __invoke(Request $request)
    {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
