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
            
            // Relasi ke User (1:1 enforced - bisa null jika user dihapus)
            $table->foreignId('user_id')
                  ->nullable()
                  ->unique() // Enforce 1:1 relationship (satu user hanya bisa punya satu alumni)
                  ->constrained('users')
                  ->onDelete('set null');

            $table->string('name'); 
            $table->string('nim')->unique();
            $table->year('graduation_year');
            $table->string('major');
            $table->string('phone_number')->nullable();
            $table->enum('gender', ['L', 'P'])->nullable();
            $table->text('address')->nullable();
            
            // NORMALISASI: Kolom 'current_position' dan 'company_name' DIHAPUS.
            // Data ini sekarang diambil langsung dari relasi tabel job_histories.
            
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