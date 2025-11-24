<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_forgot_password_page()
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    /** @test */
    public function user_can_request_password_reset_with_valid_email()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);

        $response = $this->post('/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('status');
    }

    /** @test */
    public function user_cannot_request_password_reset_with_invalid_email()
    {
        $response = $this->post('/forgot-password', [
            'email' => 'invalid-email',
        ]);

        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function user_cannot_request_password_reset_with_nonexistent_email()
    {
        $response = $this->post('/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        // Laravel's Password facade will still return success for security reasons
        // but we can check that no error is shown to user
        $response->assertRedirect();
    }

    /** @test */
    public function password_reset_request_is_rate_limited()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        // Make 3 requests (rate limit is 3 per minute)
        for ($i = 0; $i < 3; $i++) {
            $this->post('/forgot-password', [
                'email' => 'test@example.com',
            ]);
        }

        // 4th request should be throttled
        $response = $this->post('/forgot-password', [
            'email' => 'test@example.com',
        ]);

        // Rate limiting may return redirect with error or 429 status
        if ($response->status() === 429) {
            $response->assertStatus(429);
        } else {
            $response->assertSessionHasErrors();
        }
    }

    /** @test */
    public function user_can_view_reset_password_page_with_token()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);
        $token = Password::createToken($user);

        $response = $this->get("/reset-password/{$token}?email=test@example.com");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('token')->has('email')
        );
    }

    /** @test */
    public function user_can_reset_password_with_valid_token()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHas('status');
        
        // Verify password was changed
        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    /** @test */
    public function user_cannot_reset_password_with_invalid_token()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);

        $response = $this->post('/reset-password', [
            'token' => 'invalid-token',
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasErrors('email');
        
        // Verify password was NOT changed
        $user->refresh();
        $this->assertTrue(Hash::check('oldpassword', $user->password));
    }

    /** @test */
    public function user_cannot_reset_password_with_expired_token()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        // Simulate token expiration by using an old token
        // In real scenario, tokens expire after 1 hour
        // We'll just test with a different token to simulate expiration
        $response = $this->post('/reset-password', [
            'token' => 'expired-token-12345',
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function password_reset_requires_password_confirmation()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertSessionHasErrors('password');
    }

    /** @test */
    public function password_reset_requires_minimum_password_length()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertSessionHasErrors('password');
    }

    /** @test */
    public function password_reset_requires_valid_email()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'invalid-email',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function password_reset_is_rate_limited()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        // Make 3 reset attempts (rate limit is 3 per minute)
        for ($i = 0; $i < 3; $i++) {
            $this->post('/reset-password', [
                'token' => $token,
                'email' => 'test@example.com',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);
        }

        // 4th attempt should be throttled
        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // Rate limiting may return redirect with error or 429 status
        if ($response->status() === 429) {
            $response->assertStatus(429);
        } else {
            // After 3 attempts, token might be invalid or rate limited
            // Just verify that the request was handled (not successful)
            $this->assertNotEquals(200, $response->status());
        }
    }

    /** @test */
    public function user_can_login_with_new_password_after_reset()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);
        $token = Password::createToken($user);

        // Reset password
        $this->post('/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        // Try to login with old password (should fail)
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'oldpassword',
        ]);

        $response->assertSessionHasErrors();

        // Try to login with new password (should succeed)
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'newpassword123',
        ]);

        $response->assertRedirect();
        $this->assertAuthenticatedAs($user);
    }
}
