@extends('layouts.admin_layout')

@section('title', 'Manajemen Alumni - Alumni Portal')

@section('content')
    <header class="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-slate-800">Manajemen Alumni</h1>
            <p class="text-slate-500 mt-1">Kelola data {{ $alumnis->total() }} alumni terdaftar.</p>
        </div>
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.alumni.export') }}" class="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm text-sm">
                <i class="fa-solid fa-file-export"></i>
                <span>Ekspor CSV</span>
            </a>
            <button onclick="openAddModal()" class="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 text-sm hover:-translate-y-0.5">
                <i class="fa-solid fa-plus"></i> Tambah Alumni
            </button>
        </div>
    </header>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        
        {{-- FILTER FORM --}}
        <form method="GET" action="{{ route('admin.alumni.index') }}" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            
            {{-- Search --}}
            <div class="relative sm:col-span-2 lg:col-span-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Pencarian</label>
                <div class="relative">
                    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari..." class="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 text-sm transition-all">
                </div>
            </div>

            {{-- Filter Angkatan --}}
            <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Angkatan</label>
                <select name="year" class="w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 py-2.5 px-3 text-sm bg-white transition-all">
                    <option value="Semua">Semua</option>
                    @foreach($years as $year)
                        <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>{{ $year }}</option>
                    @endforeach
                </select>
            </div>

            {{-- Filter Status --}}
            <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Status</label>
                <select name="status" class="w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 py-2.5 px-3 text-sm bg-white transition-all">
                    <option value="Semua">Semua</option>
                    <option value="Terverifikasi" {{ request('status') == 'Terverifikasi' ? 'selected' : '' }}>Terverifikasi</option>
                    <option value="Menunggu Verifikasi" {{ request('status') == 'Menunggu Verifikasi' ? 'selected' : '' }}>Pending</option>
                </select>
            </div>
            
            {{-- Filter Lokasi --}}
            <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Lokasi</label>
                <select name="location" class="w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 py-2.5 px-3 text-sm bg-white transition-all">
                    <option value="Semua">Semua</option>
                    @foreach($commonLocations as $location)
                        <option value="{{ $location }}" {{ request('location') == $location ? 'selected' : '' }}>{{ $location }}</option>
                    @endforeach
                </select>
            </div>

            {{-- Filter Bidang Karir & Button --}}
            <div class="sm:col-span-2 lg:col-span-1 flex gap-2 items-end">
                <div class="w-full">
                    <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Karir</label>
                    <select name="career_field" class="w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400 py-2.5 px-3 text-sm bg-white transition-all">
                        <option value="Semua">Semua</option>
                        @foreach($careerFields as $field)
                            <option value="{{ $field }}" {{ request('career_field') == $field ? 'selected' : '' }}>{{ $field }}</option>
                        @endforeach
                    </select>
                </div>
                <button type="submit" class="px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors text-sm shadow-md h-[42px]">
                    <i class="fa-solid fa-filter"></i>
                </button>
                @if(request()->anyFilled(['search', 'year', 'status', 'location', 'career_field']))
                    <a href="{{ route('admin.alumni.index') }}" class="px-4 py-2.5 text-slate-500 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-xl text-sm font-medium h-[42px] flex items-center transition-colors" title="Reset">
                        <i class="fa-solid fa-times"></i>
                    </a>
                @endif
            </div>
        </form>

        {{-- TABLE --}}
        <div class="overflow-x-auto rounded-xl border border-slate-100 mb-6">
            <table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th class="px-6 py-4 font-bold tracking-wide">Nama Alumni</th>
                        <th class="px-6 py-4 font-bold tracking-wide">Angkatan</th>
                        <th class="px-6 py-4 font-bold tracking-wide">Pekerjaan</th>
                        <th class="px-6 py-4 font-bold tracking-wide">Status</th>
                        <th class="px-6 py-4 font-bold tracking-wide text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($alumnis as $alumni)
                    <tr class="bg-white hover:bg-slate-50/50 transition-colors group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 shadow-sm group-hover:scale-105 transition-transform">
                                    {{ substr($alumni->name, 0, 2) }}
                                </div>
                                <div>
                                    <div class="font-semibold text-slate-800">{{ $alumni->name }}</div>
                                    <div class="text-xs text-slate-500 font-mono mt-0.5">{{ $alumni->nim }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200">
                                {{ $alumni->graduation_year }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            @if($alumni->current_position)
                                <div class="font-medium text-slate-700">{{ Str::limit($alumni->current_position, 30) }}</div>
                                @if($alumni->company_name)
                                    <div class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                        <i class="fa-regular fa-building"></i> {{ $alumni->company_name }}
                                    </div>
                                @endif
                            @else
                                <span class="text-slate-400 text-xs italic">Belum diisi</span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            @if($alumni->user && $alumni->user->hasVerifiedEmail())
                                <div class="flex items-center gap-1.5">
                                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span class="text-xs font-medium text-emerald-700">Aktif</span>
                                </div>
                            @else
                                <div class="flex items-center gap-1.5">
                                    <div class="w-2 h-2 rounded-full bg-amber-400"></div>
                                    <span class="text-xs font-medium text-amber-700">Pending</span>
                                </div>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onclick="openEditModal({{ json_encode($alumni) }}, {{ json_encode($alumni->user ?? null) }})" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all" title="Edit">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $alumni->id }}, '{{ $alumni->name }}')" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Hapus">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <i class="fa-solid fa-users-slash text-2xl text-slate-300"></i>
                                </div>
                                <h3 class="text-slate-800 font-semibold mb-1">Tidak ada data alumni</h3>
                                <p class="text-slate-500 text-sm max-w-xs mx-auto">Coba ubah kata kunci pencarian atau filter Anda.</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Pagination Custom --}}
        <div class="flex justify-center pt-2">
            {{ $alumnis->links('pagination.admin') }} 
        </div>
    </div>
    
    {{-- MODAL: TAMBAH ALUMNI (CREATE) --}}
    <div id="addModal" class="fixed inset-0 bg-slate-900/60 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                <div>
                    <h3 class="text-lg font-bold text-slate-800">Tambah Alumni Baru</h3>
                    <p class="text-xs text-slate-500">Isi data lengkap alumni di bawah ini.</p>
                </div>
                <button type="button" onclick="closeAddModal()" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <div class="overflow-y-auto p-6 custom-scrollbar">
                <form method="POST" action="{{ route('admin.alumni.store') }}" id="addForm">
                    @csrf
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {{-- Left Column --}}
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-brand-600 uppercase tracking-wider border-b border-brand-100 pb-2">Data Akademik</h4>
                            
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap <span class="text-red-500">*</span></label>
                                <input type="text" name="name" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">NIM <span class="text-red-500">*</span></label>
                                <input type="text" name="nim" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Angkatan <span class="text-red-500">*</span></label>
                                <input type="number" name="graduation_year" required min="1990" max="{{ date('Y') }}" placeholder="Contoh: 2023" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Jurusan <span class="text-red-500">*</span></label>
                                <select name="major" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    <option value="Teknologi Rekayasa Perangkat Lunak">Teknologi Rekayasa Perangkat Lunak</option>
                                    <option value="Manajemen Informatika">Manajemen Informatika</option>
                                </select>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Gender <span class="text-red-500">*</span></label>
                                    <select name="gender" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">No. Telp</label>
                                    <input type="tel" name="phone_number" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                                </div>
                            </div>
                        </div>
                        
                        {{-- Right Column --}}
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-brand-600 uppercase tracking-wider border-b border-brand-100 pb-2">Akun & Karir</h4>
                            
                            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p class="text-xs text-slate-500 italic mb-3">Opsional: Buat akun login untuk alumni ini.</p>
                                <div class="space-y-3">
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email Login</label>
                                        <input type="email" name="email" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                                        <input type="password" name="password" minlength="8" placeholder="Min 8 karakter" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Alamat</label>
                                <textarea name="address" rows="2" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"></textarea>
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Pekerjaan Saat Ini</label>
                                    <input type="text" name="current_position" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                                </div>
                                 <div>
                                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Perusahaan</label>
                                    <input type="text" name="company_name" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            <div class="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                <button type="button" onclick="closeAddModal()" class="px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors text-sm">
                    Batal
                </button>
                <button type="submit" form="addForm" class="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors text-sm shadow-md shadow-brand-500/20">
                    Simpan Data
                </button>
            </div>
        </div>
    </div>

    {{-- MODAL: EDIT ALUMNI (UPDATE) --}}
    <div id="editModal" class="fixed inset-0 bg-slate-900/60 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
            <form id="editForm" method="POST" action="" class="flex flex-col h-full">
                @csrf
                @method('PUT')
                <div class="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Edit Data Alumni</h3>
                        <p class="text-xs text-slate-500">Perbarui informasi untuk <span id="editNameHeader" class="font-bold text-brand-600"></span></p>
                    </div>
                    <button type="button" onclick="closeEditModal()" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>

                <div class="overflow-y-auto p-6 custom-scrollbar">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {{-- Left Column --}}
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-brand-600 uppercase tracking-wider border-b border-brand-100 pb-2">Data Akademik</h4>
                            
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap <span class="text-red-500">*</span></label>
                                <input type="text" id="edit_name" name="name" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">NIM</label>
                                <input type="text" id="edit_nim" readonly class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm bg-slate-50 text-slate-500 cursor-not-allowed">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Angkatan <span class="text-red-500">*</span></label>
                                <input type="number" id="edit_graduation_year" name="graduation_year" required min="1990" max="{{ date('Y') }}" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Status Verifikasi <span class="text-red-500">*</span></label>
                                <select id="edit_status" name="status" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    <option value="Terverifikasi">Terverifikasi</option>
                                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                </select>
                            </div>
                        </div>
                        
                        {{-- Right Column --}}
                        <div class="space-y-4">
                            <h4 class="text-xs font-bold text-brand-600 uppercase tracking-wider border-b border-brand-100 pb-2">Karir & Akun</h4>
                            
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Pekerjaan Saat Ini</label>
                                <input type="text" id="edit_current_position" name="current_position" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Perusahaan</label>
                                <input type="text" id="edit_company_name" name="company_name" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Email Login</label>
                                <div class="relative">
                                    <input type="email" id="edit_email" name="email" disabled class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm bg-slate-50 text-slate-500 cursor-not-allowed focus:ring-0">
                                    <i class="fa-solid fa-lock absolute right-3 top-2.5 text-slate-400 text-xs"></i>
                                </div>
                                <p class="text-[10px] text-slate-400 mt-1">Email tidak dapat diubah oleh admin untuk keamanan.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                    <button type="button" onclick="closeEditModal()" class="px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors text-sm">
                        Batal
                    </button>
                    <button type="submit" class="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors text-sm shadow-md shadow-brand-500/20">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>

    {{-- DELETE MODAL (Improved UI) --}}
    <div id="deleteModal" class="fixed inset-0 bg-slate-900/60 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Hapus Data Alumni?</h3>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">
                Anda akan menghapus data <strong id="deleteName" class="text-slate-800"></strong>. 
                Tindakan ini tidak dapat dibatalkan dan akun user terkait juga akan dihapus.
            </p>
            
            <form id="deleteForm" method="POST" class="flex gap-3 justify-center">
                @csrf
                @method('DELETE')
                <button type="button" onclick="closeDeleteModal()" class="flex-1 px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
                    Batal
                </button>
                <button type="submit" class="flex-1 px-5 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-500/30">
                    Ya, Hapus
                </button>
            </form>
        </div>
    </div>

