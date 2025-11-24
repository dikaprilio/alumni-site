<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Alumni;
use App\Models\Opportunity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOpportunityTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    protected function createAlumniWithOpportunity(): array
    {
        $user = User::factory()->create([
            'role' => 'alumni',
            'email_verified_at' => now(),
        ]);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);
        
        $opportunity = Opportunity::create([
            'alumni_id' => $alumni->id,
            'type' => 'JOB',
            'title' => 'Software Engineer Position',
            'description' => 'Looking for a skilled software engineer',
            'company_name' => 'Tech Corp',
            'location' => 'Jakarta',
            'contact_info' => 'hr@techcorp.com',
        ]);

        return ['user' => $user, 'alumni' => $alumni, 'opportunity' => $opportunity];
    }

    /** @test */
    public function admin_can_view_opportunities_index()
    {
        $admin = $this->createAdmin();
        $data = $this->createAlumniWithOpportunity();

        $response = $this->actingAs($admin)->get('/admin/opportunities');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('opportunities'));
    }

    /** @test */
    public function non_admin_cannot_access_opportunities_index()
    {
        $alumniUser = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);

        $response = $this->actingAs($alumniUser)->get('/admin/opportunities');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_search_opportunities()
    {
        $admin = $this->createAdmin();
        
        $user1 = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni1 = Alumni::factory()->for($user1)->noJobs()->create(['user_id' => $user1->id]);
        $opportunity1 = Opportunity::create([
            'alumni_id' => $alumni1->id,
            'type' => 'JOB',
            'title' => 'Frontend Developer',
            'description' => 'Description',
            'company_name' => 'Company A',
            'contact_info' => 'contact@example.com',
        ]);

        $user2 = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni2 = Alumni::factory()->for($user2)->noJobs()->create(['user_id' => $user2->id]);
        $opportunity2 = Opportunity::create([
            'alumni_id' => $alumni2->id,
            'type' => 'JOB',
            'title' => 'Backend Developer',
            'description' => 'Description',
            'company_name' => 'Company B',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($admin)->get('/admin/opportunities?search=Frontend');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Opportunities/Index')
                ->has('opportunities.data', 1)
        );
    }

    /** @test */
    public function admin_can_search_opportunities_by_company_name()
    {
        $admin = $this->createAdmin();
        
        $user1 = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni1 = Alumni::factory()->for($user1)->noJobs()->create(['user_id' => $user1->id]);
        $opportunity1 = Opportunity::create([
            'alumni_id' => $alumni1->id,
            'type' => 'JOB',
            'title' => 'Developer Position',
            'description' => 'Description',
            'company_name' => 'Google',
            'contact_info' => 'contact@example.com',
        ]);

        $user2 = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni2 = Alumni::factory()->for($user2)->noJobs()->create(['user_id' => $user2->id]);
        $opportunity2 = Opportunity::create([
            'alumni_id' => $alumni2->id,
            'type' => 'JOB',
            'title' => 'Developer Position',
            'description' => 'Description',
            'company_name' => 'Microsoft',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($admin)->get('/admin/opportunities?search=Google');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Opportunities/Index')
                ->has('opportunities.data', 1)
        );
    }

    /** @test */
    public function admin_can_delete_opportunity()
    {
        $admin = $this->createAdmin();
        $data = $this->createAlumniWithOpportunity();

        $response = $this->actingAs($admin)->delete("/admin/opportunities/{$data['opportunity']->id}");

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('opportunities', ['id' => $data['opportunity']->id]);
    }

    /** @test */
    public function admin_can_delete_job_opportunity()
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);
        
        $opportunity = Opportunity::create([
            'alumni_id' => $alumni->id,
            'type' => 'JOB',
            'title' => 'Job Position',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/opportunities/{$opportunity->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('opportunities', ['id' => $opportunity->id]);
    }

    /** @test */
    public function admin_can_delete_mentoring_opportunity()
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni = Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);
        
        $opportunity = Opportunity::create([
            'alumni_id' => $alumni->id,
            'type' => 'MENTORING',
            'title' => 'Mentoring Session',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/opportunities/{$opportunity->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('opportunities', ['id' => $opportunity->id]);
    }

    /** @test */
    public function opportunities_are_displayed_in_latest_order()
    {
        $admin = $this->createAdmin();
        
        $user1 = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni1 = Alumni::factory()->for($user1)->noJobs()->create(['user_id' => $user1->id]);
        $opportunity1 = Opportunity::create([
            'alumni_id' => $alumni1->id,
            'type' => 'JOB',
            'title' => 'First Opportunity',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);
        
        // Wait a moment to ensure different timestamps
        sleep(1);

        $user2 = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni2 = Alumni::factory()->for($user2)->noJobs()->create(['user_id' => $user2->id]);
        $opportunity2 = Opportunity::create([
            'alumni_id' => $alumni2->id,
            'type' => 'JOB',
            'title' => 'Second Opportunity',
            'description' => 'Description',
            'contact_info' => 'contact@example.com',
        ]);

        $response = $this->actingAs($admin)->get('/admin/opportunities');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Opportunities/Index')
                ->has('opportunities.data', 2)
        );
        
        // Verify order - latest should be first
        $opportunities = $response->getOriginalContent()->getData()['page']['props']['opportunities']['data'];
        $this->assertEquals('Second Opportunity', $opportunities[0]['title']);
        $this->assertEquals('First Opportunity', $opportunities[1]['title']);
    }
}
