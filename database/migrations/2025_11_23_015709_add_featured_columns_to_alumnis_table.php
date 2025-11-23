<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->timestamp('featured_at')->nullable()->after('updated_at');
            $table->text('featured_reason')->nullable()->after('featured_at'); // Alasan/Deskripsi kenapa dipilih
        });
    }

    public function down(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->dropColumn(['featured_at', 'featured_reason']);
        });
    }
};