import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import DeleteConfirmModal from '../../../Components/DeleteConfirmModal';
import { useToast } from '../../../Components/ToastContext';

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

export default function EventIndex({ event: events, filters }) {
    const { addToast } = useToast();

    const [params, setParams] = useState({
        search: filters.search || '',
        category: filters.category || '',
    });

    const [isSearching, setIsSearching] = useState(false);

    // State untuk tracking baris yang di-expand di mobile
    const [expandedRows, setExpandedRows] = useState({});

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch Logic (Debounced)
    const debouncedFetch = useCallback(
        debounce((queryParams) => {
            router.get(route('admin.events.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            });
        }, 400),
        []
    );

    const handleChange = (field, value) => {
        const newParams = { ...params, [field]: value };
        setParams(newParams);
        setIsSearching(true);
        debouncedFetch(newParams);
    };

    // --- TOGGLE ROW LOGIC (MOBILE) ---
    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
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
                    addToast('Event berhasil dihapus!', 'success');
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

            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
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
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm w-full md:w-auto"
                >
                    <i className="fa-solid fa-calendar-plus"></i> Tambah Event
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4 transition-all hover:shadow-md">
                {/* Search Input */}
                <div className="relative group">
                    <i className={`fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm transition-colors ${isSearching ? 'text-brand-500' : ''}`}></i>
                    <input
                        type="text"
                        placeholder="Cari judul event atau lokasi..."
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:scale-[1.005]"
                    />
                    {isSearching && <div className="absolute right-4 top-3.5"><i className="fa-solid fa-circle-notch fa-spin text-brand-500 text-sm"></i></div>}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <select
                            value={params.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 focus:border-blue-500 outline-none cursor-pointer transition-colors hover:border-blue-300"
                        >
                            <option value="">SEMUA KATEGORI</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Reuni">Reuni</option>
                            <option value="Lowongan">Job Fair</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                {/* Mobile Chevron Header */}
                                <th className="pl-4 pr-2 py-4 md:hidden w-8"></th>

                                <th className="px-2 md:px-6 py-4 min-w-[200px] md:min-w-0">Event Info</th>
                                {/* Hidden on Mobile */}
                                <th className="px-6 py-4 hidden md:table-cell">Jadwal & Lokasi</th>
                                <th className="px-6 py-4 hidden md:table-cell">Kategori</th>
                                <th className="px-6 py-4 hidden md:table-cell text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {events.data.length > 0 ? (
                                events.data.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        {/* MAIN ROW */}
                                        <tr
                                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer md:cursor-default ${expandedRows[item.id] ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}
                                            onClick={() => toggleRow(item.id)}
                                        >
                                            {/* Mobile Chevron Toggle */}
                                            <td className="pl-4 pr-2 py-4 md:hidden align-middle">
                                                <div className={`w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300 ${expandedRows[item.id] ? 'rotate-180 bg-blue-50 text-blue-500' : ''}`}>
                                                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                </div>
                                            </td>

                                            <td className="px-2 md:px-6 py-4">
                                                <div className="flex gap-4 items-center">
                                                    {/* Date Box */}
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center flex-shrink-0 group-hover:border-blue-200 transition-colors">
                                                        <span className="text-[9px] uppercase font-bold text-red-500">
                                                            {new Date(item.event_date).toLocaleDateString('id-ID', { month: 'short' })}
                                                        </span>
                                                        <span className="text-lg font-black text-slate-800 dark:text-slate-200 leading-none">
                                                            {new Date(item.event_date).getDate()}
                                                        </span>
                                                    </div>
                                                    <div className="max-w-xs min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 md:line-clamp-2">
                                                            {item.description.replace(/<[^>]*>?/gm, '').substring(0, 60)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Columns visible only on Desktop */}
                                            <td className="px-6 py-4 hidden md:table-cell">
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
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <CategoryBadge category={item.category || 'General'} />
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.events.edit', item.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(item)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <i className="fa-solid fa-trash text-xs"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* EXPANDED ROW (MOBILE DETAIL CARD) */}
                                        {expandedRows[item.id] && (
                                            <tr className="md:hidden bg-slate-50/50 dark:bg-slate-800/30 animate-slide-down">
                                                <td colSpan="2" className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="space-y-4 text-sm">

                                                        {/* 1. Kategori */}
                                                        <div className="grid grid-cols-3 gap-2 items-center">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-1">Kategori</div>
                                                            <div className="col-span-2">
                                                                <CategoryBadge category={item.category || 'General'} />
                                                            </div>
                                                        </div>

                                                        {/* 2. Jadwal & Lokasi */}
                                                        <div className="grid grid-cols-3 gap-2 items-start">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-1 pt-1">Detail Info</div>
                                                            <div className="col-span-2 space-y-2">
                                                                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                                                                    <i className="fa-regular fa-clock text-slate-400 w-4 text-center"></i>
                                                                    {new Date(item.event_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                                                                    <i className="fa-solid fa-location-dot text-slate-400 w-4 text-center"></i>
                                                                    {item.location}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* 3. MOBILE ACTIONS (Full Width Buttons) */}
                                                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                                                            <Link
                                                                href={route('admin.events.edit', item.id)}
                                                                className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                                            >
                                                                <i className="fa-solid fa-pen"></i> Edit
                                                            </Link>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); confirmDelete(item); }}
                                                                className="flex-1 py-2 px-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                                            >
                                                                <i className="fa-solid fa-trash"></i> Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center animate-fade-in">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600"><i className="fa-solid fa-calendar-xmark text-2xl"></i></div>
                                            <p className="text-sm font-bold">Belum ada agenda event yang dibuat.</p>
                                        </div>
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