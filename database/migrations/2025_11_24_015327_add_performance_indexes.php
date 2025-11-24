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
        // Indexes for alumnis table - frequently queried columns
        Schema::table('alumnis', function (Blueprint $table) {
            $table->index('graduation_year'); // For filtering by year
            $table->index('nim'); // For unique lookups
            $table->index('user_id'); // For joins
            $table->index(['featured_at', 'graduation_year']); // Composite for Alumni of the Month + year filter
        });

        // Indexes for job_histories table - for employment status queries
        Schema::table('job_histories', function (Blueprint $table) {
            $table->index(['alumni_id', 'end_date']); // For finding active jobs (where end_date IS NULL)
            $table->index('start_date'); // For sorting by date
        });

        // Indexes for news table - for chronological queries
        Schema::table('news', function (Blueprint $table) {
            $table->index('created_at'); // For sorting by date
            $table->index('category'); // For filtering by category (if exists)
        });

        // Indexes for events table
        Schema::table('events', function (Blueprint $table) {
            $table->index('event_date'); // For upcoming events
            $table->index('status'); // For filtering by status (upcoming/ongoing/finished)
            $table->index('created_at'); // For sorting
        });

        // Indexes for opportunities table (if exists)
        if (Schema::hasTable('opportunities')) {
            Schema::table('opportunities', function (Blueprint $table) {
                if (Schema::hasColumn('opportunities', 'type')) {
                    $table->index('type'); // For filtering by type (job/mentoring)
                }
                if (Schema::hasColumn('opportunities', 'deadline')) {
                    $table->index('deadline'); // For upcoming deadlines
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumnis', function (Blueprint $table) {
            $table->dropIndex(['graduation_year']);
            $table->dropIndex(['nim']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['featured_at', 'graduation_year']);
        });

        Schema::table('job_histories', function (Blueprint $table) {
            $table->dropIndex(['alumni_id', 'end_date']);
            $table->dropIndex(['start_date']);
        });

        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['category']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['event_date']);
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        if (Schema::hasTable('opportunities')) {
            Schema::table('opportunities', function (Blueprint $table) {
                if (Schema::hasColumn('opportunities', 'type')) {
                    $table->dropIndex(['type']);
                }
                if (Schema::hasColumn('opportunities', 'deadline')) {
                    $table->dropIndex(['deadline']);
                }
            });
        }
    }
};
