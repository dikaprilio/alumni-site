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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            
            // Menghubungkan Event dengan User (Admin) yang membuatnya
            $table->foreignId('user_id')
                  ->nullable() // Boleh null jika admin dihapus
                  ->constrained('users')
                  ->onDelete('set null');

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->dateTime('event_date'); 
            $table->string('location');
            $table->string('image')->nullable();
            
            $table->enum('status', ['upcoming', 'ongoing', 'finished'])->default('upcoming');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};