<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\JobPosting;
use App\Models\News;
use App\Models\Event;
use App\Models\User;
use App\Models\JobHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        // --- 1. STATISTIK UTAMA ---
        $totalAlumni = Alumni::count();
        $totalJobs = JobPosting::count();
        $totalNews = News::count();
        $totalEvents = Event::count();
        $totalPending = User::whereNull('email_verified_at')->count(); 

        // Pertumbuhan (New this month)
        $newAlumniMonth = Alumni::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
        $newJobsMonth = JobPosting::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        // --- 2. CHART 1: ALUMNI PER TAHUN LULUS (Bar Chart) ---
        $chartData = Alumni::select('graduation_year', DB::raw('count(*) as total'))
            ->whereNotNull('graduation_year')
            ->groupBy('graduation_year')
            ->orderBy('graduation_year', 'desc')
            ->limit(5)
            ->get()
            ->sortBy('graduation_year')
            ->values();

        // --- 3. DATA BARU: CAREER STATS (Employment Rate) ---
        // Hitung yang sudah bekerja vs belum (berdasarkan active job history)
        $employedCount = Alumni::whereHas('jobHistories', function($q) {
            $q->whereNull('end_date');
        })->count();
        
        $unemployedCount = $totalAlumni - $employedCount;

        $careerStats = [
            'employed' => $employedCount,
            'unemployed' => $unemployedCount,
            'rate' => $totalAlumni > 0 ? round(($employedCount / $totalAlumni) * 100) : 0
        ];

        // --- 4. DATA BARU: TOP 5 POSISI PEKERJAAN ---
        // Ambil dari JobHistory yang aktif
        $topPositions = JobHistory::select('position as current_position', DB::raw('count(*) as total'))
            ->whereNull('end_date')
            ->groupBy('position')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        // --- 5. CHART 3: TREN PENDAFTARAN (Line Chart) - FIXED LOGIC ---
        // Gunakan PHP untuk generate range 6 bulan terakhir agar data selalu lengkap (tidak hanya bulan yg ada datanya)
        // Ini juga mengatasi masalah kompatibilitas SQL (DATE_FORMAT vs strftime vs TO_CHAR)
        
        $months = collect(range(5, 0))->map(function ($i) {
            return Carbon::now()->subMonths($i);
        });

        // Ambil raw data user 6 bulan terakhir
        $usersRecent = User::select('created_at')
            ->where('created_at', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->created_at)->format('Y-m');
            });

        // Mapping data agar format konsisten [ {month_year, month_name, count} ]
        $monthlyGrowth = $months->map(function ($date) use ($usersRecent) {
            $key = $date->format('Y-m');
            return [
                'month_year' => $key,
                'month_name' => $date->translatedFormat('F'), // Nama bulan (Januari, Februari...) otomatis sesuai locale app
                'count' => isset($usersRecent[$key]) ? $usersRecent[$key]->count() : 0
            ];
        })->values();

        // --- 6. ACTIVITY LOG ---
        $logs = collect();

        $users = User::latest()->take(3)->get()->map(function ($item) {
            return [
                'id' => 'u-' . $item->id,
                'type' => 'USER',
                'message' => $item->name . ' registered.',
                'time' => $item->created_at,
                'icon' => 'fa-solid fa-user-plus', // Pastikan prefix fa-solid ada
                'color' => 'blue' // Sesuaikan dengan CARD_THEMES di frontend
            ];
        });

        $news = News::latest()->take(3)->get()->map(function ($item) {
            return [
                'id' => 'n-' . $item->id,
                'type' => 'NEWS',
                'message' => 'Published: "' . \Illuminate\Support\Str::limit($item->title, 15) . '"',
                'time' => $item->created_at,
                'icon' => 'fa-solid fa-newspaper',
                'color' => 'amber'
            ];
        });

        $jobs = JobPosting::latest()->take(3)->get()->map(function ($item) {
            return [
                'id' => 'j-' . $item->id,
                'type' => 'JOB',
                'message' => 'Job posted: ' . \Illuminate\Support\Str::limit($item->title, 15),
                'time' => $item->created_at,
                'icon' => 'fa-solid fa-briefcase',
                'color' => 'purple'
            ];
        });

        $activityLog = $logs->concat($users)->concat($news)->concat($jobs)
            ->sortByDesc('time')
            ->take(6)
            ->values();

        // --- 7. NOTIFICATIONS ---
        $notifications = [];
        if ($totalPending > 0) {
            $notifications[] = [
                'id' => 1,
                'title' => 'Verifikasi Diperlukan',
                'desc' => "$totalPending pengguna menunggu verifikasi email.",
                'priority' => 'high',
                'time' => 'Sekarang'
            ];
        }
        $notifications[] = [
            'id' => 2,
            'title' => 'System Update',
            'desc' => 'Sinkronisasi data trace study selesai.',
            'priority' => 'low',
            'time' => '2j lalu'
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'alumni' => ['total' => $totalAlumni, 'new' => $newAlumniMonth],
                'jobs' => ['total' => $totalJobs, 'new' => $newJobsMonth],
                'news' => $totalNews,
                'events' => $totalEvents,
                'pending' => $totalPending
            ],
            'chartData' => $chartData,
            'careerStats' => $careerStats, 
            'topPositions' => $topPositions, 
            'monthlyGrowth' => $monthlyGrowth, // Data chart yang sudah diperbaiki
            'activityLog' => $activityLog,
            'notifications' => $notifications,
        ]);
    }
}