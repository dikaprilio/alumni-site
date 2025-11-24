<?php

namespace Tests\Feature\Profile;

use App\Models\User;
use App\Models\Alumni;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /** @test */
    public function alumni_can_update_profile()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $alumni = Alumni::factory()
            ->for($user)
            ->noJobs()
            ->create([
                'user_id' => $user->id,
                'bio' => null,
            ]);

        $this->actingAs($user);

        $response = $this->post('/alumni/edit', [
            'phone_number' => '081234567890',
            'address' => 'Jakarta, Indonesia',
            'bio' => 'This is a test bio with more than twenty one characters to pass validation',
            'linkedin_url' => 'https://linkedin.com/in/test',
            'graduation_year' => 2020,
            'major' => 'Computer Science',
            'skills' => [],
        ]);

        $response->assertSessionHasNoErrors();
        
        $this->assertDatabaseHas('alumnis', [
            'id' => $alumni->id,
            'phone_number' => '081234567890',
            'address' => 'Jakarta, Indonesia',
        ]);
    }

    /** @test */
    public function alumni_can_upload_avatar()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $file = UploadedFile::fake()->image('avatar.jpg', 500, 500);

        $response = $this->post('/alumni/edit', [
            'phone_number' => '081234567890',
            'address' => 'Jakarta',
            'bio' => 'This is a test bio with more than twenty one characters',
            'graduation_year' => 2020,
            'major' => 'CS',
            'avatar' => $file,
            'skills' => [],
        ]);

        $response->assertSessionHasNoErrors();
        
        // Check that avatar path was saved (should be WebP)
        $alumni->refresh();
        $this->assertNotNull($alumni->avatar);
        $this->assertStringContainsString('.webp', $alumni->avatar);
        
        // Check that file exists in storage
        Storage::disk('public')->assertExists($alumni->avatar);
    }

    /** @test */
    public function profile_completeness_is_calculated_correctly()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $skill = Skill::factory()->create();
        
        $alumni = Alumni::factory()->for($user)->noJobs()->create([
            'user_id' => $user->id,
            'phone_number' => '08123456789',
            'address' => 'Jakarta',
            'linkedin_url' => 'https://linkedin.com/in/test',
            'bio' => 'A comprehensive bio that exceeds twenty characters minimum',
            'avatar' => 'avatars/test.webp',
        ]);

        // Add active job
        $alumni->jobHistories()->create([
            'company_name' => 'Test Company',
            'position' => 'Developer',
            'start_date' => now(),
            'end_date' => null,
        ]);

        // Add skill
        $alumni->skills()->attach($skill->id);

        $alumni->refresh();
        
        // Should be 100% (all 7 criteria met)
        $this->assertEquals(100, $alumni->profile_completeness);
    }

    /** @test */
    public function bio_must_be_at_least_21_characters()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->post('/alumni/edit', [
            'phone_number' => '081234567890',
            'address' => 'Jakarta',
            'bio' => 'Short bio',  // Only 9 characters
            'graduation_year' => 2020,
            'major' => 'CS',
            'skills' => [],
        ]);

        $response->assertSessionHasErrors('bio');
    }

    /** @test */
    public function alumni_can_add_job_history()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->post('/alumni/jobs', [
            'company_name' => 'Google',
            'position' => 'Software Engineer',
            'start_date' => '2020-01-01',
            'end_date' => null,
            'description' => 'Working on cool projects and building awesome stuff for users',
        ]);

        $response->assertSessionHasNoErrors();
        
        // Should only have the one job we just added
        $this->assertEquals(1, $alumni->jobHistories()->count());
        
        $this->assertDatabaseHas('job_histories', [
            'alumni_id' => $alumni->id,
            'company_name' => 'Google',
            'position' => 'Software Engineer',
        ]);
    }

    /** @test */
    public function alumni_can_delete_job_history()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);

        // Create our own job
        $job = $alumni->jobHistories()->create([
            'company_name' => 'Old Company',
            'position' => 'Developer',
            'start_date' => '2019-01-01',
            'end_date' => '2020-01-01',
        ]);

        $this->actingAs($user);

        $response = $this->delete("/alumni/jobs/{$job->id}");

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('job_histories', ['id' => $job->id]);
    }
}
