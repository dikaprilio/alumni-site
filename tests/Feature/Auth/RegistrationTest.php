<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\Alumni;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_registration_step1()
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_check_valid_nim()
    {
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'John Doe',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->post('/register/check-nim', [
            'nim' => 'J040312345',
        ]);

        $response->assertRedirect('/register/create');
        $response->assertSessionHas('register_nim', 'J040312345');
        $response->assertSessionHas('register_name', 'John Doe');
    }

    /** @test */
    public function user_cannot_check_invalid_nim()
    {
        $response = $this->post('/register/check-nim', [
            'nim' => 'INVALID123',
        ]);

        $response->assertSessionHasErrors('nim');
    }

    /** @test */
    public function user_cannot_check_nim_that_already_has_account()
    {
        $user = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);
        $alumni = Alumni::factory()->for($user)->create([
            'nim' => 'J040312345',
            'user_id' => $user->id,
        ]);

        $response = $this->post('/register/check-nim', [
            'nim' => 'J040312345',
        ]);

        $response->assertSessionHasErrors('nim');
    }

    /** @test */
    public function user_can_view_registration_step2_with_valid_session()
    {
        $response = $this->withSession([
            'register_nim' => 'J040312345',
            'register_name' => 'John Doe',
        ])->get('/register/create');

        $response->assertStatus(200);
    }

    /** @test */
    public function user_cannot_view_registration_step2_without_session()
    {
        $response = $this->get('/register/create');

        $response->assertRedirect('/register');
    }

    /** @test */
    public function user_can_complete_registration()
    {
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'John Doe',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
            'register_name' => 'John Doe',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertRedirect('/email/verify');
        
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'alumni',
        ]);

        $alumni->refresh();
        $this->assertNotNull($alumni->user_id);
        $this->assertAuthenticated();
    }

    /** @test */
    public function registration_requires_unique_email()
    {
        $existingUser = User::factory()->create(['email' => 'existing@example.com']);
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'Test User',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function registration_requires_password_confirmation()
    {
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'Test User',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response->assertSessionHasErrors('password');
    }

    /** @test */
    public function registration_requires_valid_password()
    {
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'Test User',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'john@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertSessionHasErrors('password');
    }

    /** @test */
    public function registration_clears_session_after_success()
    {
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'John Doe',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
            'register_name' => 'John Doe',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionMissing('register_nim');
        $response->assertSessionMissing('register_name');
    }

    /** @test */
    public function user_cannot_register_with_nim_that_already_has_account()
    {
        $user = User::factory()->create(['role' => 'alumni']);
        $alumni = Alumni::factory()->for($user)->create([
            'nim' => 'J040312345',
            'user_id' => $user->id,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'new@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors('nim');
    }

    /** @test */
    public function registered_user_is_logged_in()
    {
        // Create alumni without user account
        $alumni = Alumni::create([
            'nim' => 'J040312345',
            'name' => 'John Doe',
            'graduation_year' => 2020,
            'major' => 'Teknologi Rekayasa Perangkat Lunak',
            'gender' => 'L',
            'user_id' => null,
        ]);

        $response = $this->withSession([
            'register_nim' => 'J040312345',
            'register_name' => 'John Doe',
        ])->post('/register', [
            'nim' => 'J040312345',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'john@example.com')->first();
        $this->assertAuthenticatedAs($user);
    }
}
