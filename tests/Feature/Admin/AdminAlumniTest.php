<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Alumni;
use App\Models\JobHistory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminAlumniTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    protected function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    protected function createAlumni(): Alumni
    {
        $user = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        return Alumni::factory()->for($user)->noJobs()->create(['user_id' => $user->id]);
    }

    /** @test */
    public function admin_can_view_alumni_index()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();

        $response = $this->actingAs($admin)->get('/admin/alumni');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('alumni'));
    }

    /** @test */
    public function non_admin_cannot_access_alumni_index()
    {
        $alumniUser = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);

        $response = $this->actingAs($alumniUser)->get('/admin/alumni');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_create_alumni()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/alumni', [
            'name' => 'John Doe',
            'nim' => 'J040312345',
            'graduation_year' => 2023,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'email' => 'john@example.com',
            'phone_number' => '081234567890',
            'address' => 'Jakarta',
        ]);

        $response->assertRedirect('/admin/alumni');
        $this->assertDatabaseHas('alumnis', [
            'name' => 'John Doe',
            'nim' => 'J040312345',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'alumni',
        ]);
    }

    /** @test */
    public function admin_can_create_alumni_without_user_account()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/alumni', [
            'name' => 'Jane Doe',
            'nim' => 'J040312346',
            'graduation_year' => 2023,
            'major' => 'Manajemen Informatika',
        ]);

        $response->assertRedirect('/admin/alumni');
        $this->assertDatabaseHas('alumnis', [
            'name' => 'Jane Doe',
            'nim' => 'J040312346',
            'user_id' => null,
        ]);
    }

    /** @test */
    public function admin_can_create_alumni_with_job_history()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/alumni', [
            'name' => 'Bob Smith',
            'nim' => 'J040312347',
            'graduation_year' => 2022,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'current_position' => 'Software Engineer',
            'company_name' => 'Tech Corp',
        ]);

        $response->assertRedirect('/admin/alumni');
        
        $alumni = Alumni::where('nim', 'J040312347')->first();
        $this->assertNotNull($alumni);
        $this->assertEquals(1, $alumni->jobHistories()->count());
        $this->assertDatabaseHas('job_histories', [
            'alumni_id' => $alumni->id,
            'position' => 'Software Engineer',
            'company_name' => 'Tech Corp',
        ]);
    }

    /** @test */
    public function admin_can_view_edit_form()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();

        $response = $this->actingAs($admin)->get("/admin/alumni/{$alumni->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('alumni'));
    }

    /** @test */
    public function admin_can_update_alumni()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();

        $response = $this->actingAs($admin)->put("/admin/alumni/{$alumni->id}", [
            'name' => 'Updated Name',
            'nim' => $alumni->nim,
            'graduation_year' => 2024,
            'major' => 'Updated Major',
            'phone_number' => '081999999999',
            'address' => 'Updated Address',
        ]);

        $response->assertRedirect('/admin/alumni');
        $this->assertDatabaseHas('alumnis', [
            'id' => $alumni->id,
            'name' => 'Updated Name',
            'graduation_year' => 2024,
        ]);
    }

    /** @test */
    public function admin_can_delete_alumni()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();

        $response = $this->actingAs($admin)->delete("/admin/alumni/{$alumni->id}");

        $response->assertRedirect('/admin/alumni');
        $this->assertDatabaseMissing('alumnis', ['id' => $alumni->id]);
    }

    /** @test */
    public function admin_can_toggle_featured_alumni()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();

        // Toggle on
        $response = $this->actingAs($admin)->post("/admin/alumni/{$alumni->id}/toggle-featured");
        $response->assertRedirect();
        
        $alumni->refresh();
        $this->assertNotNull($alumni->featured_at);

        // Toggle off
        $response = $this->actingAs($admin)->post("/admin/alumni/{$alumni->id}/toggle-featured");
        $response->assertRedirect();
        
        $alumni->refresh();
        $this->assertNull($alumni->featured_at);
    }

    /** @test */
    public function admin_can_export_alumni_as_xlsx()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();

        $response = $this->actingAs($admin)->get('/admin/alumni/export?type=xlsx');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    /** @test */
    public function admin_can_search_alumni()
    {
        $admin = $this->createAdmin();
        $alumni1 = $this->createAlumni();
        $alumni1->update(['name' => 'John Doe']);
        
        $alumni2 = $this->createAlumni();
        $alumni2->update(['name' => 'Jane Smith']);

        $response = $this->actingAs($admin)->get('/admin/alumni?search=John');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Alumni/Index')
                ->has('alumni.data', 1)
        );
    }

    /** @test */
    public function creating_alumni_requires_unique_nim()
    {
        $admin = $this->createAdmin();
        $existingAlumni = $this->createAlumni();
        $existingAlumni->update(['nim' => 'J040312345']);

        $response = $this->actingAs($admin)->post('/admin/alumni', [
            'name' => 'Duplicate NIM',
            'nim' => 'J040312345', // Same NIM
            'graduation_year' => 2023,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
        ]);

        $response->assertSessionHasErrors('nim');
    }

    /** @test */
    public function updating_alumni_allows_same_nim()
    {
        $admin = $this->createAdmin();
        $alumni = $this->createAlumni();
        $alumni->update(['nim' => 'J040312345']);

        $response = $this->actingAs($admin)->put("/admin/alumni/{$alumni->id}", [
            'name' => 'Updated Name',
            'nim' => 'J040312345', // Same NIM should be allowed
            'graduation_year' => $alumni->graduation_year,
            'major' => $alumni->major,
        ]);

        $response->assertRedirect('/admin/alumni');
        $this->assertDatabaseHas('alumnis', [
            'id' => $alumni->id,
            'name' => 'Updated Name',
        ]);
    }
}
