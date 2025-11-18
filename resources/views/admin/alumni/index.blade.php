@extends('layouts.admin_layout')

@section('title', 'Manajemen Alumni - Alumni Portal')

@section('content')
    <header class="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-slate-800">Manajemen Alumni</h1>
            <p class="text-slate-500 mt-1">Kelola data {{ $alumnis->total() }} alumni terdaftar.</p>
        </div>
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.alumni.export') }}" class="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                <i class="fa-solid fa-file-export"></i>
                <span>Ekspor CSV</span>
            </a>
            <button onclick="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors">
                <i class="fa-solid fa-plus"></i>
                <span>Tambah Alumni</span>
            </button>
        </div>
    </header>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        
        {{-- FILTER FORM (unchanged) --}}
        <form method="GET" action="{{ route('admin.alumni.index') }}" class="flex flex-wrap items-end gap-4 mb-6">
            
            {{-- Search --}}
            <div class="relative flex-grow min-w-[200px] md:max-w-xs">
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Cari Nama / NIM / Pekerjaan</label>
                <i class="fa-solid fa-search absolute left-3 top-8 text-slate-400"></i>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm">
            </div>

            {{-- Filter Angkatan --}}
            <div class="min-w-[120px]">
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Angkatan</label>
                <select name="year" class="w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 py-2 px-3 text-sm">
                    <option value="Semua">Semua</option>
                    @foreach($years as $year)
                        <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>{{ $year }}</option>
                    @endforeach
                </select>
            </div>

            {{-- Filter Status --}}
            <div class="min-w-[140px]">
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Status Verifikasi</label>
                <select name="status" class="w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 py-2 px-3 text-sm">
                    <option value="Semua">Semua</option>
                    <option value="Terverifikasi" {{ request('status') == 'Terverifikasi' ? 'selected' : '' }}>Terverifikasi</option>
                    <option value="Menunggu Verifikasi" {{ request('status') == 'Menunggu Verifikasi' ? 'selected' : '' }}>Menunggu Verifikasi</option>
                </select>
            </div>
            
            {{-- Filter Lokasi --}}
            <div class="min-w-[140px]">
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Lokasi (Kota/Negara)</label>
                <select name="location" class="w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 py-2 px-3 text-sm">
                    <option value="Semua">Semua</option>
                    @foreach($commonLocations as $location)
                        <option value="{{ $location }}" {{ request('location') == $location ? 'selected' : '' }}>{{ $location }}</option>
                    @endforeach
                </select>
            </div>

            {{-- Filter Bidang Karir --}}
            <div class="min-w-[180px]">
                <label class="text-xs font-semibold text-slate-500 mb-1 block">Bidang Karir</label>
                <select name="career_field" class="w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 py-2 px-3 text-sm">
                    <option value="Semua">Semua</option>
                    @foreach($careerFields as $field)
                        <option value="{{ $field }}" {{ request('career_field') == $field ? 'selected' : '' }}>{{ $field }}</option>
                    @endforeach
                </select>
            </div>


            <button type="submit" class="px-5 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors text-sm h-[38px] mt-auto">
                Filter
            </button>
            
            @if(request()->has('search') || request()->has('year') || request()->has('status') || request()->has('location') || request()->has('career_field'))
                <a href="{{ route('admin.alumni.index') }}" class="px-4 py-2 text-slate-500 hover:text-red-500 text-sm font-medium h-[38px] flex items-center">
                    Reset
                </a>
            @endif
        </form>

        {{-- TABLE --}}
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th class="px-6 py-3">Nama Alumni</th>
                        <th class="px-6 py-3">Angkatan</th>
                        <th class="px-6 py-3">Pekerjaan</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($alumnis as $alumni)
                    <tr class="bg-white border-b hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                    {{ substr($alumni->name, 0, 2) }}
                                </div>
                                <div>
                                    <div class="font-semibold text-slate-800">{{ $alumni->name }}</div>
                                    <div class="text-xs text-slate-500">{{ $alumni->nim }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">{{ $alumni->graduation_year }}</td>
                        <td class="px-6 py-4">
                            @if($alumni->current_job)
                                {{ Str::limit($alumni->current_job, 30) }}
                                @if($alumni->company_name)
                                    <br><span class="text-xs text-slate-400">{{ $alumni->company_name }}</span>
                                @endif
                            @else
                                <span class="text-slate-400">-</span>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            @if($alumni->user && $alumni->user->hasVerifiedEmail())
                                <span class="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">
                                    Terverifikasi
                                </span>
                            @else
                                <span class="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full border border-yellow-200">
                                    Pending
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button onclick="openEditModal({{ json_encode($alumni) }}, {{ json_encode($alumni->user ?? null) }})" class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $alumni->id }}, '{{ $alumni->name }}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                            <div class="flex flex-col items-center">
                                <i class="fa-solid fa-users-slash text-4xl mb-3 text-slate-300"></i>
                                <p>Tidak ada data alumni ditemukan.</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        {{-- Pagination --}}
        <div class="mt-6">
            {{ $alumnis->links() }} 
        </div>
    </div>
    
    {{-- MODAL: TAMBAH ALUMNI (CREATE) --}}
    <div id="addModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <form method="POST" action="{{ route('admin.alumni.store') }}">
                @csrf
                <div class="flex justify-between items-center p-5 border-b">
                    <h3 class="text-xl font-bold text-slate-800">Tambah Alumni Baru</h3>
                    <button type="button" onclick="closeAddModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {{-- Left Column (Alumni Info) --}}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-slate-600 border-b pb-1">Data Pokok</h4>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap *</label>
                            <input type="text" name="name" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">NIM *</label>
                            <input type="text" name="nim" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Angkatan *</label>
                            <input type="number" name="graduation_year" required min="1990" max="{{ date('Y') }}" placeholder="Contoh: 2023" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Jurusan *</label>
                            <select name="major" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                                <option value="Teknologi Rekayasa Perangkat Lunak">Teknologi Rekayasa Perangkat Lunak</option>
                                <option value="Manajemen Informatika">Manajemen Informatika</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                                <select name="gender" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">No. Telp</label>
                                <input type="tel" name="phone_number" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                            <input type="text" name="address" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                    </div>
                    
                    {{-- Right Column (User Account Info) --}}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-slate-600 border-b pb-1">Akun Login (Opsional)</h4>
                        <p class="text-xs text-slate-500 italic">Isi jika alumni sudah/akan memiliki akun login. Akun akan otomatis terverifikasi.</p>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Email Login</label>
                            <input type="email" name="email" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input type="password" name="password" minlength="8" placeholder="Min 8 karakter" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                        <div class="pt-4">
                             <h4 class="font-semibold text-slate-600 border-b pb-1">Karir (Opsional)</h4>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Saat Ini</label>
                                <input type="text" name="current_job" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
                                <input type="text" name="company_name" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end items-center p-5 border-t mt-4 gap-3">
                    <button type="button" onclick="closeAddModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                        Batal
                    </button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                        Simpan Data Alumni
                    </button>
                </div>
            </form>
        </div>
    </div>

    {{-- MODAL: EDIT ALUMNI (UPDATE) --}}
    <div id="editModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            {{-- Form action is set dynamically by JS --}}
            <form id="editForm" method="POST" action="">
                @csrf
                @method('PUT')
                <div class="flex justify-between items-center p-5 border-b">
                    <h3 class="text-xl font-bold text-slate-800">Edit Data Alumni: <span id="editNameHeader" class="text-brand-600"></span></h3>
                    <button type="button" onclick="closeEditModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {{-- Left Column (Alumni Info) --}}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-slate-600 border-b pb-1">Data Pokok</h4>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap *</label>
                            <input type="text" id="edit_name" name="name" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">NIM</label>
                            <input type="text" id="edit_nim" readonly class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm bg-slate-100 text-slate-500">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Angkatan *</label>
                            <input type="number" id="edit_graduation_year" name="graduation_year" required min="1990" max="{{ date('Y') }}" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Status Verifikasi *</label>
                            <select id="edit_status" name="status" required class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                                <option value="Terverifikasi">Terverifikasi</option>
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            </select>
                        </div>
                    </div>
                    
                    {{-- Right Column (Career & Account Info) --}}
                    <div class="space-y-4">
                        <h4 class="font-semibold text-slate-600 border-b pb-1">Karir & Akun Login</h4>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Saat Ini</label>
                            <input type="text" id="edit_current_job" name="current_job" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
                            <input type="text" id="edit_company_name" name="company_name" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Email Login</label>
                            <input type="email" id="edit_email" name="email" class="w-full border border-slate-300 rounded-lg py-2 px-3 text-sm focus:ring-brand-200" placeholder="Jika ada/baru dibuat">
                            <p class="text-xs text-slate-400 mt-1">Hanya terisi jika akun user sudah ada atau baru dibuat.</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end items-center p-5 border-t mt-4 gap-3">
                    <button type="button" onclick="closeEditModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                        Batal
                    </button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>

    {{-- DELETE MODAL (unchanged) --}}
    <div id="deleteModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Data Alumni?</h3>
            <p class="text-slate-500 text-sm mb-6">
                Anda akan menghapus data <strong id="deleteName" class="text-slate-800"></strong>. 
                Tindakan ini tidak dapat dibatalkan dan akun user terkait juga akan dihapus.
            </p>
            
            <form id="deleteForm" method="POST" class="flex gap-3 justify-center">
                @csrf
                @method('DELETE')
                <button type="button" onclick="closeDeleteModal()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                    Batal
                </button>
                <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
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
        // Clear any previous error states or input values
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
        
        // Populate Header
        document.getElementById('editNameHeader').textContent = alumni.name;

        // Populate Form Fields
        document.getElementById('edit_name').value = alumni.name;
        document.getElementById('edit_nim').value = alumni.nim;
        document.getElementById('edit_graduation_year').value = alumni.graduation_year;
        document.getElementById('edit_current_job').value = alumni.current_job || '';
        document.getElementById('edit_company_name').value = alumni.company_name || '';
        
        // Handle User/Email field and Status dropdown
        const statusSelect = document.getElementById('edit_status');
        const emailInput = document.getElementById('edit_email');
        
        if (user) {
            emailInput.value = user.email || '';
            emailInput.disabled = false;
            
            if (user.email_verified_at) {
                statusSelect.value = 'Terverifikasi';
            } else {
                statusSelect.value = 'Menunggu Verifikasi';
            }
        } else {
            // No user account linked yet
            emailInput.value = '';
            emailInput.disabled = false; 
            statusSelect.value = 'Menunggu Verifikasi';
        }

        // Set Form Action for Update Route
        form.action = `/admin/alumni/${alumni.id}`;
        
        openModal('editModal');
    }
    function closeEditModal() {
        closeModal('editModal');
    }

    // --- DELETE MODAL (Delete) ---
    function openDeleteModal(id, name) {
        const modal = document.getElementById('deleteModal');
        const form = document.getElementById('deleteForm');
        const nameSpan = document.getElementById('deleteName');

        form.action = `/admin/alumni/${id}`;
        nameSpan.textContent = name;

        openModal('deleteModal');
    }
    function closeDeleteModal() {
        closeModal('deleteModal');
    }

</script>
@endpush