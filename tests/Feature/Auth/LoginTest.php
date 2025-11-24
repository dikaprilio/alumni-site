<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\Alumni;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_login_page()
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_login_with_valid_credentials()
    {
        // Create a verified user with alumni profile
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'role' => 'alumni',
        ]);

        Alumni::factory()->create([
            'user_id' => $user->id,
            'phone_number' => '081234567890',
        ]);

        // Attempt login
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        // Should redirect to alumni routes (setup wizard or dashboard)
        $response->assertRedirect('/alumni');
        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors();
        $this->assertGuest();
    }

    /** @test */
    public function login_is_rate_limited_after_5_attempts()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Make 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', [
                'email' => 'test@example.com',
                'password' => 'wrong-password',
            ]);
        }

        // 6th attempt should be throttled
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(429); // Too Many Requests
    }

    /** @test */
    public function admin_can_login_via_admin_login_page()
    {
        $admin = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticatedAs($admin);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();

        $this->actingAs($user);
        $this->assertAuthenticated();

        $response = $this->post('/logout');

        $response->assertRedirect('/');
        $this->assertGuest();
    }
}
