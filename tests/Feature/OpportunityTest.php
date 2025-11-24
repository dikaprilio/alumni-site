<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Alumni;
use App\Models\Opportunity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OpportunityTest extends TestCase
{
    use RefreshDatabase;

    protected function createAlumniUser(): User
    {
        $user = User::factory()->create([
            'role' => 'alumni',
            'email_verified_at' => now(),
        ]);
        Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);
        return $user;
    }

    /** @test */
    public function alumni_can_view_opportunities_index()
    {
        $user = $this->createAlumniUser();
        $opportunity = Opportunity::create([
            'alumni_id' => $user->alumni->id,
            'type' => 'JOB',
            'title' => 'Software Engineer Position',
            'description' => 'Looking for a software engineer',
            'contact_info' => 'hr@company.com',
        ]);

        $response = $this->actingAs($user)->get('/opportunities');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('opportunities'));
    }

    /** @test */
    public function alumni_can_create_job_opportunity()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Software Engineer',
            'description' => 'We are looking for a skilled software engineer',
            'company_name' => 'Tech Corp',
            'location' => 'Jakarta',
            'contact_info' => 'hr@techcorp.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('message');
        
        $this->assertDatabaseHas('opportunities', [
            'alumni_id' => $user->alumni->id,
            'type' => 'JOB',
            'title' => 'Software Engineer',
            'company_name' => 'Tech Corp',
            'location' => 'Jakarta',
            'contact_info' => 'hr@techcorp.com',
        ]);
    }

    /** @test */
    public function alumni_can_create_mentoring_opportunity()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'MENTORING',
            'title' => 'Career Mentoring Session',
            'description' => 'I offer career mentoring for junior developers',
            'contact_info' => 'mentor@example.com',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('opportunities', [
            'alumni_id' => $user->alumni->id,
            'type' => 'MENTORING',
            'title' => 'Career Mentoring Session',
            'contact_info' => 'mentor@example.com',
        ]);
    }

    /** @test */
    public function alumni_can_create_opportunity_with_whatsapp_contact()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Position',
            'description' => 'Description here',
            'contact_info' => '+6281234567890',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('opportunities', [
            'alumni_id' => $user->alumni->id,
            'contact_info' => '+6281234567890',
        ]);
    }

    /** @test */
    public function alumni_can_create_opportunity_with_url_contact()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Position',
            'description' => 'Description here',
            'contact_info' => 'linkedin.com/in/recruiter',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('opportunities', [
            'alumni_id' => $user->alumni->id,
            'contact_info' => 'linkedin.com/in/recruiter',
        ]);
    }

    /** @test */
    public function alumni_can_delete_own_opportunity()
    {
        $user = $this->createAlumniUser();
        $opportunity = Opportunity::create([
            'alumni_id' => $user->alumni->id,
            'type' => 'JOB',
            'title' => 'My Job Post',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($user)->delete("/opportunities/{$opportunity->id}");

        $response->assertRedirect();
        $response->assertSessionHas('message');
        $this->assertDatabaseMissing('opportunities', ['id' => $opportunity->id]);
    }

    /** @test */
    public function alumni_cannot_delete_other_opportunity()
    {
        $user1 = $this->createAlumniUser();
        $user2 = $this->createAlumniUser();
        
        $opportunity = Opportunity::create([
            'alumni_id' => $user2->alumni->id,
            'type' => 'JOB',
            'title' => 'Other User Job',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($user1)->delete("/opportunities/{$opportunity->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('opportunities', ['id' => $opportunity->id]);
    }

    /** @test */
    public function creating_opportunity_requires_type()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'title' => 'Job Title',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response->assertSessionHasErrors('type');
    }

    /** @test */
    public function creating_opportunity_requires_valid_type()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'INVALID',
            'title' => 'Job Title',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response->assertSessionHasErrors('type');
    }

    /** @test */
    public function creating_opportunity_requires_title()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response->assertSessionHasErrors('title');
    }

    /** @test */
    public function creating_opportunity_requires_description()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Title',
            'contact_info' => 'contact@example.com',
        ]);

        $response->assertSessionHasErrors('description');
    }

    /** @test */
    public function creating_opportunity_requires_contact_info()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Title',
            'description' => 'Description',
        ]);

        $response->assertSessionHasErrors('contact_info');
    }

    /** @test */
    public function contact_info_must_be_valid_email_phone_or_url()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Title',
            'description' => 'Description',
            'contact_info' => 'invalid-contact',
        ]);

        $response->assertSessionHasErrors('contact_info');
    }

    /** @test */
    public function company_name_and_location_are_optional()
    {
        $user = $this->createAlumniUser();

        $response = $this->actingAs($user)->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Title',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('opportunities', [
            'alumni_id' => $user->alumni->id,
            'title' => 'Job Title',
            'company_name' => null,
            'location' => null,
        ]);
    }

    /** @test */
    public function guest_cannot_create_opportunity()
    {
        $response = $this->post('/opportunities', [
            'type' => 'JOB',
            'title' => 'Job Title',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response->assertRedirect('/login');
    }

    /** @test */
    public function guest_cannot_delete_opportunity()
    {
        $user = $this->createAlumniUser();
        $opportunity = Opportunity::create([
            'alumni_id' => $user->alumni->id,
            'type' => 'JOB',
            'title' => 'Job Post',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->delete("/opportunities/{$opportunity->id}");

        $response->assertRedirect('/login');
    }
}
