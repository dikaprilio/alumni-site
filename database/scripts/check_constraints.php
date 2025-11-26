<?php

/**
 * Script untuk mengecek pelanggaran constraint sebelum migration
 * 
 * Usage:
 * php artisan tinker
 * >>> require 'database/scripts/check_constraints.php';
 * >>> checkConstraintViolations();
 */

use Illuminate\Support\Facades\DB;

function checkConstraintViolations()
{
    echo "\n========================================\n";
    echo "CHECKING CONSTRAINT VIOLATIONS\n";
    echo "========================================\n\n";

    // 1. Check USERS → ALUMNIS (1:1) Violation
    echo "1. Checking USERS → ALUMNIS (1:1) violations...\n";
    $alumniViolations = DB::table('alumnis')
        ->select('user_id', DB::raw('COUNT(*) as count'), DB::raw('ARRAY_AGG(id) as alumni_ids'))
        ->whereNotNull('user_id')
        ->groupBy('user_id')
        ->havingRaw('COUNT(*) > 1')
        ->get();

    if ($alumniViolations->isEmpty()) {
        echo "   ✅ No violations found\n";
    } else {
        echo "   ❌ Found " . $alumniViolations->count() . " violations:\n";
        foreach ($alumniViolations as $violation) {
            echo "      - User ID {$violation->user_id} has {$violation->count} alumni records\n";
        }
    }

    // 2. Check ALUMNI_SKILL Composite Key Violation
    echo "\n2. Checking ALUMNI_SKILL composite key violations...\n";
    
    // Check if table exists
    if (!DB::getSchemaBuilder()->hasTable('alumni_skill')) {
        echo "   ⚠️  Table 'alumni_skill' does not exist yet\n";
    } else {
        $skillViolations = DB::table('alumni_skill')
            ->select('alumni_id', 'skill_id', DB::raw('COUNT(*) as count'))
            ->groupBy('alumni_id', 'skill_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        if ($skillViolations->isEmpty()) {
            echo "   ✅ No violations found\n";
        } else {
            echo "   ❌ Found " . $skillViolations->count() . " violations:\n";
            foreach ($skillViolations as $violation) {
                echo "      - Alumni ID {$violation->alumni_id} + Skill ID {$violation->skill_id} appears {$violation->count} times\n";
            }
        }

        // Check table structure
        echo "\n3. Checking ALUMNI_SKILL table structure...\n";
        $columns = DB::select("
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'alumni_skill'
            ORDER BY ordinal_position
        ");
        
        echo "   Table structure:\n";
        foreach ($columns as $column) {
            echo "      - {$column->column_name} ({$column->data_type}, nullable: {$column->is_nullable})\n";
        }
    }

    // Summary
    echo "\n========================================\n";
    echo "SUMMARY\n";
    echo "========================================\n";
    echo "Alumni 1:1 violations: " . $alumniViolations->count() . "\n";
    if (DB::getSchemaBuilder()->hasTable('alumni_skill')) {
        echo "Alumni_Skill duplicates: " . (isset($skillViolations) ? $skillViolations->count() : 0) . "\n";
    }
    echo "\n";

    if ($alumniViolations->isEmpty() && (!isset($skillViolations) || $skillViolations->isEmpty())) {
        echo "✅ All checks passed! Safe to run migrations.\n";
        return true;
    } else {
        echo "❌ Violations found! Please fix them before running migrations.\n";
        echo "   See fix_constraint_violations.sql for cleanup script.\n";
        return false;
    }
}

// Auto-run if called directly
if (php_sapi_name() === 'cli' && basename(__FILE__) === basename($_SERVER['PHP_SELF'])) {
    require __DIR__ . '/../../vendor/autoload.php';
    $app = require_once __DIR__ . '/../../bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    checkConstraintViolations();
}

