<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockOpname extends Model
{
    protected $guarded = [];

    /**
     * Relasi ke model StockOpnameDetail.
     * Satu stock opname memiliki banyak detail stock opname.
     */
    public function details()
    {
        return $this->hasMany(StockOpnameDetail::class);
    }
}
