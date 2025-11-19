@extends('layouts.admin_layout')

@section('title', 'Dashboard - Alumni Portal')

@section('content')
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Overview</h1>
            <p class="text-slate-500 mt-1 text-sm md:text-base">Selamat datang kembali, pantau perkembangan alumni hari ini.</p>
        </div>
        <button onclick="openAddModal()" class="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm md:text-base w-full md:w-auto">
            <i class="fa-solid fa-plus"></i> Tambah Alumni
        </button>
    </div>

    {{-- 1. CHARTS ROW (MOVED TO TOP) --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        
        {{-- Chart 1: Alumni Baru (Line) --}}
        <div class="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h3 class="font-bold text-lg text-slate-800">Pertumbuhan Alumni ({{ $currentYear }})</h3>
                <span class="bg-brand-50 text-brand-600 text-xs px-2 py-1 rounded-full font-medium">Tahun Ini</span>
            </div>
            <div class="h-64 md:h-80 w-full relative">
                <canvas id="alumniChart"></canvas>
            </div>
        </div>

        {{-- Chart 2 & 3 Column --}}
        <div class="flex flex-col gap-6">
            
            {{-- Chart 2: Status Pekerjaan (Doughnut) --}}
            <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <h3 class="font-bold text-lg text-slate-800 mb-4">Status Pekerjaan</h3>
                <div class="h-48 flex items-center justify-center relative">
                     <canvas id="statusChart"></canvas>
                     <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span class="text-xl font-bold text-slate-800">{{ number_format($totalAlumni) }}</span>
                         <span class="text-[10px] text-slate-400">Total Alumni</span>
                     </div>
                </div>
            </div>

            {{-- Chart 3: Distribusi Bidang Kerja (Pie) --}}
            <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col flex-1">
                <h3 class="font-bold text-lg text-slate-800 mb-4">Top 5 Bidang Kerja</h3>
                <div class="h-48 flex items-center justify-center">
                     <canvas id="jobChart"></canvas>
                </div>
            </div>

        </div>
    </div>

    {{-- 2. STATISTIC CARDS (MOVED DOWN) --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        
        {{-- Card: Total Alumni --}}
        <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Alumni</p>
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{{ number_format($totalAlumni) }}</h3>
                </div>
                <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-user-graduate text-lg md:text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs md:text-sm">
                <span class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-arrow-up"></i> Aktif
                </span>
                <span class="text-slate-400 ml-2">Terdaftar di sistem</span>
            </div>
        </div>

        {{-- Card: Alumni Baru --}}
        <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alumni Baru (Bulan Ini)</p>
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">+{{ number_format($newAlumniThisMonth) }}</h3>
                </div>
                <div class="w-10 h-10 md:w-12 md:h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-user-plus text-lg md:text-xl"></i>
                </div>
            </div>
            <div class="mt-4 text-xs text-slate-400">
                Bergabung pada bulan {{ date('F') }}
            </div>
        </div>

        {{-- Card: Sudah Bekerja --}}
        <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Terserap Kerja</p>
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{{ number_format($alreadyWorking) }}</h3>
                </div>
                <div class="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-briefcase text-lg md:text-xl"></i>
                </div>
            </div>
            <div class="mt-4">
                <div class="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                    <div class="bg-emerald-500 h-1.5 rounded-full" style="width: {{ $workingPercentage }}%"></div>
                </div>
                <p class="text-xs text-slate-400">{{ $workingPercentage }}% dari total alumni</p>
            </div>
        </div>
        
        {{-- Card: Mitra Perusahaan --}}
        <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mitra Perusahaan</p>
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{{ number_format($companyPartners) }}</h3>
                </div>
                <div class="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-building text-lg md:text-xl"></i>
                </div>
            </div>
            <div class="mt-4 text-xs text-slate-400">
                Perusahaan tempat alumni bekerja
            </div>
        </div>

        {{-- Card: Event Aktif --}}
        <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Event Aktif</p>
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{{ number_format($activeEvents) }}</h3>
                </div>
                <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-calendar-star text-lg md:text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs md:text-sm">
                <a href="{{ route('admin.events.index') }}" class="text-purple-600 font-semibold hover:underline flex items-center gap-1">
                    Lihat Agenda <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
            </div>
        </div>
        
        {{-- Card: Total Berita --}}
        <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Berita</p>
                    <h3 class="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{{ number_format($totalNews) }}</h3>
                </div>
                <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-newspaper text-lg md:text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-xs md:text-sm">
                <a href="{{ route('admin.news.index') }}" class="text-orange-600 font-semibold hover:underline flex items-center gap-1">
                    Kelola Berita <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
            </div>
        </div>
    </div>

    {{-- 3. RECENT ACTIVITY ROW (FULL WIDTH) --}}
    <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-lg text-slate-800">Aktivitas Terbaru</h3>
            <button onclick="document.getElementById('activityModal').classList.remove('hidden')" class="text-sm text-brand-600 font-medium hover:underline focus:outline-none">
                Lihat Semua
            </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @forelse($recentActivities as $activity)
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-sm transition-all h-full flex flex-col">
                    <div class="flex items-center gap-3 mb-3">
                        @if($activity['type'] == 'join')
                            <div class="w-8 h-8 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs shadow-sm shrink-0">
                                <i class="fa-solid fa-user-plus"></i>
                            </div>
                        @elseif($activity['type'] == 'job')
                            <div class="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-600 text-xs shadow-sm shrink-0">
                                <i class="fa-solid fa-briefcase"></i>
                            </div>
                        @else
                            <div class="w-8 h-8 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-600 text-xs shadow-sm shrink-0">
                                <i class="fa-solid fa-newspaper"></i>
                            </div>
                        @endif
                        <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                            {{ $activity['type'] == 'join' ? 'Registrasi' : ($activity['type'] == 'job' ? 'Karir' : 'Berita') }}
                        </span>
                    </div>
                    
                    <h4 class="text-sm font-bold text-slate-800 mb-1 line-clamp-1" title="{{ $activity['name'] }}">{{ $activity['name'] }}</h4>
                    <p class="text-xs text-slate-500 mb-3 line-clamp-2 h-8 overflow-hidden">{!! strip_tags($activity['description']) !!}</p>
                    
                    <div class="flex items-center text-[10px] text-slate-400 border-t border-slate-200 pt-2 mt-auto">
                        <i class="fa-regular fa-clock mr-1.5"></i>
                        {{ \Carbon\Carbon::parse($activity['time'])->diffForHumans() }}
                    </div>
                </div>
            @empty
                <div class="col-span-full text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p class="text-sm">Belum ada aktivitas terbaru.</p>
                </div>
            @endforelse
        </div>
    </div>

    {{-- MODAL: VIEW ALL ACTIVITIES --}}
    <div id="activityModal" class="fixed inset-0 bg-slate-900/60 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-fade-in-up">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                <h3 class="font-bold text-lg text-slate-800">Semua Aktivitas</h3>
                <button onclick="document.getElementById('activityModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                <div class="relative">
                    <div class="absolute left-5 top-2 bottom-0 w-0.5 bg-slate-100"></div>
                    @forelse($allActivities as $activity)
                        <div class="flex items-start gap-4 relative z-10 mb-6 last:mb-0 group">
                             @if($activity['type'] == 'join')
                                <div class="w-10 h-10 rounded-full bg-white border-2 border-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold text-xs shadow-sm group-hover:scale-110 transition-transform bg-emerald-50">
                                    <i class="fa-solid fa-user-plus"></i>
                                </div>
                            @elseif($activity['type'] == 'job')
                                <div class="w-10 h-10 rounded-full bg-white border-2 border-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm group-hover:scale-110 transition-transform bg-blue-50">
                                    <i class="fa-solid fa-briefcase"></i>
                                </div>
                            @else
                                <div class="w-10 h-10 rounded-full bg-white border-2 border-orange-100 flex-shrink-0 flex items-center justify-center text-orange-600 font-bold text-xs shadow-sm group-hover:scale-110 transition-transform bg-orange-50">
                                    <i class="fa-solid fa-newspaper"></i>
                                </div>
                            @endif

                            <div class="flex-1">
                                <div class="flex justify-between items-start">
                                    <p class="text-sm font-semibold text-slate-800">{{ $activity['name'] }}</p>
                                    <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                        {{ \Carbon\Carbon::parse($activity['time'])->format('d M, H:i') }}
                                    </span>
                                </div>
                                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed text-justify">{!! $activity['description'] !!}</p>
                            </div>
                        </div>
                    @empty
                        <div class="text-center text-slate-400 py-8">Tidak ada data aktivitas.</div>
                    @endforelse
                </div>
            </div>
            <div class="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-center sticky bottom-0">
                <button onclick="document.getElementById('activityModal').classList.add('hidden')" class="text-slate-500 text-sm hover:text-slate-700 font-medium px-4 py-2 hover:bg-slate-200 rounded-lg transition-colors w-full sm:w-auto">
                    Tutup
                </button>
            </div>
        </div>
    </div>

@endsection

@push('scripts')
<script>
    // --- Chart 1: Line Chart (Alumni Baru) ---
    const chartLabels = @json($chartLabels);
    const chartData = @json($chartData);

    const ctx = document.getElementById('alumniChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', 
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Alumni Baru',
                data: chartData, 
                borderColor: '#F52A91', 
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(245, 42, 145, 0.2)');
                    gradient.addColorStop(1, 'rgba(245, 42, 145, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#F52A91',
                pointBorderWidth: 2,
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
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { family: "'Poppins', sans-serif", size: 13 },
                    bodyFont: { family: "'Poppins', sans-serif", size: 13 },
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { borderDash: [4, 4], color: '#f1f5f9', drawBorder: false },
                    ticks: { font: { family: "'Poppins', sans-serif", size: 11 }, color: '#94a3b8' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { font: { family: "'Poppins', sans-serif", size: 11 }, color: '#94a3b8' }
                }
            },
            interaction: { mode: 'index', intersect: false },
        }
    });

    // --- Chart 2: Doughnut Chart (Status Pekerjaan) ---
    const statusLabels = @json($statusLabels);
    const statusData = @json($statusData);
    const ctxStatus = document.getElementById('statusChart').getContext('2d');

    new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{
                data: statusData,
                backgroundColor: [
                    '#10b981', // Emerald-500 (Sudah Bekerja)
                    '#e2e8f0', // Slate-200 (Belum Bekerja)
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { family: "'Poppins', sans-serif", size: 13 },
                    bodyFont: { family: "'Poppins', sans-serif", size: 13 },
                    cornerRadius: 8,
                    displayColors: true,
                }
            }
        }
    });

    // --- Chart 3: Pie Chart (Distribusi Bidang Kerja) ---
    const jobLabels = @json($jobDistributionLabels);
    const jobData = @json($jobDistributionData);
    const ctxJob = document.getElementById('jobChart').getContext('2d');

    new Chart(ctxJob, {
        type: 'pie',
        data: {
            labels: jobLabels,
            datasets: [{
                data: jobData,
                backgroundColor: [
                    '#f43f5e', // Rose
                    '#3b82f6', // Blue
                    '#eab308', // Yellow
                    '#10b981', // Emerald
                    '#8b5cf6', // Violet
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { font: { size: 11 } } },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 8,
                }
            }
        }
    });

    function openAddModal() {
        window.location.href = "{{ route('admin.alumni.index') }}";
    }

    // Add minimal fade-in animation for modal
    document.head.insertAdjacentHTML("beforeend", `<style>
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
        }
        /* Custom scrollbar for modal content */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>`)
</script>
@endpush