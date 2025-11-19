@extends('layouts.admin_layout')

@section('title', 'Manajemen Berita - Alumni Portal')

@section('content')
    <header class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold text-slate-800">Berita & Kabar</h1>
            <p class="text-slate-500">Kelola artikel dan informasi untuk alumni.</p>
        </div>
        <button onclick="openAddModal()" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> Tulis Berita
        </button>
    </header>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th class="px-6 py-3">Judul Berita</th>
                        <th class="px-6 py-3">Penulis</th>
                        <th class="px-6 py-3">Tanggal</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($news as $item)
                    <tr class="bg-white border-b hover:bg-slate-50">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if($item->image)
                                    <img src="{{ asset('storage/' . $item->image) }}" class="w-12 h-12 object-cover rounded-lg border border-slate-200">
                                @else
                                    <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <i class="fa-solid fa-image"></i>
                                    </div>
                                @endif
                                <span class="font-medium text-slate-800 line-clamp-1 max-w-xs">{{ $item->title }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4">{{ $item->author->name ?? 'Admin' }}</td>
                        <td class="px-6 py-4">{{ $item->created_at->format('d M Y') }}</td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button onclick="openEditModal({{ json_encode($item) }})" class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $item->id }}, '{{ $item->title }}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-slate-400">Belum ada berita yang diterbitkan.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="mt-4">{{ $news->links() }}</div>
    </div>

    {{-- MODAL ADD --}}
    <div id="addModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form action="{{ route('admin.news.store') }}" method="POST" enctype="multipart/form-data" class="p-6">
                @csrf
                <h3 class="text-xl font-bold mb-4">Tulis Berita Baru</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                        <input type="text" name="title" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Gambar Cover</label>
                        <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Konten</label>
                        <textarea name="content" rows="6" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500"></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Terbitkan</button>
                </div>
            </form>
        </div>
    </div>

    {{-- MODAL EDIT --}}
    <div id="editModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form id="editForm" method="POST" enctype="multipart/form-data" class="p-6">
                @csrf @method('PUT')
                <h3 class="text-xl font-bold mb-4">Edit Berita</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                        <input type="text" name="title" id="edit_title" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Ganti Gambar (Opsional)</label>
                        <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Konten</label>
                        <textarea name="content" id="edit_content" rows="6" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500"></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="document.getElementById('editModal').classList.add('hidden')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    </div>
    
    {{-- MODAL DELETE (Sama seperti Alumni) --}}
    <div id="deleteModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <form id="deleteForm" method="POST">
                @csrf @method('DELETE')
                <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-3"></i>
                <h3 class="text-lg font-bold mb-2">Hapus Berita?</h3>
                <p class="text-sm text-slate-500 mb-6">Data "<span id="deleteTitle"></span>" akan dihapus permanen.</p>
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
        document.getElementById('edit_content').value = item.content;
        document.getElementById('editForm').action = `/admin/news/${item.id}`;
        document.getElementById('editModal').classList.remove('hidden');
    }
    function openDeleteModal(id, title) {
        document.getElementById('deleteTitle').innerText = title;
        document.getElementById('deleteForm').action = `/admin/news/${id}`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }
</script>
@endpush