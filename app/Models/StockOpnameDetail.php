<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockOpnameDetail extends Model
{
    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function stockTotal()
    {
        return $this->belongsTo(StockTotal::class, 'product_id', 'product_id');
    }

}
