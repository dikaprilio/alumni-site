@extends('layouts.admin_layout')

@section('title', 'Manajemen Event - Alumni Portal')

@section('content')
    <header class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold text-slate-800">Event & Reuni</h1>
            <p class="text-slate-500">Jadwalkan kegiatan untuk alumni.</p>
        </div>
        <button onclick="openAddModal()" class="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> Buat Event
        </button>
    </header>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-slate-500">
                <thead class="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th class="px-6 py-3">Nama Event</th>
                        <th class="px-6 py-3">Jadwal</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($events as $event)
                    <tr class="bg-white border-b hover:bg-slate-50">
                        <td class="px-6 py-4">
                            <div class="font-semibold text-slate-800">{{ $event->title }}</div>
                            <div class="text-xs text-slate-400"><i class="fa-solid fa-map-pin mr-1"></i> {{ $event->location }}</div>
                        </td>
                        <td class="px-6 py-4">
                            {{ \Carbon\Carbon::parse($event->event_date)->format('d M Y, H:i') }}
                        </td>
                        <td class="px-6 py-4">
                            @php
                                $statusColor = match($event->status) {
                                    'upcoming' => 'bg-blue-100 text-blue-700',
                                    'ongoing' => 'bg-green-100 text-green-700',
                                    'finished' => 'bg-slate-100 text-slate-600',
                                };
                                $statusLabel = match($event->status) {
                                    'upcoming' => 'Akan Datang',
                                    'ongoing' => 'Sedang Berjalan',
                                    'finished' => 'Selesai',
                                };
                            @endphp
                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $statusColor }}">
                                {{ $statusLabel }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <button onclick="openEditModal({{ json_encode($event) }})" class="p-2 text-brand-600 hover:bg-brand-50 rounded-lg">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="openDeleteModal({{ $event->id }}, '{{ $event->title }}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-slate-400">Belum ada event terjadwal.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="mt-4">{{ $events->links() }}</div>
    </div>

    {{-- MODAL ADD EVENT --}}
    <div id="addModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data" class="p-6">
                @csrf
                <h3 class="text-xl font-bold mb-4">Buat Event Baru</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nama Event</label>
                        <input type="text" name="title" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu</label>
                            <input type="datetime-local" name="event_date" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select name="status" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                                <option value="upcoming">Akan Datang</option>
                                <option value="ongoing">Sedang Berjalan</option>
                                <option value="finished">Selesai</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                        <input type="text" name="location" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500" placeholder="Misal: Aula Kampus / Zoom Meeting">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Banner Event</label>
                        <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                        <textarea name="description" rows="4" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500"></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" class="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Simpan Event</button>
                </div>
            </form>
        </div>
    </div>

    {{-- MODAL EDIT EVENT --}}
    <div id="editModal" class="fixed inset-0 bg-slate-900/50 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form id="editForm" method="POST" enctype="multipart/form-data" class="p-6">
                @csrf @method('PUT')
                <h3 class="text-xl font-bold mb-4">Edit Event</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nama Event</label>
                        <input type="text" name="title" id="edit_title" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu</label>
                            <input type="datetime-local" name="event_date" id="edit_date" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select name="status" id="edit_status" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                                <option value="upcoming">Akan Datang</option>
                                <option value="ongoing">Sedang Berjalan</option>
                                <option value="finished">Selesai</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                        <input type="text" name="location" id="edit_location" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Ganti Banner (Opsional)</label>
                        <input type="file" name="image" accept="image/*" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                        <textarea name="description" id="edit_description" rows="4" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-brand-500"></textarea>
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
                <h3 class="text-lg font-bold mb-2">Hapus Event?</h3>
                <p class="text-sm text-slate-500 mb-6">Event "<span id="deleteTitle"></span>" akan dihapus.</p>
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
        document.getElementById('edit_description').value = item.description;
        document.getElementById('edit_location').value = item.location;
        document.getElementById('edit_status').value = item.status;
        // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
        const date = new Date(item.event_date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        document.getElementById('edit_date').value = date.toISOString().slice(0, 16);
        
        document.getElementById('editForm').action = `/admin/events/${item.id}`;
        document.getElementById('editModal').classList.remove('hidden');
    }
    function openDeleteModal(id, title) {
        document.getElementById('deleteTitle').innerText = title;
        document.getElementById('deleteForm').action = `/admin/events/${id}`;
        document.getElementById('deleteModal').classList.remove('hidden');
    }
</script>
@endpush