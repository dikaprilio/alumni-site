@extends('layouts.admin_layout')

@section('title', 'Manajemen Lowongan Kerja - Alumni Portal')

@section('content')
    <div class="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">Lowongan Kerja</h1>
            <p class="text-slate-500 mt-1 text-sm md:text-base">Posting dan kelola peluang karir untuk alumni.</p>
        </div>
        <button onclick="openAddModal()" class="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-0.5 text-sm w-full md:w-auto">
            <i class="fa-solid fa-plus"></i> Posting Loker
        </button>
    </div>

    <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="overflow-x-auto rounded-xl border border-slate-100">
            <table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th class="px-6 py-4 font-bold">Posisi & Perusahaan</th>
                        <th class="px-6 py-4 font-bold">Tipe & Lokasi</th>
                        <th class="px-6 py-4 font-bold">Status</th>
                        <th class="px-6 py-4 font-bold text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($jobs as $job)
                    <tr class="bg-white hover:bg-slate-50/80 transition-colors group">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-4">
                                @if($job->image)
                                    <img src="{{ asset('storage/' . $job->image) }}" class="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-sm">
                                @else
                                    <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-100">
                                        {{ substr($job->company_name, 0, 2) }}
                                    </div>
                                @endif
                                <div>
                                    <div class="font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">{{ $job->title }}</div>
                                    <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <i class="fa-regular fa-building"></i> {{ $job->company_name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-col gap-1">
                                <span class="text-slate-700 font-medium">{{ $job->job_type }}</span>
                                <span class="text-xs text-slate-400 flex items-center gap-1">
                                    <i class="fa-solid fa-location-dot text-[10px]"></i> 
                                    {{ $job->location ?? 'Remote' }}
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            @php
                                $statusStyles = match($job->status) {
                                    'active' => 'bg-emerald-50 text-emerald-700 border-emerald-100',
                                    'closed' => 'bg-slate-50 text-slate-600 border-slate-200',
                                    'draft' => 'bg-amber-50 text-amber-700 border-amber-100',
                                };
                                $statusLabel = match($job->status) {
                                    'active' => 'Tayang',
                                    'closed' => 'Tutup',
                                    'draft' => 'Draft',
                                };
                            @endphp
                            <span class="px-3 py-1 text-xs font-semibold rounded-full border {{ $statusStyles }}">
                                {{ $statusLabel }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button onclick="openEditModal({{ json_encode($job) }})" class="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="Edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $job->id }}, '{{ $job->title }}')" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <i class="fa-solid fa-briefcase text-2xl text-blue-300"></i>
                                </div>
                                <h3 class="text-slate-800 font-semibold mb-1">Belum ada lowongan</h3>
                                <p class="text-slate-500 text-sm">Posting lowongan kerja baru sekarang.</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="mt-6">{{ $jobs->links('pagination.admin') }}</div>
    </div>

    {{-- MODAL ADD --}}
    <div id="addModal" class="fixed inset-0 bg-slate-900/60 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                <div>
                    <h3 class="text-lg font-bold text-slate-800">Posting Lowongan Baru</h3>
                    <p class="text-xs text-slate-500">Isi detail pekerjaan untuk alumni.</p>
                </div>
                <button onclick="document.getElementById('addModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>

            <div class="overflow-y-auto p-6 custom-scrollbar">
                <form action="{{ route('admin.jobs.store') }}" method="POST" enctype="multipart/form-data" id="addForm">
                    @csrf
                    <div class="space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Judul Pekerjaan <span class="text-red-500">*</span></label>
                                <input type="text" name="title" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Perusahaan <span class="text-red-500">*</span></label>
                                <input type="text" name="company_name" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Tipe Pekerjaan <span class="text-red-500">*</span></label>
                                <select name="job_type" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi</label>
                                <div class="relative">
                                    <i class="fa-solid fa-location-dot absolute left-3 top-3 text-slate-400 text-sm"></i>
                                    <input type="text" name="location" class="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="Kota / Remote">
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Rentang Gaji (Opsional)</label>
                                <input type="text" name="salary_range" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="Contoh: 5jt - 8jt">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Batas Lamaran</label>
                                <input type="date" name="closing_date" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Link Lamaran (Opsional)</label>
                                <input type="url" name="application_url" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="https://...">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
                                <select name="status" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    <option value="active">Aktif (Tayang)</option>
                                    <option value="draft">Draft</option>
                                    <option value="closed">Tutup</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Logo Perusahaan (Opsional)</label>
                            <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer bg-slate-50 rounded-full border border-slate-200">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi & Persyaratan <span class="text-red-500">*</span></label>
                            <textarea name="description" rows="5" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y" placeholder="Jelaskan job description dan kualifikasi..."></textarea>
                        </div>
                    </div>
                </form>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors text-sm">
                    Batal
                </button>
                <button type="submit" form="addForm" class="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors text-sm shadow-md shadow-brand-500/20">
                    Posting
                </button>
            </div>
        </div>
    </div>

    {{-- MODAL EDIT --}}
    <div id="editModal" class="fixed inset-0 bg-slate-900/60 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                <div>
                    <h3 class="text-lg font-bold text-slate-800">Edit Lowongan</h3>
                    <p class="text-xs text-slate-500">Perbarui informasi lowongan kerja.</p>
                </div>
                <button onclick="document.getElementById('editModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>

            <div class="overflow-y-auto p-6 custom-scrollbar">
                <form id="editForm" method="POST" enctype="multipart/form-data">
                    @csrf @method('PUT')
                    <div class="space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Judul Pekerjaan</label>
                                <input type="text" name="title" id="edit_title" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Perusahaan</label>
                                <input type="text" name="company_name" id="edit_company_name" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Tipe Pekerjaan</label>
                                <select name="job_type" id="edit_job_type" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi</label>
                                <input type="text" name="location" id="edit_location" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Rentang Gaji</label>
                                <input type="text" name="salary_range" id="edit_salary_range" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Batas Lamaran</label>
                                <input type="date" name="closing_date" id="edit_closing_date" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Link Lamaran</label>
                                <input type="url" name="application_url" id="edit_application_url" class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
                            </div>
                             <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
                                <select name="status" id="edit_status" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white">
                                    <option value="active">Aktif</option>
                                    <option value="draft">Draft</option>
                                    <option value="closed">Tutup</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Ganti Logo (Opsional)</label>
                            <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer bg-slate-50 rounded-full border border-slate-200">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                            <textarea name="description" id="edit_description" rows="5" required class="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y"></textarea>
                        </div>
                    </div>
                </form>
            </div>

            <div class="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                <button type="button" onclick="document.getElementById('editModal').classList.add('hidden')" class="px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:text-slate-800 transition-colors text-sm">
                    Batal
                </button>
                <button type="submit" form="editForm" class="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors text-sm shadow-md shadow-brand-500/20">
                    Simpan Perubahan
                </button>
            </div>
        </div>
    </div>

    {{-- MODAL DELETE --}}
    <div id="deleteModal" class="fixed inset-0 bg-slate-900/60 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-all" role="dialog" aria-modal="true">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <i class="fa-solid fa-trash-can text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Hapus Lowongan?</h3>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">
                Lowongan "<strong id="deleteTitle" class="text-slate-800"></strong>" akan dihapus permanen.
            </p>
            <form id="deleteForm" method="POST" class="flex gap-3 justify-center">
                @csrf @method('DELETE')
                <button type="button" onclick="document.getElementById('deleteModal').classList.add('hidden')" class="flex-1 px-5 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
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

    // Ensure fade-in style exists
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