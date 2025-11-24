<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$userId = $_SERVER['argv'][1] ?? null;

if (!$userId) {
    echo "Usage: php debug_bio.php [user_id]\n";
    exit(1);
}

$user = App\Models\User::with(['alumni.jobHistories', 'alumni.skills'])->find($userId);

if (!$user || !$user->alumni) {
    echo "User not found or has no alumni record\n";
    exit(1);
}

$alumni = $user->alumni;

echo "=== Bio Debug for User #{$userId} ===\n";
echo "Name: {$user->name}\n";
echo "---\n";

echo "Bio Raw Value: [" . ($alumni->bio ?? 'NULL') . "]\n";
echo "Bio Length: " . strlen($alumni->bio ?? '') . "\n";
echo "empty(\$bio): " . (empty($alumni->bio) ? 'TRUE' : 'FALSE') . "\n";
echo "strlen(\$bio) > 20: " . (strlen($alumni->bio ?? '') > 20 ? 'TRUE' : 'FALSE') . "\n";
echo "Bio Criterion Pass: " . ((!empty($alumni->bio) && strlen($alumni->bio) > 20) ? '✓ YES' : '✗ NO') . "\n\n";

echo "Profile Completeness: {$alumni->profile_completeness}%\n";
echo "Missing Fields: " . implode(', ', $alumni->missing_fields) . "\n";
