import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import DeleteConfirmModal from '../../../Components/DeleteConfirmModal';
import { useToast } from '../../../Components/ToastContext'; // Import ToastContext

// Helper for Event Category Colors
const CategoryBadge = ({ category }) => {
    const colors = {
        'Webinar': 'bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
        'Workshop': 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
        'Seminar': 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
        'Reuni': 'bg-pink-100 text-pink-600 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
        'Lowongan': 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        'General': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };
    
    const theme = colors[category] || colors['General'];

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme}`}>
            {category}
        </span>
    );
};

export default function EventIndex({ events, filters }) {
    const { addToast } = useToast(); // Hook Toast
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search Logic
    const debouncedFetch = useCallback(
        debounce((query, cat) => {
            router.get(route('admin.events.index'), { search: query, category: cat }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 400),
        []
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedFetch(value, category);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        debouncedFetch(search, value);
    };

    // --- DELETE LOGIC ---
    const confirmDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (itemToDelete) {
            setIsDeleting(true);
            router.delete(route('admin.events.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setIsDeleting(false);
                    setItemToDelete(null);
                    addToast('Event berhasil dihapus!', 'success'); // Tampilkan Toast
                },
                onError: () => {
                    setIsDeleting(false);
                    addToast('Gagal menghapus event.', 'error');
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Agenda & Events" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Agenda & Events
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Kelola jadwal kegiatan, webinar, dan reuni alumni.
                    </p>
                </div>
                <Link 
                    href={route('admin.events.create')} 
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm"
                >
                    <i className="fa-solid fa-calendar-plus"></i> Tambah Event
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4 md:space-y-0 md:flex md:gap-4">
                <div className="relative flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                    <input 
                        type="text" 
                        placeholder="Cari judul event atau lokasi..." 
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select 
                        value={category}
                        onChange={handleCategoryChange}
                        className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                    >
                        <option value="">Semua Kategori</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Reuni">Reuni</option>
                        <option value="Lowongan">Job Fair</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                <th className="px-6 py-4">Event Info</th>
                                <th className="px-6 py-4">Jadwal & Lokasi</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {events.data.length > 0 ? (
                                events.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                {/* Date Box (Left of info) - Unique design for events */}
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center flex-shrink-0">
                                                    <span className="text-[10px] uppercase font-bold text-red-500">
                                                        {new Date(item.event_date).toLocaleDateString('id-ID', { month: 'short' })}
                                                    </span>
                                                    <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none">
                                                        {new Date(item.event_date).getDate()}
                                                    </span>
                                                </div>
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                                        {item.description.replace(/<[^>]*>?/gm, '').substring(0, 60)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                    <i className="fa-regular fa-clock text-slate-400 w-4"></i>
                                                    {new Date(item.event_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                    <i className="fa-solid fa-location-dot text-slate-400 w-4"></i>
                                                    <span className="truncate max-w-[150px]" title={item.location}>{item.location}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <CategoryBadge category={item.category || 'General'} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={route('admin.events.edit', item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 transition-colors"
                                                >
                                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => confirmDelete(item)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 transition-colors"
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada agenda event yang dibuat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <Pagination links={events.links} />
                </div>
            </div>

            <DeleteConfirmModal 
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Event?"
                description={`Apakah Anda yakin ingin menghapus event "${itemToDelete?.title}"?`}
            />
        </AdminLayout>
    );
}