<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(4);
        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'category' => $this->faker->randomElement(['Webinar', 'Workshop', 'Reuni', 'Job Fair']),
            'description' => $this->faker->paragraphs(3, true),
            'event_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'location' => $this->faker->address(),
            'image' => null,
            'status' => $this->faker->randomElement(['upcoming', 'ongoing', 'finished']),
            'created_at' => now(),
        ];
    }
}
