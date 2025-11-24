<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminNewsTest extends TestCase
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

    protected function createNews(User $admin): News
    {
        return News::create([
            'user_id' => $admin->id,
            'title' => 'Test News',
            'category' => 'General',
            'slug' => 'test-news-' . time(),
            'content' => 'This is test news content',
        ]);
    }

    /** @test */
    public function admin_can_view_news_index()
    {
        $admin = $this->createAdmin();
        $news = $this->createNews($admin);

        $response = $this->actingAs($admin)->get('/admin/news');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('news'));
    }

    /** @test */
    public function non_admin_cannot_access_news_index()
    {
        $alumniUser = User::factory()->create(['role' => 'alumni', 'email_verified_at' => now()]);

        $response = $this->actingAs($alumniUser)->get('/admin/news');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_create_news()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/news', [
            'title' => 'New News Article',
            'category' => 'Announcement',
            'content' => 'This is the content of the news article.',
        ]);

        $response->assertRedirect('/admin/news');
        $this->assertDatabaseHas('news', [
            'title' => 'New News Article',
            'category' => 'Announcement',
            'user_id' => $admin->id,
        ]);
    }

    /** @test */
    public function admin_can_create_news_with_image()
    {
        $admin = $this->createAdmin();
        $file = UploadedFile::fake()->image('news.jpg', 800, 600);

        $response = $this->actingAs($admin)->post('/admin/news', [
            'title' => 'News with Image',
            'category' => 'General',
            'content' => 'Content here',
            'image' => $file,
        ]);

        $response->assertRedirect('/admin/news');
        
        $news = News::where('title', 'News with Image')->first();
        $this->assertNotNull($news);
        $this->assertNotNull($news->image);
        $this->assertStringContainsString('.webp', $news->image);
        Storage::disk('public')->assertExists($news->image);
    }

    /** @test */
    public function admin_can_view_edit_form()
    {
        $admin = $this->createAdmin();
        $news = $this->createNews($admin);

        $response = $this->actingAs($admin)->get("/admin/news/{$news->id}/edit");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('news'));
    }

    /** @test */
    public function admin_can_update_news()
    {
        $admin = $this->createAdmin();
        $news = $this->createNews($admin);

        $response = $this->actingAs($admin)->put("/admin/news/{$news->id}", [
            'title' => 'Updated News Title',
            'category' => 'Updated Category',
            'content' => 'Updated content here',
        ]);

        $response->assertRedirect('/admin/news');
        $this->assertDatabaseHas('news', [
            'id' => $news->id,
            'title' => 'Updated News Title',
            'category' => 'Updated Category',
        ]);
    }

    /** @test */
    public function admin_can_update_news_with_new_image()
    {
        $admin = $this->createAdmin();
        $news = $this->createNews($admin);
        $oldImage = 'news/old-image.webp';
        $news->update(['image' => $oldImage]);
        
        $newFile = UploadedFile::fake()->image('new-news.jpg', 800, 600);

        $response = $this->actingAs($admin)->put("/admin/news/{$news->id}", [
            'title' => $news->title,
            'category' => $news->category,
            'content' => $news->content,
            'image' => $newFile,
        ]);

        $response->assertRedirect('/admin/news');
        $news->refresh();
        $this->assertNotNull($news->image);
        $this->assertNotEquals($oldImage, $news->image);
    }

    /** @test */
    public function admin_can_delete_news()
    {
        $admin = $this->createAdmin();
        $news = $this->createNews($admin);

        $response = $this->actingAs($admin)->delete("/admin/news/{$news->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }

    /** @test */
    public function admin_can_search_news()
    {
        $admin = $this->createAdmin();
        $news1 = News::create([
            'user_id' => $admin->id,
            'title' => 'First News Article',
            'category' => 'General',
            'slug' => 'first-news',
            'content' => 'Content 1',
        ]);
        $news2 = News::create([
            'user_id' => $admin->id,
            'title' => 'Second News Article',
            'category' => 'General',
            'slug' => 'second-news',
            'content' => 'Content 2',
        ]);

        $response = $this->actingAs($admin)->get('/admin/news?search=First');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/News/Index')
                ->has('news.data', 1)
        );
    }

    /** @test */
    public function admin_can_filter_news_by_category()
    {
        $admin = $this->createAdmin();
        $news1 = News::create([
            'user_id' => $admin->id,
            'title' => 'Announcement News',
            'category' => 'Announcement',
            'slug' => 'announcement-news',
            'content' => 'Content',
        ]);
        $news2 = News::create([
            'user_id' => $admin->id,
            'title' => 'General News',
            'category' => 'General',
            'slug' => 'general-news',
            'content' => 'Content',
        ]);

        $response = $this->actingAs($admin)->get('/admin/news?category=Announcement');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Admin/News/Index')
                ->has('news.data', 1)
        );
    }

    /** @test */
    public function creating_news_requires_title()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/news', [
            'category' => 'General',
            'content' => 'Content without title',
        ]);

        $response->assertSessionHasErrors('title');
    }

    /** @test */
    public function creating_news_requires_category()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/news', [
            'title' => 'News Title',
            'content' => 'Content without category',
        ]);

        $response->assertSessionHasErrors('category');
    }

    /** @test */
    public function creating_news_requires_content()
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/news', [
            'title' => 'News Title',
            'category' => 'General',
        ]);

        $response->assertSessionHasErrors('content');
    }

    /** @test */
    public function updating_news_slug_changes_when_title_changes()
    {
        $admin = $this->createAdmin();
        $news = $this->createNews($admin);
        $oldSlug = $news->slug;

        $response = $this->actingAs($admin)->put("/admin/news/{$news->id}", [
            'title' => 'Completely Different Title',
            'category' => $news->category,
            'content' => $news->content,
        ]);

        $response->assertRedirect('/admin/news');
        $news->refresh();
        $this->assertNotEquals($oldSlug, $news->slug);
        $this->assertStringContainsString('completely-different-title', $news->slug);
    }
}
