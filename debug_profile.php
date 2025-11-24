<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$alumni = App\Models\Alumni::with(['jobHistories', 'skills'])->first();

if ($alumni) {
    echo "=== Alumni Profile Debug ===\n";
    echo "Name: {$alumni->name}\n";
    echo "---\n";
    
    // Check each criterion
    echo "1. Phone & Address: ";
    echo (!empty($alumni->phone_number) && !empty($alumni->address)) ? "✓ PASS" : "✗ FAIL";
    echo "\n   Phone: " . ($alumni->phone_number ?? 'EMPTY') . "\n";
    echo "   Address: " . ($alumni->address ?? 'EMPTY') . "\n";
    
    echo "\n2. LinkedIn: ";
    echo !empty($alumni->linkedin_url) ? "✓ PASS" : "✗ FAIL";
    echo "\n   URL: " . ($alumni->linkedin_url ?? 'EMPTY') . "\n";
    
    echo "\n3. Active Job: ";
    echo $alumni->jobHistories()->whereNull('end_date')->exists() ? "✓ PASS" : "✗ FAIL";
    echo "\n   Active jobs: " . $alumni->jobHistories()->whereNull('end_date')->count() . "\n";
    
    echo "\n4. Skills: ";
    echo $alumni->skills()->exists() ? "✓ PASS" : "✗ FAIL";
    echo "\n   Skills count: " . $alumni->skills()->count() . "\n";
    
    echo "\n5. Bio (>20 chars): ";
    $bioPass = !empty($alumni->bio) && strlen($alumni->bio) > 20;
    echo $bioPass ? "✓ PASS" : "✗ FAIL";
    echo "\n   Bio: " . ($alumni->bio ?? 'EMPTY') . "\n";
    echo "   Length: " . strlen($alumni->bio ?? '') . "\n";
    
    echo "\n6. Work History: ";
    echo $alumni->jobHistories()->exists() ? "✓ PASS" : "✗ FAIL";
    echo "\n   Total jobs: " . $alumni->jobHistories()->count() . "\n";
    
    echo "\n7. Avatar: ";
    echo !empty($alumni->avatar) ? "✓ PASS" : "✗ FAIL";
    echo "\n   Avatar: " . ($alumni->avatar ?? 'EMPTY') . "\n";
    
    echo "\n---\n";
    echo "Profile Completeness: {$alumni->profile_completeness}%\n";
    echo "Missing Fields: " . implode(', ', $alumni->missing_fields) . "\n";
}
