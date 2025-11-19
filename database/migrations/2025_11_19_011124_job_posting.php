<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Admin yang posting
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('company_name');
            $table->string('location')->nullable();
            $table->enum('job_type', ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote']);
            $table->text('description');
            $table->string('salary_range')->nullable(); // Contoh: "5jt - 8jt"
            $table->string('application_url')->nullable(); // Link eksternal jika ada
            $table->date('closing_date')->nullable();
            $table->enum('status', ['active', 'closed', 'draft'])->default('active');
            $table->string('image')->nullable(); // Logo perusahaan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};