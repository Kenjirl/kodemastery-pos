<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    protected $guarded = [];

    /**
     * Relasi ke model Category.
     * Satu produk hanya memiliki satu kategori.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi ke model StockTotal.
     * Satu produk memiliki satu total stok.
     */
    public function stockTotal()
    {
        return $this->hasOne(StockTotal::class);
    }

    /**
     * Aksesors untuk mendapatkan URL gambar produk.
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn($image) => url('/storage/products/' . $image),
        );
    }
}
