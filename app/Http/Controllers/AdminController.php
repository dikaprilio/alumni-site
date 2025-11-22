<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use App\Models\Event;
use App\Models\News;
use App\Models\JobHistory;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        // --- 1. KARTU STATISTIK UTAMA ---
        
        $totalAlumni = Alumni::count();

        $alreadyWorking = Alumni::whereNotNull('current_position')
                                ->where('current_position', '!=', '')
                                ->count();
        $workingPercentage = $totalAlumni > 0 ? round(($alreadyWorking / $totalAlumni) * 100, 1) : 0;

        $activeEvents = Event::where('status', 'upcoming')->count();
        $totalNews = News::count();

        // --- STATISTIK BARU ---
        
        $newAlumniThisMonth = Alumni::whereYear('created_at', Carbon::now()->year)
                                    ->whereMonth('created_at', Carbon::now()->month)
                                    ->count();

        $companyPartners = Alumni::whereNotNull('company_name')
                                 ->where('company_name', '!=', '')
                                 ->distinct('company_name')
                                 ->count('company_name');


        // --- 2. DATA CHART 1 (Line Chart: Statistik Bulanan) ---
        
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

        // --- 3. DATA CHART 2 (Pie Chart: Status Pekerjaan) ---
        
        $notWorking = $totalAlumni - $alreadyWorking;
        $statusLabels = ['Sudah Bekerja', 'Belum Bekerja / Tidak Ada Data'];
        $statusData = [$alreadyWorking, $notWorking];

        // --- 4. DATA CHART 3 (Pie Chart: Distribusi Bidang Kerja) ---
        // Mengambil top 5 pekerjaan terbanyak
        $topJobs = Alumni::select('current_position', DB::raw('count(*) as total'))
            ->whereNotNull('current_position')
            ->where('current_position', '!=', '')
            ->groupBy('current_position')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        $jobDistributionLabels = $topJobs->pluck('current_position');
        $jobDistributionData = $topJobs->pluck('total');


        // --- 5. AKTIVITAS TERBARU ---

        $mapActivity = function($item, $type) {
            $data = [
                'type' => $type,
                'time' => $item->created_at,
            ];

            if ($type === 'join') {
                $data['name'] = $item->name;
                $data['description'] = 'Bergabung sebagai alumni baru';
                $data['initial'] = substr($item->name, 0, 2);
            } elseif ($type === 'job') {
                $data['name'] = $item->alumni->name ?? 'Alumni';
                $data['description'] = 'Update karir di <span class="font-medium text-brand-600">' . Str::limit($item->company_name, 20) . '</span>';
                $data['initial'] = substr($item->alumni->name ?? 'Al', 0, 2);
            } elseif ($type === 'news') {
                $data['name'] = $item->author->name ?? 'Admin';
                $data['description'] = 'Memposting berita: <span class="font-medium text-brand-600">' . Str::limit($item->title, 30) . '</span>';
                $data['initial'] = substr($item->author->name ?? 'Ad', 0, 2);
            }

            return $data;
        };

        $rawAlumni = Alumni::latest()->take(10)->get();
        $rawJobs = JobHistory::with('alumni')->latest()->take(10)->get();
        $rawNews = News::with('author')->latest()->take(10)->get();

        $activities = collect()
            ->merge($rawAlumni->map(fn($i) => $mapActivity($i, 'join')))
            ->merge($rawJobs->map(fn($i) => $mapActivity($i, 'job')))
            ->merge($rawNews->map(fn($i) => $mapActivity($i, 'news')))
            ->sortByDesc('time')
            ->values();

        $recentActivities = $activities->take(8);
        $allActivities = $activities->take(20);


        return view('admin.dashboard', compact(
            'totalAlumni', 
            'alreadyWorking', 
            'workingPercentage', 
            'activeEvents', 
            'totalNews',
            'newAlumniThisMonth',
            'companyPartners',
            'chartData',
            'chartLabels',
            'currentYear',
            'statusLabels',
            'statusData',
            'jobDistributionLabels', // Baru
            'jobDistributionData',   // Baru
            'recentActivities',
            'allActivities'
        ));
    }
}