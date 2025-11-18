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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Total Alumni</p>
                    <h3 class="text-3xl font-bold text-slate-800">1,240</h3>
                </div>
                <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <i class="fa-solid fa-user-graduate text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <i class="fa-solid fa-arrow-up text-xs"></i> 12%
                </span>
                <span class="text-slate-400 ml-2">vs bulan lalu</span>
            </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Sudah Bekerja</p>
                    <h3 class="text-3xl font-bold text-slate-800">856</h3>
                </div>
                <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <i class="fa-solid fa-briefcase text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <i class="fa-solid fa-arrow-up text-xs"></i> 8%
                </span>
                <span class="text-slate-400 ml-2">tracking rate</span>
            </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Event Aktif</p>
                    <h3 class="text-3xl font-bold text-slate-800">3</h3>
                </div>
                <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <i class="fa-solid fa-calendar-star text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-slate-400">Reuni Akbar: H-12</span>
            </div>
        </div>
        
         <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-slate-500 mb-1">Verifikasi Pending</p>
                    <h3 class="text-3xl font-bold text-slate-800">15</h3>
                </div>
                <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <i class="fa-solid fa-user-clock text-xl"></i>
                </div>
            </div>
            <div class="mt-4 flex items-center text-sm">
                <span class="text-orange-500 font-medium cursor-pointer hover:underline">Lihat antrian &rarr;</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-lg text-slate-800">Statistik Lulusan</h3>
                <select class="bg-slate-50 border-none text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-100">
                    <option>Tahun 2023</option>
                    <option>Tahun 2022</option>
                </select>
            </div>
            <div class="h-80">
                <canvas id="alumniChart"></canvas>
            </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="font-bold text-lg text-slate-800 mb-6">Aktivitas Terbaru</h3>
            <div class="space-y-6">
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-brand-100 flex-shrink-0 flex items-center justify-center text-brand-600 font-bold text-sm">
                        BS
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-800">Budi Santoso</p>
                        <p class="text-xs text-slate-500">Menambahkan riwayat pekerjaan baru di <span class="font-medium text-brand-600">Tokopedia</span></p>
                        <p class="text-[10px] text-slate-400 mt-1">2 jam yang lalu</p>
                    </div>
                </div>
                
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-sm">
                        AD
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-800">Ayu Diah</p>
                        <p class="text-xs text-slate-500">Mendaftar ke event <span class="font-medium text-blue-600">Reuni Akbar 2024</span></p>
                        <p class="text-[10px] text-slate-400 mt-1">5 jam yang lalu</p>
                    </div>
                </div>

                 <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 font-bold text-sm">
                        RG
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-800">Rudi Gunawan</p>
                        <p class="text-xs text-slate-500">Baru saja bergabung sebagai alumni</p>
                        <p class="text-[10px] text-slate-400 mt-1">1 hari yang lalu</p>
                    </div>
                </div>
            </div>
            <button class="w-full mt-6 py-2 text-sm text-slate-500 font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Lihat Semua Aktivitas
            </button>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    const ctx = document.getElementById('alumniChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            datasets: [{
                label: 'Alumni Terserap Kerja',
                data: [12, 19, 33, 50, 62, 85],
                borderColor: '#F52A91', // Brand Color
                backgroundColor: 'rgba(245, 42, 145, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#F52A91',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                x: { grid: { display: false } }
            }
        }
    });
</script>
@endpush