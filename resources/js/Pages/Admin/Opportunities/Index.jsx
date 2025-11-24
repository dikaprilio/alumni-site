import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputText from '../../../Components/InputText';
import Pagination from '../../../Components/Pagination';
import DeleteConfirmModal from '../../../Components/DeleteConfirmModal';
import { useToast } from '../../../Components/ToastContext';

export default function OpportunitiesIndex({ opportunities }) {
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(route('admin.opportunities.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        router.delete(route('admin.opportunities.destroy', itemToDelete.id), {
            onSuccess: () => {
                closeDeleteModal();
                setIsDeleting(false);
                addToast('Peluang karir berhasil dihapus.', 'success');
            },
            onError: () => {
                setIsDeleting(false);
                addToast('Gagal menghapus peluang karir.', 'error');
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Peluang Karir" />

            {/* HEADER & FILTER */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white">Peluang Karir</h1>
                    <p className="text-slate-500 text-sm">Kelola lowongan kerja & magang dari alumni.</p>
                </div>
                <div className="w-full md:w-72">
                    <InputText
                        placeholder="Cari posisi atau perusahaan..."
                        value={search}
                        onChange={handleSearch}
                        icon="fa-search"
                    />
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                {/* Mobile Chevron */}
                                <th className="pl-4 pr-2 py-4 md:hidden w-8"></th>

                                <th className="px-2 md:px-6 py-4">Posisi / Perusahaan</th>
                                <th className="hidden md:table-cell px-6 py-4">Tipe</th>
                                <th className="hidden md:table-cell px-6 py-4">Diposting Oleh</th>
                                <th className="hidden md:table-cell px-6 py-4">Lokasi</th>
                                <th className="hidden md:table-cell px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {opportunities.data.length > 0 ? (
                                opportunities.data.map((opp, index) => (
                                    <React.Fragment key={opp.id}>
                                        {/* PRIMARY ROW */}
                                        <tr
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer md:cursor-default"
                                            onClick={() => toggleRow(opp.id)}
                                        >
                                            {/* Mobile Chevron Toggle */}
                                            <td className="pl-4 pr-2 py-4 md:hidden align-middle">
                                                <div className={`w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300 ${expandedRows[opp.id] ? 'rotate-180 bg-blue-50 text-blue-500' : ''}`}>
                                                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                </div>
                                            </td>

                                            {/* Main Info */}
                                            <td className="px-2 md:px-6 py-4">
                                                <div className="font-bold text-slate-800 dark:text-white">{opp.title}</div>
                                                <div className="text-xs text-slate-500">{opp.company_name}</div>
                                                {/* Mobile Badges */}
                                                <div className="md:hidden flex items-center gap-2 mt-2">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${opp.type === 'JOB'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                        }`}>
                                                        {opp.type}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Desktop Columns */}
                                            <td className="hidden md:table-cell px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${opp.type === 'JOB'
                                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                    : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                    }`}>
                                                    {opp.type}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                                        {opp.alumni?.avatar ? (
                                                            <img src={`/storage/${opp.alumni.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <i className="fa-solid fa-user text-[10px] text-slate-500"></i>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                                                        {opp.alumni?.user?.name || 'Alumni Terhapus'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4 text-slate-500 text-sm">
                                                {opp.location || '-'}
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => confirmDelete(opp)}
                                                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-all hover:scale-110 active:scale-95"
                                                    title="Hapus"
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            </td>
                                        </tr>

                                        {/* EXPANDED ROW (MOBILE) */}
                                        {expandedRows[opp.id] && (
                                            <tr className="md:hidden bg-slate-50/50 dark:bg-slate-800/30 animate-slide-down">
                                                <td colSpan="2" className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="space-y-3 text-sm">
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-1">Lokasi</div>
                                                            <div className="col-span-2 text-slate-700 dark:text-slate-300">{opp.location || '-'}</div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider col-span-1">Oleh</div>
                                                            <div className="col-span-2 flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                                    {opp.alumni?.avatar ? (
                                                                        <img src={`/storage/${opp.alumni.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-user text-[8px]"></i></div>
                                                                    )}
                                                                </div>
                                                                <span className="text-slate-700 dark:text-slate-300">{opp.alumni?.user?.name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="pt-2 flex justify-end">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); confirmDelete(opp); }}
                                                                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold flex items-center gap-2"
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
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fa-solid fa-folder-open text-2xl opacity-50"></i>
                                            <span>Belum ada data peluang karir.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                    <Pagination links={opportunities.links} />
                </div>
            </div>

            {/* DELETE MODAL */}
            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Hapus Peluang Karir"
                description={`Anda yakin ingin menghapus "${itemToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                processing={isDeleting}
            />
        </AdminLayout>
    );
}