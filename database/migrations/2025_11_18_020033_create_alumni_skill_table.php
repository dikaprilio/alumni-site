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
            $table->id();
            // Hubungkan Alumni dan Skill
            $table->foreignId('alumni_id')->constrained('alumnis')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
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
