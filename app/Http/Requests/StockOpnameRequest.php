<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockOpnameRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan untuk melakukan permintaan ini.
     *
     * @return bool
     */
    public function authorize()
    {
        // Sesuaikan dengan kebijakan authorization Anda
        return true;
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk permintaan ini.
     *
     * @return array
     */

    public function rules(): array
    {
        return [
            'opname_date' => 'required|date',
            'status' => 'required|string|in:pending,completed,canceled',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.physical_quantity' => 'required|integer|min:0',
        ];
    }
}
