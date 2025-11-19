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
        Schema::table('alumnis', function (Blueprint $table) {
            // Default false (0) means Public. If true (1), the info is hidden.
            $table->boolean('private_email')->default(false)->after('linkedin_url');
            $table->boolean('private_phone')->default(false)->after('private_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->dropColumn(['private_email', 'private_phone']);
        });
    }
};