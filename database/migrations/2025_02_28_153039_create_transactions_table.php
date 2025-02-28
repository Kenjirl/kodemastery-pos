<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('invoice')->unique();
            $table->string('total_amount');
            $table->string('cash')->nullable();
            $table->string('change')->nullable();
            $table->string('discount')->default('0');
            $table->enum('payment_method', ['cash', 'online'])->default('cash');
            $table->string('payment_link_url')->nullable();
            $table->timestamp('transaction_date')->nullable();
            $table->enum('status', array('pending', 'success', 'expired', 'failed'))->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
