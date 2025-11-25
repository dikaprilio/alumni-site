<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckConstraints extends Command
{
    protected $signature = 'db:check-constraints';
    protected $description = 'Check for constraint violations before running migrations';

    public function handle()
    {
        $this->info('========================================');
        $this->info('CHECKING CONSTRAINT VIOLATIONS');
        $this->info('========================================');
        $this->newLine();

        $hasViolations = false;

        // 1. Check USERS → ALUMNIS (1:1) Violation
        $this->info('1. Checking USERS → ALUMNIS (1:1) violations...');
        $alumniViolations = DB::table('alumnis')
            ->select('user_id', DB::raw('COUNT(*) as count'))
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        if ($alumniViolations->isEmpty()) {
            $this->info('   ✅ No violations found');
        } else {
            $hasViolations = true;
            $this->error('   ❌ Found ' . $alumniViolations->count() . ' violations:');
            foreach ($alumniViolations as $violation) {
                $alumniIds = DB::table('alumnis')
                    ->where('user_id', $violation->user_id)
                    ->pluck('id', 'name')
                    ->toArray();
                
                $this->line("      - User ID {$violation->user_id} has {$violation->count} alumni records:");
                foreach ($alumniIds as $name => $id) {
                    $this->line("        • Alumni ID {$id}: {$name}");
                }
            }
        }

        // 2. Check ALUMNI_SKILL Composite Key Violation
        $this->newLine();
        $this->info('2. Checking ALUMNI_SKILL composite key violations...');
        
        if (!DB::getSchemaBuilder()->hasTable('alumni_skill')) {
            $this->warn('   ⚠️  Table \'alumni_skill\' does not exist yet');
        } else {
            $skillViolations = DB::table('alumni_skill')
                ->select('alumni_id', 'skill_id', DB::raw('COUNT(*) as count'))
                ->groupBy('alumni_id', 'skill_id')
                ->havingRaw('COUNT(*) > 1')
                ->get();

            if ($skillViolations->isEmpty()) {
                $this->info('   ✅ No violations found');
            } else {
                $hasViolations = true;
                $this->error('   ❌ Found ' . $skillViolations->count() . ' violations:');
                foreach ($skillViolations as $violation) {
                    $this->line("      - Alumni ID {$violation->alumni_id} + Skill ID {$violation->skill_id} appears {$violation->count} times");
                }
            }

            // Check table structure
            $this->newLine();
            $this->info('3. Checking ALUMNI_SKILL table structure...');
            try {
                $hasIdColumn = DB::getSchemaBuilder()->hasColumn('alumni_skill', 'id');
                if ($hasIdColumn) {
                    $this->warn('   ⚠️  Table has \'id\' column (will be removed for composite key)');
                } else {
                    $this->info('   ✅ Table structure is correct (no id column)');
                }
            } catch (\Exception $e) {
                $this->warn('   ⚠️  Could not check table structure: ' . $e->getMessage());
            }
        }

        // Summary
        $this->newLine();
        $this->info('========================================');
        $this->info('SUMMARY');
        $this->info('========================================');
        $this->line('Alumni 1:1 violations: ' . $alumniViolations->count());
        if (DB::getSchemaBuilder()->hasTable('alumni_skill')) {
            $this->line('Alumni_Skill duplicates: ' . (isset($skillViolations) ? $skillViolations->count() : 0));
        }
        $this->newLine();

        if (!$hasViolations) {
            $this->info('✅ All checks passed! Safe to run migrations.');
            return Command::SUCCESS;
        } else {
            $this->error('❌ Violations found! Please fix them before running migrations.');
            $this->line('');
            $this->line('To fix violations, you can:');
            $this->line('1. Review fix_constraint_violations.sql');
            $this->line('2. Or manually clean up the data');
            $this->line('3. Then run this command again to verify');
            return Command::FAILURE;
        }
    }
}

