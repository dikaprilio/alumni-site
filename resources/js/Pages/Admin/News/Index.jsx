import React, { useState, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import DeleteConfirmModal from '../../../Components/DeleteConfirmModal';
import { useToast } from '../../../Components/ToastContext'; // Import ToastContext

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
    const { addToast } = useToast(); // Hook Toast
    const [search, setSearch] = useState(filters.search || '');
    
    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search Logic
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(route('admin.news.index'), { search: value }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 400),
        []
    );

    const handleSearch = (e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
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
                    addToast('Berita berhasil dihapus!', 'success'); // Tampilkan Toast Sukses
                },
                onError: () => {
                    setIsDeleting(false);
                    addToast('Gagal menghapus berita.', 'error'); // Tampilkan Toast Error
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="News & Updates" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm"
                >
                    <i className="fa-solid fa-pen-nib"></i> Tulis Berita
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
                <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                    <input 
                        type="text" 
                        placeholder="Cari judul artikel atau kategori..." 
                        value={search}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                <th className="px-6 py-4">Artikel</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Penulis & Tanggal</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {news.data.length > 0 ? (
                                news.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600">
                                                    {item.image ? (
                                                        <img src={`/storage/${item.image}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <i className="fa-solid fa-image text-xs"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-md">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                        {item.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <CategoryBadge category={item.category || 'General'} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {item.author?.name || 'Admin'}
                                                </span>
                                                <span className="text-[10px] text-slate-500">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={route('admin.news.edit', item.id)}
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
                                        Belum ada berita yang diterbitkan.
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