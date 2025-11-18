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
        Schema::create('alumnis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('nim')->unique();
            $table->year('graduation_year');
            $table->string('major');
            $table->string('phone_number')->nullable();
            $table->enum('gender', ['L', 'P'])->nullable();
            $table->text('address')->nullable();
            
            // Data Karir Singkat
            $table->string('current_job')->nullable();
            
            // --- TAMBAHKAN BARIS INI ---
            $table->string('company_name')->nullable(); 
            // ---------------------------

            $table->string('linkedin_url')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumnis');
    }
};
