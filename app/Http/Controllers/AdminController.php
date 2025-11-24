<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\Opportunity; // Changed from JobPosting
use App\Models\News;
use App\Models\Event;
use App\Models\User;
use App\Models\JobHistory;
use App\Models\ActivityLog; // Import Real ActivityLog
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        // 1. STATISTIK UTAMA
        $totalAlumni = Alumni::count();
        $totalOpportunities = Opportunity::count(); // Count Opportunities
        $totalNews = News::count();
        $totalEvents = Event::count();
        $totalPending = User::whereNull('email_verified_at')->count(); 

        // Pertumbuhan (New this month)
        $newAlumniMonth = Alumni::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
        $newOpportunitiesMonth = Opportunity::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        // 2. CHART 1: ALUMNI PER TAHUN LULUS (Bar Chart)
        $chartData = Alumni::select('graduation_year', DB::raw('count(*) as total'))
            ->whereNotNull('graduation_year')
            ->groupBy('graduation_year')
            ->orderBy('graduation_year', 'desc')
            ->limit(5)
            ->get()
            ->sortBy('graduation_year')
            ->values();

        // 3. CAREER STATS (Employment Rate)
        $employedCount = Alumni::whereHas('jobHistories', function($q) {
            $q->whereNull('end_date');
        })->count();
        
        $unemployedCount = $totalAlumni - $employedCount;

        $careerStats = [
            'employed' => $employedCount,
            'unemployed' => $unemployedCount,
            'rate' => $totalAlumni > 0 ? round(($employedCount / $totalAlumni) * 100) : 0
        ];

        // 4. TOP 5 POSISI PEKERJAAN
        $topPositions = JobHistory::select('position as current_position', DB::raw('count(*) as total'))
            ->whereNull('end_date')
            ->groupBy('position')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        // 5. CHART 3: TREN PENDAFTARAN (Line Chart)
        $months = collect(range(5, 0))->map(function ($i) {
            return Carbon::now()->subMonths($i);
        });

        $usersRecent = User::select('created_at')
            ->where('created_at', '>=', Carbon::now()->subMonths(6)->startOfMonth())
            ->get()
            ->groupBy(function($date) {
                return Carbon::parse($date->created_at)->format('Y-m');
            });

        $monthlyGrowth = $months->map(function ($date) use ($usersRecent) {
            $key = $date->format('Y-m');
            return [
                'month_year' => $key,
                'month_name' => $date->translatedFormat('F'),
                'count' => isset($usersRecent[$key]) ? $usersRecent[$key]->count() : 0
            ];
        })->values();

        // 6. ACTIVITY LOG (REAL-TIME DB)
        $activityLog = ActivityLog::with('user')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($log) {
                // Determine Icon & Color based on Action string
                $action = strtoupper($log->action);
                $icon = 'fa-solid fa-circle-info';
                $color = 'text-slate-500';

                if (str_contains($action, 'CREATE') || str_contains($action, 'ADD') || str_contains($action, 'POST')) {
                    $icon = 'fa-solid fa-plus';
                    $color = 'text-emerald-500';
                } elseif (str_contains($action, 'UPDATE') || str_contains($action, 'EDIT')) {
                    $icon = 'fa-solid fa-pencil';
                    $color = 'text-amber-500';
                } elseif (str_contains($action, 'DELETE') || str_contains($action, 'REMOVE') || str_contains($action, 'DESTROY')) {
                    $icon = 'fa-solid fa-trash';
                    $color = 'text-rose-500';
                } elseif (str_contains($action, 'LOGIN')) {
                    $icon = 'fa-solid fa-right-to-bracket';
                    $color = 'text-blue-500';
                } elseif (str_contains($action, 'LOGOUT')) {
                    $icon = 'fa-solid fa-power-off';
                    $color = 'text-slate-400';
                }

                return [
                    'id' => $log->id,
                    'type' => $log->action,
                    'message' => $log->description,
                    'time' => $log->created_at,
                    'icon' => $icon,
                    'color' => $color
                ];
            });

        // 7. NOTIFICATIONS
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

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'alumni' => ['total' => $totalAlumni, 'new' => $newAlumniMonth],
                'opportunities' => ['total' => $totalOpportunities, 'new' => $newOpportunitiesMonth], // Replaced 'jobs'
                'news' => $totalNews,
                'events' => $totalEvents,
                'pending' => $totalPending
            ],
            'chartData' => $chartData,
            'careerStats' => $careerStats, 
            'topPositions' => $topPositions, 
            'monthlyGrowth' => $monthlyGrowth,
            'activityLog' => $activityLog,
            'notifications' => $notifications,
        ]);
    }
}