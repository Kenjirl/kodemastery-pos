<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockProduct extends Model
{
    protected $guarded = [];

    /**
     * Relasi ke model Product.
     * Satu stock product hanya terkait dengan satu produk.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relasi ke model Supplier.
     * Satu stock product hanya terkait dengan satu supplier.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
