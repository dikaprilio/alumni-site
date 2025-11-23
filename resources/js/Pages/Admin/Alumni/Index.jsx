import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import DeleteConfirmModal from '../../../Components/DeleteConfirmModal';
import Modal from '../../../Components/Modal'; // Import Modal Dasar
import InputLabel from '../../../Components/InputLabel';
import TextArea from '../../../Components/TextArea';
import { useToast } from '../../../Components/ToastContext';
import { debounce } from 'lodash'; 

// ... (StatusBadge Component - No Change) ...
const StatusBadge = ({ hasAccount, completeness }) => {
    if (!hasAccount) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <i className="fa-solid fa-user-slash"></i> No Account
            </span>
        );
    }

    let colorClass = 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    let label = 'Incomplete';
    let icon = 'fa-circle-exclamation';

    if (completeness >= 80) {
        colorClass = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
        label = 'Complete';
        icon = 'fa-circle-check';
    } else if (completeness >= 40) {
        colorClass = 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        label = 'Partial';
        icon = 'fa-circle-half-stroke';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}>
            <i className={`fa-solid ${icon}`}></i> {label}
        </span>
    );
};

export default function AlumniIndex({ alumni = { data: [], links: [] }, filters = {}, graduationYears = [] }) {
    const { addToast } = useToast();
    
    const [params, setParams] = useState({
        search: filters?.search || '',
        graduation_year: filters?.graduation_year || '',
        employment_status: filters?.employment_status || '',
        has_account: filters?.has_account || '',
        location: filters?.location || '',
        sort_by: 'name', 
        sort_dir: 'asc',
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // --- FEATURED MODAL STATE ---
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [itemToPromote, setItemToPromote] = useState(null);
    const [promoteReason, setPromoteReason] = useState('');
    const [isPromoting, setIsPromoting] = useState(false);

    const debouncedFetch = useCallback(
        debounce((queryParams) => {
            router.get(route('admin.alumni.index'), queryParams, {
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

    const handleSort = (field) => {
        const newDir = params.sort_by === field && params.sort_dir === 'asc' ? 'desc' : 'asc';
        handleChange('sort_by', field);
        handleChange('sort_dir', newDir);
    };

    const confirmDelete = (alum) => {
        setItemToDelete(alum);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (itemToDelete) {
            setIsDeleting(true);
            router.delete(route('admin.alumni.destroy', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setIsDeleting(false);
                    setItemToDelete(null);
                    addToast('Data alumni berhasil dihapus.', 'success');
                },
                onError: () => {
                    setIsDeleting(false);
                    addToast('Gagal menghapus data.', 'error');
                }
            });
        }
    };

    // --- NEW: PROMOTE HANDLERS ---
    const openPromoteModal = (alum) => {
        if (alum.featured_at) {
            // Jika sudah featured, langsung toggle off tanpa modal alasan
            if (confirm(`Hapus status Alumni of the Month dari ${alum.name}?`)) {
                router.post(route('admin.alumni.toggle_featured', alum.id), {}, {
                    onSuccess: () => addToast(`Status featured ${alum.name} dicabut.`, 'success'),
                });
            }
        } else {
            // Jika belum, buka modal untuk isi alasan
            setItemToPromote(alum);
            setPromoteReason('');
            setShowPromoteModal(true);
        }
    };

    const handlePromoteSubmit = () => {
        if (!itemToPromote) return;
        
        setIsPromoting(true);
        router.post(route('admin.alumni.toggle_featured', itemToPromote.id), {
            featured_reason: promoteReason
        }, {
            onSuccess: () => {
                setShowPromoteModal(false);
                setIsPromoting(false);
                setItemToPromote(null);
                addToast(`${itemToPromote.name} sekarang menjadi Alumni of the Month!`, 'success');
            },
            onError: () => {
                setIsPromoting(false);
                addToast('Gagal mengupdate status.', 'error');
            }
        });
    };

    const handleExport = (type) => {
        addToast('Mempersiapkan file export...', 'success');
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.append('type', type);
        window.location.href = `${route('admin.alumni.export')}?${currentParams.toString()}`;
    };

    const alumniList = alumni?.data || [];
    const alumniLinks = alumni?.links || [];

    return (
        <AdminLayout>
            <Head title="Direktori Alumni" />

            {/* Header & Filters */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Direktori Alumni
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Kelola data master, akun pengguna, dan pantau kelengkapan profil.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2">
                            <i className="fa-solid fa-file-export"></i> Export
                            <i className="fa-solid fa-chevron-down text-[10px] transition-transform group-hover:rotate-180"></i>
                        </button>
                        
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                            <button onClick={() => handleExport('xlsx')} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 border-b border-slate-50 dark:border-slate-700">
                                <i className="fa-solid fa-file-excel text-green-600 text-base"></i> Excel (.xlsx)
                            </button>
                            <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3">
                                <i className="fa-solid fa-file-pdf text-red-600 text-base"></i> PDF Document
                            </button>
                        </div>
                    </div>

                    <Link href={route('admin.alumni.create')} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm text-sm md:text-base w-full md:w-auto">
                        <i className="fa-solid fa-plus"></i> Tambah Alumni
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4 transition-all hover:shadow-md">
                <div className="relative group">
                    <i className={`fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm transition-colors ${isSearching ? 'text-brand-500' : ''}`}></i>
                    <input 
                        type="text" 
                        placeholder="Cari Nama, NIM, Jurusan, Perusahaan, atau Email..." 
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:scale-[1.005]"
                    />
                    {isSearching && <div className="absolute right-4 top-3.5"><i className="fa-solid fa-circle-notch fa-spin text-brand-500 text-sm"></i></div>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Filters */}
                    {['graduation_year', 'employment_status', 'has_account'].map((filter) => (
                        <div key={filter} className="relative">
                             <select value={params[filter]} onChange={(e) => handleChange(filter, e.target.value)} className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 focus:border-blue-500 outline-none cursor-pointer transition-colors hover:border-blue-300">
                                <option value="">{filter.replace('_', ' ').toUpperCase()}</option> 
                                {filter === 'graduation_year' && graduationYears.map(y => <option key={y} value={y}>{y}</option>)}
                                {filter === 'employment_status' && <><option value="employed">Employed</option><option value="unemployed">Unemployed</option></>}
                                {filter === 'has_account' && <><option value="yes">Has Account</option><option value="no">No Account</option></>}
                            </select>
                        </div>
                    ))}
                    <div className="relative">
                        <i className="fa-solid fa-location-dot absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                        <input type="text" placeholder="Location..." value={params.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:border-blue-500 outline-none transition-all hover:border-blue-300" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                <th className="px-6 py-4 cursor-pointer hover:text-brand-600 transition-colors group" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">
                                        Alumni Info
                                        <i className={`fa-solid fa-arrow-up transition-transform duration-300 ${params.sort_by === 'name' ? (params.sort_dir === 'asc' ? 'rotate-0 text-brand-600' : 'rotate-180 text-brand-600') : 'opacity-0 group-hover:opacity-50'}`}></i>
                                    </div>
                                </th>
                                <th className="px-6 py-4">Karir & Lokasi</th>
                                <th className="px-6 py-4">Status Akun</th>
                                <th className="px-6 py-4 text-center">Kelengkapan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {alumniList.length > 0 ? (
                                alumniList.map((alum, index) => (
                                    <tr key={alum.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group animate-fade-in-up ${alum.featured_at ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600 group-hover:scale-110 transition-transform duration-300">
                                                        {alum.avatar ? <img src={`/storage/${alum.avatar}`} alt={alum.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">{alum.name ? alum.name.charAt(0) : '?'}</div>}
                                                    </div>
                                                    {alum.featured_at && (
                                                        <div className="absolute -top-2 -right-1 text-amber-500 text-[10px] bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm animate-bounce-small" title="Alumni of the Month">
                                                            <i className="fa-solid fa-crown"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {alum.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                        <span className="font-mono">{alum.nim}</span>
                                                        <span>•</span>
                                                        <span>Angkatan {alum.graduation_year}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {alum.current_position ? (
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alum.current_position}</p>
                                                    <p className="text-[10px] text-slate-500">{alum.company_name || '-'}</p>
                                                    {alum.address && <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-1"><i className="fa-solid fa-location-dot"></i> {alum.address.substring(0, 20)}...</p>}
                                                </div>
                                            ) : <span className="text-[10px] text-slate-400 italic bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Belum bekerja / update</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge hasAccount={!!alum.user_id} completeness={alum.profile_completeness || 0} />
                                            {alum.user && <p className="text-[9px] text-slate-400 mt-1 truncate max-w-[120px]" title={alum.user.email}>{alum.user.email}</p>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${(alum.profile_completeness || 0) >= 80 ? 'bg-emerald-500' : (alum.profile_completeness || 0) >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${alum.profile_completeness || 0}%` }}></div>
                                            </div>
                                            <p className="text-[9px] text-center text-slate-400 mt-1 font-mono font-bold">{alum.profile_completeness || 0}%</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* FEATURE BUTTON */}
                                                <button 
                                                    onClick={() => openPromoteModal(alum)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 ${alum.featured_at ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'}`}
                                                    title="Jadikan Alumni of the Month"
                                                >
                                                    <i className="fa-solid fa-crown text-xs"></i>
                                                </button>

                                                <Link href={route('admin.alumni.edit', alum.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95">
                                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                </Link>
                                                <button onClick={() => confirmDelete(alum)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-all hover:scale-110 active:scale-95">
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center animate-fade-in">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600"><i className="fa-solid fa-filter-circle-xmark text-2xl"></i></div>
                                            <p className="text-sm font-bold">Data tidak ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {alumniLinks.length > 0 && <div className="border-t border-slate-200 dark:border-slate-800 p-4"><Pagination links={alumniLinks} /></div>}
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} processing={isDeleting} title="Hapus Data Alumni?" description={`Apakah Anda yakin ingin menghapus data ${itemToDelete?.name}?`} />

            {/* --- FEATURED MODAL (Conditional Rendering ADDED) --- */}
            {showPromoteModal && (
                <Modal show={showPromoteModal} onClose={() => setShowPromoteModal(false)} maxWidth="md">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-crown text-amber-500"></i> Promosikan Alumni
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Anda akan menjadikan <strong>{itemToPromote?.name}</strong> sebagai "Alumni of the Month". Berikan alasan singkat atau highlight prestasinya.
                        </p>
                        
                        <div className="mb-4">
                            <InputLabel value="Alasan / Prestasi (Tampil di Homepage)" />
                            <TextArea 
                                value={promoteReason}
                                onChange={(e) => setPromoteReason(e.target.value)}
                                rows="3"
                                className="w-full mt-1"
                                placeholder="Contoh: Berhasil mendirikan startup teknologi yang berdampak..."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowPromoteModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700">
                                Batal
                            </button>
                            <button 
                                onClick={handlePromoteSubmit}
                                disabled={isPromoting}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-amber-500/30 flex items-center gap-2"
                            >
                                {isPromoting ? 'Menyimpan...' : 'Simpan & Promosikan'} <i className="fa-solid fa-check"></i>
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

        </AdminLayout>
    );
}