import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import DeleteConfirmModal from '../../../Components/DeleteConfirmModal';
import { useToast } from '../../../Components/ToastContext';

// Helper for Category Colors
const CategoryBadge = ({ category }) => {
    const colors = {
        'Technology': 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        'Campus': 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        'Career': 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
        'General': 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        'Event': 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    };
    
    const theme = colors[category] || colors['General'];

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme}`}>
            {category}
        </span>
    );
};

export default function NewsIndex({ news, filters }) {
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
            router.get(route('admin.news.index'), queryParams, {
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
            router.delete(route('admin.news.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setIsDeleting(false);
                    setItemToDelete(null);
                    addToast('Berita berhasil dihapus!', 'success');
                },
                onError: () => {
                    setIsDeleting(false);
                    addToast('Gagal menghapus berita.', 'error');
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="News & Updates" />

            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        News & Updates
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Kelola artikel berita, pengumuman kampus, dan event.
                    </p>
                </div>
                <Link 
                    href={route('admin.news.create')} 
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm w-full md:w-auto"
                >
                    <i className="fa-solid fa-pen-nib"></i> Tulis Berita
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4 transition-all hover:shadow-md">
                {/* Search Input */}
                <div className="relative group">
                    <i className={`fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm transition-colors ${isSearching ? 'text-brand-500' : ''}`}></i>
                    <input 
                        type="text" 
                        placeholder="Cari judul artikel, penulis, atau konten..." 
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
                            <option value="Technology">Technology</option>
                            <option value="Campus">Campus</option>
                            <option value="Career">Career</option>
                            <option value="Event">Event</option>
                            <option value="General">General</option>
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
                                
                                <th className="px-2 md:px-6 py-4 min-w-[200px] md:min-w-0">Artikel</th>
                                {/* Hidden on Mobile */}
                                <th className="px-6 py-4 hidden md:table-cell">Kategori</th>
                                <th className="px-6 py-4 hidden md:table-cell">Penulis & Tanggal</th>
                                <th className="px-6 py-4 hidden md:table-cell text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {news.data.length > 0 ? (
                                news.data.map((item, index) => (
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
                                                    <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600 group-hover:scale-105 transition-transform duration-300">
                                                        {item.image ? (
                                                            <img src={`/storage/${item.image}`} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <i className="fa-solid fa-image text-xs"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-md min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 md:line-clamp-2">
                                                            {item.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Columns visible only on Desktop */}
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <CategoryBadge category={item.category || 'General'} />
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {item.author?.name || 'Admin'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        href={route('admin.news.edit', item.id)}
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

                                        {/* EXPANDED ROW (MOBILE DETAIL CARD - ALUMNI STYLE) */}
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

                                                        {/* 2. Penulis & Tanggal */}
                                                        <div className="grid grid-cols-3 gap-2 items-start">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-1 pt-1">Detail Info</div>
                                                            <div className="col-span-2">
                                                                <p className="font-bold text-slate-700 dark:text-slate-300">{item.author?.name || 'Admin'}</p>
                                                                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                                                    <i className="fa-regular fa-calendar"></i>
                                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* 3. MOBILE ACTIONS (Full Width Buttons) */}
                                                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                                                            <Link 
                                                                href={route('admin.news.edit', item.id)} 
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
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600"><i className="fa-solid fa-newspaper text-2xl"></i></div>
                                            <p className="text-sm font-bold">Belum ada berita yang diterbitkan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <Pagination links={news.links} />
                </div>
            </div>

            <DeleteConfirmModal 
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Artikel?"
                description={`Apakah Anda yakin ingin menghapus artikel "${itemToDelete?.title}"?`}
            />
        </AdminLayout>
    );
}