<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminEventTest extends TestCase
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

    protected function createEvent(User $admin): Event
    {
        return Event::create([
            'user_id' => $admin->id,
            'title' => 'Test Event',
            'category' => 'General',
            'slug' => 'test-event-' . time(),
            'event_date' => now()->addDays(30),
            'location' => 'Test Location',
            'description' => 'This is test event description',
        ]);
    }

    /** @test */
    public function admin_can_view_events_index()
    {
        $admin = $this->createAdmin();
        $event = $this->createEvent($admin);

        $response = $this->actingAs($admin)->get('/admin/events');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('events'));
    }

    /** @test */
    public function non_admin_cannot_access_events_index()
    {
        $alumniUser = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);

        $response = $this->actingAs($alumniUser)->get('/admin/events');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_create_event()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/events', [
            'title' => 'New Event',
            'category' => 'Workshop',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'location' => 'Jakarta Convention Center',
            'description' => 'This is a new event description.',
        ]);

        $response->assertRedirect('/admin/events');
        $this->assertDatabaseHas('events', [
            'title' => 'New Event',
            'category' => 'Workshop',
            'location' => 'Jakarta Convention Center',
            'user_id' => $admin->id,
        ]);
    }

    /** @test */
    public function admin_can_create_event_with_image()
    {
        $admin = $this->createAdmin();
        $file = UploadedFile::fake()->image('event.jpg', 800, 600);

        $response = $this->actingAs($admin)->post('/admin/events', [
            'title' => 'Event with Image',
            'category' => 'General',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'location' => 'Test Location',
            'description' => 'Content here',
            'image' => $file,
        ]);

        $response->assertRedirect('/admin/events');
        
        $event = Event::where('title', 'Event with Image')->first();
        $this->assertNotNull($event);
        $this->assertNotNull($event->image);
        $this->assertStringContainsString('.webp', $event->image);
        Storage::disk('public')->assertExists($event->image);
    }

    /** @test */
    public function admin_can_view_edit_form()
    {
        $admin = $this->createAdmin();
        $event = $this->createEvent($admin);

        $response = $this->actingAs($admin)->get("/admin/events/{$event->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('event'));
    }

    /** @test */
    public function admin_can_update_event()
    {
        $admin = $this->createAdmin();
        $event = $this->createEvent($admin);

        $response = $this->actingAs($admin)->put("/admin/events/{$event->id}", [
            'title' => 'Updated Event Title',
            'category' => 'Updated Category',
            'event_date' => now()->addDays(60)->format('Y-m-d'),
            'location' => 'Updated Location',
            'description' => 'Updated description here',
        ]);

        $response->assertRedirect('/admin/events');
        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'title' => 'Updated Event Title',
            'category' => 'Updated Category',
            'location' => 'Updated Location',
        ]);
    }

    /** @test */
    public function admin_can_update_event_with_new_image()
    {
        $admin = $this->createAdmin();
        $event = $this->createEvent($admin);
        $oldImage = 'events/old-image.webp';
        $event->update(['image' => $oldImage]);
        
        $newFile = UploadedFile::fake()->image('new-event.jpg', 800, 600);

        $response = $this->actingAs($admin)->put("/admin/events/{$event->id}", [
            'title' => $event->title,
            'category' => $event->category,
            'event_date' => $event->event_date->format('Y-m-d'),
            'location' => $event->location,
            'description' => $event->description,
            'image' => $newFile,
        ]);

        $response->assertRedirect('/admin/events');
        $event->refresh();
        $this->assertNotNull($event->image);
        $this->assertNotEquals($oldImage, $event->image);
    }

    /** @test */
    public function admin_can_delete_event()
    {
        $admin = $this->createAdmin();
        $event = $this->createEvent($admin);

        $response = $this->actingAs($admin)->delete("/admin/events/{$event->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }

    /** @test */
    public function admin_can_search_events()
    {
        $admin = $this->createAdmin();
        $event1 = Event::create([
            'user_id' => $admin->id,
            'title' => 'First Event',
            'category' => 'General',
            'slug' => 'first-event',
            'event_date' => now()->addDays(30),
            'location' => 'Location 1',
            'description' => 'Content 1',
        ]);
        $event2 = Event::create([
            'user_id' => $admin->id,
            'title' => 'Second Event',
            'category' => 'General',
            'slug' => 'second-event',
            'event_date' => now()->addDays(40),
            'location' => 'Location 2',
            'description' => 'Content 2',
        ]);

        $response = $this->actingAs($admin)->get('/admin/events?search=First');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Events/Index')
                ->has('events.data', 1)
        );
    }

    /** @test */
    public function admin_can_filter_events_by_category()
    {
        $admin = $this->createAdmin();
        $event1 = Event::create([
            'user_id' => $admin->id,
            'title' => 'Workshop Event',
            'category' => 'Workshop',
            'slug' => 'workshop-event',
            'event_date' => now()->addDays(30),
            'location' => 'Location 1',
            'description' => 'Content',
        ]);
        $event2 = Event::create([
            'user_id' => $admin->id,
            'title' => 'General Event',
            'category' => 'General',
            'slug' => 'general-event',
            'event_date' => now()->addDays(40),
            'location' => 'Location 2',
            'description' => 'Content',
        ]);

        $response = $this->actingAs($admin)->get('/admin/events?category=Workshop');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/Events/Index')
                ->has('events.data', 1)
        );
    }

    /** @test */
    public function creating_event_requires_title()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/events', [
            'category' => 'General',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'location' => 'Test Location',
            'description' => 'Content without title',
        ]);

        $response->assertSessionHasErrors('title');
    }

    /** @test */
    public function creating_event_requires_category()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/events', [
            'title' => 'Event Title',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'location' => 'Test Location',
            'description' => 'Content without category',
        ]);

        $response->assertSessionHasErrors('category');
    }

    /** @test */
    public function creating_event_requires_event_date()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/events', [
            'title' => 'Event Title',
            'category' => 'General',
            'location' => 'Test Location',
            'description' => 'Content without date',
        ]);

        $response->assertSessionHasErrors('event_date');
    }

    /** @test */
    public function creating_event_requires_location()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/events', [
            'title' => 'Event Title',
            'category' => 'General',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'description' => 'Content without location',
        ]);

        $response->assertSessionHasErrors('location');
    }

    /** @test */
    public function creating_event_requires_description()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/events', [
            'title' => 'Event Title',
            'category' => 'General',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'location' => 'Test Location',
        ]);

        $response->assertSessionHasErrors('description');
    }

    /** @test */
    public function updating_event_slug_changes_when_title_changes()
    {
        $admin = $this->createAdmin();
        $event = $this->createEvent($admin);
        $oldSlug = $event->slug;

        $response = $this->actingAs($admin)->put("/admin/events/{$event->id}", [
            'title' => 'Completely Different Title',
            'category' => $event->category,
            'event_date' => $event->event_date->format('Y-m-d'),
            'location' => $event->location,
            'description' => $event->description,
        ]);

        $response->assertRedirect('/admin/events');
        $event->refresh();
        $this->assertNotEquals($oldSlug, $event->slug);
        $this->assertStringContainsString('completely-different-title', $event->slug);
    }
}
