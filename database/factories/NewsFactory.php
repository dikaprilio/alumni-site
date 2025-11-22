<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(6);
        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'category' => $this->faker->randomElement(['Karir', 'Kampus', 'Teknologi', 'Alumni']),
            'content' => $this->faker->paragraphs(3, true),
            'image' => null, // Bisa diisi URL dummy jika ada
            'user_id' => User::inRandomOrder()->first()->id ?? 1, // Ambil user acak atau default ke 1
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
