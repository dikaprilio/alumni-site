<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Skill;
use App\Models\Alumni;
use App\Models\News; // Tambahkan News untuk dummy activity
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan tabel dikosongkan sebelum diisi ulang (jika menggunakan refresh)
        // User::truncate(); 
        // Alumni::truncate();
        // News::truncate(); 
        // Skill::truncate(); 

        // 1. Bikin Akun ADMIN
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@alumni.com',
            'password' => Hash::make('password'), // Passwordnya: password
            'role' => 'admin',
            'email_verified_at' => now(), // Langsung verifikasi
        ]);

        // 2. Bikin Akun ALUMNI Contoh (1 user login)
        $alumniUser = User::create([
            'name' => 'Budi Santoso',
            'email' => 'alumni@alumni.com',
            'password' => Hash::make('password'),
            'role' => 'alumni',
            'email_verified_at' => now(), // Langsung verifikasi
        ]);

        // Isi data detail alumninya
        $alumni1 = Alumni::create([
            'user_id' => $alumniUser->id,
            'name' => 'Budi Santoso',
            'nim' => 'J3D119001',
            'graduation_year' => '2023',
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'phone_number' => '081234567890',
            'gender' => 'L',
            'address' => 'Jl. Kumbang No. 1, Bogor',
            'linkedin_url' => 'https://linkedin.com/in/budisantoso',
            'created_at' => now()->subMonths(6)
        ]);

        // Create Job History for Budi
        $alumni1->jobHistories()->create([
            'position' => 'Backend Developer (Laravel)',
            'company_name' => 'Tokopedia',
            'start_date' => now()->subMonths(6),
            'end_date' => null, // Active
            'description' => 'Developing backend services.'
        ]);

        // 3. Bikin Data Alumni TANPA AKUN (Untuk tes registrasi)
        Alumni::create([
            'user_id' => null,
            'name' => 'Siti Aminah',
            'nim' => 'J3D119002', 
            'graduation_year' => '2023',
            'major' => 'Manajemen Informatika',
            'phone_number' => '08987654321',
            'gender' => 'P',
            'address' => 'Jl. Pajajaran No. 10, Bogor',
            'linkedin_url' => null,
            'created_at' => now()->subMonths(1)
        ]);


        // --- 4. GENERATE DUMMY ALUMNI (Reduced) ---
        // Alumni dengan akun terverifikasi
        Alumni::factory()->count(10)->create(); 
        
        // Alumni dengan akun BELUM terverifikasi
        Alumni::factory()->count(2)->unverified()->create(); 

        // Alumni yang datanya ada, tapi belum punya akun user
        Alumni::factory()->count(2)->unlinked()->create(); 

        
        // 5. Bikin Data Master SKILL (Unchanged)
        $skills = [
            ['name' => 'Laravel', 'category' => 'hardskill'],
            ['name' => 'React.js', 'category' => 'hardskill'],
            ['name' => 'PostgreSQL', 'category' => 'hardskill'],
            ['name' => 'Public Speaking', 'category' => 'softskill'],
            ['name' => 'Leadership', 'category' => 'softskill'],
            ['name' => 'English', 'category' => 'softskill'],
            ['name' => 'UI/UX Design', 'category' => 'hardskill'],
            ['name' => 'Python', 'category' => 'hardskill'],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }

        // 6. DUMMY NEWS UNTUK AKTIVITAS DASHBOARD
        News::create([
            'user_id' => 1, // Super Admin
            'title' => 'Pendaftaran Reuni Akbar 2025 dibuka',
            'slug' => 'pendaftaran-reuni-akbar-2025-dibuka',
            'content' => 'Detail acara reuni akbar...',
            'created_at' => now()->subDays(2)
        ]);

        // Generate random News (Reduced)
        News::factory()->count(5)->create();

        // 7. DUMMY EVENTS (Reduced)
        \App\Models\Event::factory()->count(3)->create();
    }
}