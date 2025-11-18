@extends('layouts.admin_layout')

@section('title', 'Dashboard - Alumni Portal')

@section('content')
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Overview</h1>
            <p class="text-slate-500 mt-1">Selamat datang kembali, pantau perkembangan alumni hari ini.</p>
        </div>
        <button class="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> Tambah Alumni
        </button>
    </div>

    {{-- STATISTIC CARDS --}}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {{-- Card 1: Total Alumni --}}
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Total Alumni</p>
                    <h3 class="text-3xl font-bold text-slate-800">{{ number_format($totalAlumni) }}</h3>
                </div>
                <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <i class="fa-solid fa-user-graduate text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <i class="fa-solid fa-arrow-up text-xs"></i> Realtime
                </span>
                <span class="text-slate-400 ml-2">Data terupdate</span>
            </div>
        </div>

        {{-- Card 2: Sudah Bekerja --}}
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Sudah Bekerja</p>
                    <h3 class="text-3xl font-bold text-slate-800">{{ number_format($alreadyWorking) }}</h3>
                </div>
                <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <i class="fa-solid fa-briefcase text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <i class="fa-solid fa-chart-line text-xs"></i> {{ $workingPercentage }}%
                </span>
                <span class="text-slate-400 ml-2">Terserap kerja</span>
            </div>
        </div>

        {{-- Card 3: Event Aktif --}}
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Event Aktif</p>
                    <h3 class="text-3xl font-bold text-slate-800">{{ number_format($activeEvents) }}</h3>
                </div>
                <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <i class="fa-solid fa-calendar-star text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-slate-400">Agenda mendatang</span>
            </div>
        </div>
        
        {{-- Card 4: Total Berita --}}
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Total Berita</p>
                    <h3 class="text-3xl font-bold text-slate-800">{{ number_format($totalNews) }}</h3>
                </div>
                <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <i class="fa-solid fa-newspaper text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <a href="#" class="text-orange-500 font-medium cursor-pointer hover:underline flex items-center gap-1">
                    Kelola Berita <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {{-- CHART SECTION (CANVAS) --}}
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-lg text-slate-800">Statistik Alumni Baru ({{ $currentYear }})</h3>
            </div>
            <div class="h-80">
                <canvas id="alumniChart"></canvas>
            </div>
        </div>

        {{-- RECENT ACTIVITY (DYNAMIC) --}}
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="font-bold text-lg text-slate-800 mb-6">Aktivitas Terbaru</h3>
            <div class="space-y-6">
                @forelse($recentActivities as $activity)
                    <div class="flex items-start gap-4">
                        {{-- Icon / Inisial berdasarkan Tipe --}}
                        @if($activity['type'] == 'join')
                            <div class="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold text-sm uppercase">
                                {{ $activity['initial'] }}
                            </div>
                        @else
                            <div class="w-10 h-10 rounded-full bg-brand-100 flex-shrink-0 flex items-center justify-center text-brand-600 font-bold text-sm uppercase">
                                {{ $activity['initial'] }}
                            </div>
                        @endif

                        <div>
                            <p class="text-sm font-semibold text-slate-800">{{ $activity['name'] }}</p>
                            <p class="text-xs text-slate-500">{!! $activity['description'] !!}</p>
                            <p class="text-[10px] text-slate-400 mt-1">
                                {{ \Carbon\Carbon::parse($activity['time'])->diffForHumans() }}
                            </p>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-4 text-slate-400 text-sm">
                        Belum ada aktivitas terbaru.
                    </div>
                @endforelse
            </div>
            
            <button class="w-full mt-6 py-2 text-sm text-slate-500 font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Lihat Semua Aktivitas
            </button>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    // Data dari Controller (PHP -> JS)
    const chartLabels = @json($chartLabels);
    const chartData = @json($chartData);

    const ctx = document.getElementById('alumniChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', 
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Alumni Baru Terdaftar',
                data: chartData, 
                borderColor: '#F52A91', // Brand Color
                backgroundColor: 'rgba(245, 42, 145, 0.05)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#F52A91',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1e293b',
                    titleFont: { family: "'Poppins', sans-serif", size: 13 },
                    bodyFont: { family: "'Poppins', sans-serif", size: 12 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { 
                        borderDash: [2, 4],
                        color: '#e2e8f0'
                    },
                    ticks: {
                        font: { family: "'Poppins', sans-serif", size: 11 },
                        stepSize: 1 
                    }
                },
                x: { 
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Poppins', sans-serif", size: 11 }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
</script>
@endpush