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
        Schema::create('alumni_skill', function (Blueprint $table) {
            // Composite key: alumni_id + skill_id (tidak perlu id() terpisah)
            $table->foreignId('alumni_id')->constrained('alumnis')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
            
            // Composite primary key untuk enforce uniqueness
            $table->primary(['alumni_id', 'skill_id']);
            
            // Timestamp opsional di tabel pivot, biasanya gak perlu
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_skill');
    }
};
