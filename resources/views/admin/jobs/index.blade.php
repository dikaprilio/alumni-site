@extends('layouts.admin_layout')

@section('title', 'Manajemen Lowongan Kerja - Alumni Portal')

@section('content')
    <header class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold text-slate-800">Lowongan Kerja</h1>
            <p class="text-slate-500">Posting peluang karir untuk alumni.</p>
        </div>
        <button onclick="openAddModal()" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> Posting Loker
        </button>
    </header>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th class="px-6 py-3">Posisi & Perusahaan</th>
                        <th class="px-6 py-3">Tipe & Lokasi</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($jobs as $job)
                    <tr class="bg-white border-b hover:bg-slate-50">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if($job->image)
                                    <img src="{{ asset('storage/' . $job->image) }}" class="w-10 h-10 object-cover rounded border border-slate-200">
                                @else
                                    <div class="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200">
                                        {{ substr($job->company_name, 0, 2) }}
                                    </div>
                                @endif
                                <div>
                                    <div class="font-semibold text-slate-800">{{ $job->title }}</div>
                                    <div class="text-xs text-slate-500">{{ $job->company_name }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-slate-700">{{ $job->job_type }}</div>
                            <div class="text-xs text-slate-400"><i class="fa-solid fa-location-dot mr-1"></i> {{ $job->location ?? 'Remote/Online' }}</div>
                        </td>
                        <td class="px-6 py-4">
                            @php
                                $statusColor = match($job->status) {
                                    'active' => 'bg-green-100 text-green-700',
                                    'closed' => 'bg-red-100 text-red-700',
                                    'draft' => 'bg-yellow-100 text-yellow-700',
                                };
                            @endphp
                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $statusColor }}">
                                {{ ucfirst($job->status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button onclick="openEditModal({{ json_encode($job) }})" class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $job->id }}, '{{ $job->title }}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-slate-400">Belum ada lowongan kerja diposting.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="mt-4">{{ $jobs->links() }}</div>
    </div>

    {{-- MODAL ADD --}}
    <div id="addModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form action="{{ route('admin.jobs.store') }}" method="POST" enctype="multipart/form-data" class="p-6">
                @csrf
                <h3 class="text-xl font-bold mb-4">Posting Lowongan Baru</h3>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Judul Pekerjaan *</label>
                            <input type="text" name="title" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan *</label>
                            <input type="text" name="company_name" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Tipe Pekerjaan *</label>
                            <select name="job_type" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                            <input type="text" name="location" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500" placeholder="Kota / Remote">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Rentang Gaji (Opsional)</label>
                            <input type="text" name="salary_range" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500" placeholder="Contoh: 5jt - 8jt">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Batas Lamaran</label>
                            <input type="date" name="closing_date" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Link Lamaran (Opsional)</label>
                            <input type="url" name="application_url" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500" placeholder="https://...">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select name="status" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                                <option value="active">Aktif (Tayang)</option>
                                <option value="draft">Draft</option>
                                <option value="closed">Tutup</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Logo Perusahaan (Opsional)</label>
                        <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi & Persyaratan *</label>
                        <textarea name="description" rows="5" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500" placeholder="Jelaskan job description dan kualifikasi..."></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Posting</button>
                </div>
            </form>
        </div>
    </div>

    {{-- MODAL EDIT --}}
    <div id="editModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form id="editForm" method="POST" enctype="multipart/form-data" class="p-6">
                @csrf @method('PUT')
                <h3 class="text-xl font-bold mb-4">Edit Lowongan</h3>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Judul Pekerjaan</label>
                            <input type="text" name="title" id="edit_title" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
                            <input type="text" name="company_name" id="edit_company_name" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Tipe Pekerjaan</label>
                            <select name="job_type" id="edit_job_type" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                            <input type="text" name="location" id="edit_location" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Rentang Gaji</label>
                            <input type="text" name="salary_range" id="edit_salary_range" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Batas Lamaran</label>
                            <input type="date" name="closing_date" id="edit_closing_date" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Link Lamaran</label>
                            <input type="url" name="application_url" id="edit_application_url" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select name="status" id="edit_status" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                                <option value="active">Aktif</option>
                                <option value="draft">Draft</option>
                                <option value="closed">Tutup</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Ganti Logo (Opsional)</label>
                        <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                        <textarea name="description" id="edit_description" rows="5" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500"></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="document.getElementById('editModal').classList.add('hidden')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    </div>

    {{-- MODAL DELETE --}}
    <div id="deleteModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <form id="deleteForm" method="POST">
                @csrf @method('DELETE')
                <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-3"></i>
                <h3 class="text-lg font-bold mb-2">Hapus Lowongan?</h3>
                <p class="text-sm text-slate-500 mb-6">Lowongan "<span id="deleteTitle"></span>" akan dihapus.</p>
                <div class="flex justify-center gap-3">
                    <button type="button" onclick="document.getElementById('deleteModal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg">Hapus</button>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    function openAddModal() {
        document.getElementById('addModal').classList.remove('hidden');
    }
    function openEditModal(item) {
        document.getElementById('edit_title').value = item.title;
        document.getElementById('edit_company_name').value = item.company_name;
        document.getElementById('edit_location').value = item.location;
        document.getElementById('edit_job_type').value = item.job_type;
        document.getElementById('edit_salary_range').value = item.salary_range;
        document.getElementById('edit_application_url').value = item.application_url;
        document.getElementById('edit_status').value = item.status;
        document.getElementById('edit_description').value = item.description;
        
        if(item.closing_date) {
            document.getElementById('edit_closing_date').value = new Date(item.closing_date).toISOString().split('T')[0];
        } else {
            document.getElementById('edit_closing_date').value = '';
        }
        
        document.getElementById('editForm').action = `/admin/jobs/${item.id}`;
        document.getElementById('editModal').classList.remove('hidden');
    }
    function openDeleteModal(id, title) {
        document.getElementById('deleteTitle').innerText = title;
        document.getElementById('deleteForm').action = `/admin/jobs/${id}`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }
</script>
@endpush