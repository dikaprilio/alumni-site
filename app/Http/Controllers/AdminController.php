<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use App\Models\Event;
use App\Models\News;
use App\Models\JobHistory;
use Carbon\Carbon;
use Illuminate\Support\Str; // Tambahkan helper Str

class AdminController extends Controller
{
    public function dashboard()
    {
        // --- 1. KARTU STATISTIK ---
        
        $totalAlumni = Alumni::count();

        $alreadyWorking = Alumni::whereNotNull('current_job')
                                ->where('current_job', '!=', '')
                                ->count();

        $workingPercentage = $totalAlumni > 0 ? round(($alreadyWorking / $totalAlumni) * 100, 1) : 0;

        $activeEvents = Event::where('status', 'upcoming')->count();

        $totalNews = News::count();


        // --- 2. DATA CHART (Statistik Bulanan) ---
        
        $currentYear = date('Y');
        
        $monthlyAlumni = Alumni::select('created_at')
                            ->whereYear('created_at', $currentYear)
                            ->get()
                            ->groupBy(function($date) {
                                return Carbon::parse($date->created_at)->format('n');
                            });

        $chartData = [];
        $chartLabels = [];
        
        for ($i = 1; $i <= 12; $i++) {
            $chartLabels[] = date('M', mktime(0, 0, 0, $i, 1));
            $chartData[] = isset($monthlyAlumni[$i]) ? $monthlyAlumni[$i]->count() : 0;
        }


        // --- 3. AKTIVITAS TERBARU (Updated) ---

        // A. Ambil Alumni baru bergabung
        $recentAlumni = Alumni::latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'type' => 'join',
                    'name' => $item->name,
                    'description' => 'Baru saja bergabung sebagai alumni',
                    'time' => $item->created_at,
                    'initial' => substr($item->name, 0, 2)
                ];
            });

        // B. Ambil Riwayat Pekerjaan baru
        $recentJobs = JobHistory::with('alumni')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'type' => 'job',
                    'name' => $item->alumni->name ?? 'Alumni',
                    'description' => 'Menambahkan riwayat kerja di <span class="font-medium text-brand-600">' . Str::limit($item->company_name, 30) . '</span>',
                    'time' => $item->created_at,
                    'initial' => substr($item->alumni->name ?? 'Al', 0, 2)
                ];
            });

        // C. Ambil Berita Terbaru (NEW)
        $recentNewsList = News::with('author')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'type' => 'news',
                    'name' => $item->author->name ?? 'Admin', // Penulis berita
                    'description' => 'Menerbitkan berita: <span class="font-medium text-brand-600">' . Str::limit($item->title, 40) . '</span>',
                    'time' => $item->created_at,
                    'initial' => substr($item->author->name ?? 'Ad', 0, 2)
                ];
            });

        // D. Gabung semua dan urutkan berdasarkan waktu terbaru
        $recentActivities = $recentAlumni->merge($recentJobs)
            ->merge($recentNewsList) // Gabungkan berita
            ->sortByDesc('time')
            ->take(6); // Ambil 6 aktivitas teratas agar list lebih panjang dikit


        return view('admin.dashboard', compact(
            'totalAlumni', 
            'alreadyWorking', 
            'workingPercentage', 
            'activeEvents', 
            'totalNews',
            'chartData',
            'chartLabels',
            'currentYear',
            'recentActivities'
        ));
    }
}