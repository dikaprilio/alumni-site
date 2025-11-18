<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Skill;
use App\Models\Alumni;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bikin Akun ADMIN
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@alumni.com',
            'password' => Hash::make('password'), // Passwordnya: password
            'role' => 'admin',
            'email_verified_at' => now(), // Langsung verifikasi
        ]);

        // 2. Bikin Akun ALUMNI (Untuk tes login)
        $alumniUser = User::create([
            'name' => 'Budi Santoso',
            'email' => 'alumni@alumni.com',
            'password' => Hash::make('password'),
            'role' => 'alumni',
            'email_verified_at' => now(), // Langsung verifikasi
        ]);

        // Isi data detail alumninya (Wajib ada karena relasi)
        Alumni::create([
            'user_id' => $alumniUser->id, // Langsung ditautkan
            'name' => 'Budi Santoso', // Tambahkan nama
            'nim' => 'J3D119001',
            'graduation_year' => '2023',
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'phone_number' => '081234567890',
            'gender' => 'L',
            'address' => 'Jl. Kumbang No. 1, Bogor',
            'current_job' => 'Backend Developer',
            'company_name' => 'Tokopedia',
            'linkedin_url' => 'https://linkedin.com/in/budisantoso',
        ]);

        // 3. Bikin Data Alumni TANPA AKUN (Untuk tes registrasi)
        Alumni::create([
            'user_id' => null, // <-- PENTING: user_id-nya NULL
            'name' => 'Siti Aminah', // Tambahkan nama
            'nim' => 'J3D119002', // NIM untuk tes registrasi
            'graduation_year' => '2023',
            'major' => 'Manajemen Informatika',
            'phone_number' => '08987654321',
            'gender' => 'P',
            'address' => 'Jl. Pajajaran No. 10, Bogor',
            'current_job' => null,
            'company_name' => null,
            'linkedin_url' => null,
        ]);


        // 4. Bikin Data Master SKILL
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
    }
}