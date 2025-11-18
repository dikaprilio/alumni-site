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
            
            // --- PERUBAHAN PENTING ---
            // user_id harus bisa NULL, karena data alumni dibuat dulu
            // baru user mendaftar belakangan.
            // onDelete('set null') berarti jika User dihapus, data Alumni tetap ada
            // tapi user_id-nya jadi NULL.
            $table->foreignId('user_id')
                  ->nullable() // <--- TAMBAHKAN INI
                  ->constrained('users')
                  ->onDelete('set null'); // <--- GANTI DARI cascade

            // Kolom ini untuk nama alumni, terpisah dari nama user
            $table->string('name'); // <-- TAMBAHKAN KOLOM NAMA ALUMNI
            $table->string('nim')->unique();
            $table->year('graduation_year');
            $table->string('major');
            $table->string('phone_number')->nullable();
            $table->enum('gender', ['L', 'P'])->nullable();
            $table->text('address')->nullable();
            
            // Data Karir Singkat
            $table->string('current_job')->nullable();
            $table->string('company_name')->nullable(); 
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