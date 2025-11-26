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
        Schema::table('alumni_skill', function (Blueprint $table) {
            // Drop existing primary key if exists
            $table->dropPrimary();
            
            // Drop id column if exists
            if (Schema::hasColumn('alumni_skill', 'id')) {
                $table->dropColumn('id');
            }
            
            // Add composite primary key
            $table->primary(['alumni_id', 'skill_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumni_skill', function (Blueprint $table) {
            // Drop composite primary key
            $table->dropPrimary();
            
            // Add back id column
            $table->id()->first();
            
            // Set id as primary key
            $table->primary('id');
        });
    }
};
