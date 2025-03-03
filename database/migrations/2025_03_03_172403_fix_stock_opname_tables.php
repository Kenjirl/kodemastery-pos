<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('stock_opnames');
        Schema::dropIfExists('stock_opname_details');

        // Buat ulang tabel stock_opnames
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->date('opname_date');
            $table->enum('status', ['pending', 'completed'])->default('pending');
            $table->timestamps();
        });

        // Buat ulang tabel stock_opname_details
        Schema::create('stock_opname_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stock_total_id')->constrained()->cascadeOnDelete();
            $table->integer('physical_quantity');
            $table->integer('quantity_difference');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_opname_details');
        Schema::dropIfExists('stock_opnames');
    }
};
