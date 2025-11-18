<?php

namespace Database\Factories;

use App\Models\Alumni;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alumni>
 */
class AlumniFactory extends Factory
{
    /**
     * Nama model yang sesuai dengan factory ini.
     * @var string
     */
    protected $model = Alumni::class;

    // Mapping bidang karir dan kata kunci pekerjaan (SAMA DENGAN DI ADMIN CONTROLLER)
    private array $careerMapping = [
        'Web Development' => ['Frontend Developer', 'Backend Engineer (PHP)', 'Fullstack Developer (Vue)', 'Laravel Developer', 'React.js Developer'],
        'Mobile Development' => ['Android Developer (Kotlin)', 'iOS Developer (Swift)', 'React Native Engineer', 'Flutter Developer'],
        'Data & AI' => ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'Python Programmer'],
        'Infrastructure' => ['DevOps Engineer (AWS)', 'Cloud Engineer (GCP)', 'System Administrator', 'Network Engineer'],
        'Quality & Testing' => ['QA Tester', 'QA Automation Engineer', 'SDET'],
        'Design & Creative' => ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Multimedia Specialist'],
        'Management' => ['Product Manager', 'Scrum Master', 'Project Manager', 'Tech Lead'],
        'Belum Bekerja' => [null, null, null, null], // Opsi Belum Bekerja
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Tentukan Bidang Karir & Pekerjaan
        $careerFields = array_keys($this->careerMapping);
        $randomField = $this->faker->randomElement($careerFields);
        
        $jobTitle = $this->faker->randomElement($this->careerMapping[$randomField]);
        $company = $jobTitle ? $this->faker->company() : null;

        // Tentukan NIM, Angkatan, dan Tanggal Daftar yang realistis
        $year = $this->faker->numberBetween(2018, date('Y'));
        $nimPrefix = 'J0403'; 
        $nimRandom = $this->faker->unique()->numberBetween(10000, 99999);
        $nim = $nimPrefix . $nimRandom;
        
        // Tanggal pendaftaran (created_at) diatur secara acak dalam 2 tahun terakhir
        $createdAt = $this->faker->dateTimeBetween('-2 years', 'now');
        $name = $this->faker->name($this->faker->randomElement(['male', 'female'])); // Define name here

        // Buat User dummy jika diperlukan (di-handle di afterCreating)
        
        return [
            // Field Data Alumni
            'user_id' => null, // Akan diisi di afterCreating jika tidak di-set null
            'name' => $name, // Now correctly defined
            'nim' => $nim,
            'graduation_year' => $year,
            'major' => $this->faker->randomElement(['Teknologi Rekayasa Perangkat Lunak', 'Manajemen Informatika']),
            'phone_number' => $this->faker->phoneNumber(),
            'gender' => $this->faker->randomElement(['L', 'P']),
            'address' => $this->faker->randomElement([
                $this->faker->city() . ', Jawa Barat', 
                $this->faker->city() . ', Jawa Timur',
                'Jakarta', 
                'Bandung', 
                'Surabaya', 
                'Singapore', 
                'Tokyo'
            ]),
            
            // Field Karir
            'current_job' => $jobTitle,
            'company_name' => $company,
            'linkedin_url' => 'https://linkedin.com/in/' . $this->faker->userName(),
            
            // Waktu pendaftaran
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }
    
    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure(): static
    {
        // Pastikan User dibuat dan ditautkan ke Alumni, kecuali jika ditandai 'unlinked'
        return $this->afterCreating(function (Alumni $alumni) {
            // FIX: Hanya buat user jika user_id masih null. Jika alumni dibuat 
            // tanpa state khusus, user_id-nya null dan blok ini dieksekusi.
            if ($alumni->user_id === null) {
                
                // Ambil data penting dari alumni yang baru dibuat
                $alumniData = $alumni->only(['name']); // Tambahkan kolom yang dibutuhkan

                $user = User::create([
                    'name' => $alumniData['name'],
                    'email' => $this->faker->unique()->safeEmail(),
                    'password' => Hash::make('password'),
                    'role' => 'alumni',
                    'email_verified_at' => now(), // Default terverifikasi
                ]);
                $alumni->user_id = $user->id;
                $alumni->save();
            }
        });
    }

    /**
     * Indicate that the alumni does not have a user account yet (for registration testing).
     */
    public function unlinked(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'current_job' => null,
            'company_name' => null,
            'graduation_year' => $this->faker->numberBetween(date('Y') - 1, date('Y')), 
            'name' => $attributes['name'] ?? $this->faker->name(), // Ensure name exists
            'nim' => $attributes['nim'] ?? 'J0403' . $this->faker->unique()->numberBetween(10000, 99999), // Ensure nim exists
            'major' => $attributes['major'] ?? 'Teknologi Rekayasa Perangkat Lunak', // Ensure major exists
            'gender' => $attributes['gender'] ?? $this->faker->randomElement(['L', 'P']), // Ensure gender exists
        ])->afterCreating(function (Alumni $alumni) {
            // Karena ini unlinked, kita tidak melakukan apa-apa di afterCreating
        });
    }

    /**
     * Indicate that the user account exists but is not verified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            // Pastikan user_id null agar afterCreating terpicu
            'user_id' => null, 
            'name' => $attributes['name'] ?? $this->faker->name(), // Ensure name exists
            'nim' => $attributes['nim'] ?? 'J0403' . $this->faker->unique()->numberBetween(10000, 99999), // Ensure nim exists
            'major' => $attributes['major'] ?? 'Manajemen Informatika', // Ensure major exists
            'gender' => $attributes['gender'] ?? $this->faker->randomElement(['L', 'P']), // Ensure gender exists
        ])->afterCreating(function (Alumni $alumni) {
            // Buat User, tapi set email_verified_at = null
            $alumniData = $alumni->only(['name']);

            $user = User::create([
                'name' => $alumniData['name'],
                'email' => $this->faker->unique()->safeEmail(),
                'password' => Hash::make('password'),
                'role' => 'alumni',
                'email_verified_at' => null, // Belum terverifikasi
            ]);
            $alumni->user_id = $user->id;
            $alumni->save();
        });
    }
}