@endsection

@push('scripts')
<script>
    // --- Universal Modal Functions ---
    function openModal(id) {
        document.getElementById(id).classList.remove('hidden');
    }
    function closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }

    // --- ADD MODAL (Create) ---
    function openAddModal() {
        document.getElementById('addModal').querySelector('form').reset();
        openModal('addModal');
    }
    function closeAddModal() {
        closeModal('addModal');
    }

    // --- EDIT MODAL (Update) ---
    function openEditModal(alumni, user) {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        
        document.getElementById('editNameHeader').textContent = alumni.name;
        document.getElementById('edit_name').value = alumni.name;
        document.getElementById('edit_nim').value = alumni.nim;
        document.getElementById('edit_graduation_year').value = alumni.graduation_year;
        document.getElementById('edit_current_position').value = alumni.current_position || '';
        document.getElementById('edit_company_name').value = alumni.company_name || '';
        
        const statusSelect = document.getElementById('edit_status');
        const emailInput = document.getElementById('edit_email');
        
        if (user) {
            emailInput.value = user.email || '-'; // Show email but it's disabled in HTML
            if (user.email_verified_at) {
                statusSelect.value = 'Terverifikasi';
            } else {
                statusSelect.value = 'Menunggu Verifikasi';
            }
        } else {
            emailInput.value = 'Belum ada akun';
            statusSelect.value = 'Menunggu Verifikasi';
        }

        form.action = `/admin/alumni/${alumni.id}`;
        openModal('editModal');
    }
    function closeEditModal() {
        closeModal('editModal');
    }

    // --- DELETE MODAL (Delete) ---
    function openDeleteModal(id, name) {
        const form = document.getElementById('deleteForm');
        const nameSpan = document.getElementById('deleteName');
        form.action = `/admin/alumni/${id}`;
        nameSpan.textContent = name;
        openModal('deleteModal');
    }
    function closeDeleteModal() {
        closeModal('deleteModal');
    }
    
    // Add fade-in style if not present
    if (!document.getElementById('fade-in-style')) {
        document.head.insertAdjacentHTML("beforeend", `<style id="fade-in-style">
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.3s ease-out forwards;
            }
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        </style>`);
    }
</script>
@endpush