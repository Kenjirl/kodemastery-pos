<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * Menampilkan halaman login.
     *
     * Method ini akan me-return halaman login menggunakan Inertia.js.
     */
    public function index()
    {
        // Mengembalikan tampilan 'Auth/Login' melalui Inertia
        return inertia('Auth/Login');
    }

    /**
     * Memproses permintaan login.
     *
     * Method ini bertugas untuk:
     * - Memvalidasi input (email & password)
     * - Mencoba melakukan autentikasi user
     * - Mengarahkan user ke dashboard jika berhasil, atau menampilkan error jika gagal.
     */
    public function store(Request $request)
    {
        // Validasi input form login
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Ambil data email dan password dari request
        $credentials = $request->only('email', 'password');

        // Lakukan percobaan login menggunakan kredensial tersebut
        if (auth()->attempt($credentials)) {
            // Regenerasi session untuk keamanan
            $request->session()->regenerate();

            // Jika login berhasil, arahkan ke route dashboard
            return redirect()->route('admin.dashboard');
        }

        // Jika login gagal, kembalikan ke halaman login dengan pesan error
        return back()->withErrors([
            'email' => 'Kredensial yang Anda berikan tidak cocok dengan data kami.',
        ]);
    }
}
