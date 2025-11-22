import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import { debounce } from 'lodash'; 

// Komponen Status Badge (Updated)
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

export default function AlumniIndex({ alumni, filters, graduationYears }) {
    // State untuk semua filter
    const [params, setParams] = useState({
        search: filters.search || '',
        graduation_year: filters.graduation_year || '',
        employment_status: filters.employment_status || '',
        has_account: filters.has_account || '',
        location: filters.location || '',
    });

    // Debounce Function untuk mengirim request
    const debouncedFetch = useCallback(
        debounce((queryParams) => {
            router.get(route('admin.alumni.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 400),
        []
    );

    // Handle perubahan input apa saja
    const handleChange = (field, value) => {
        const newParams = { ...params, [field]: value };
        setParams(newParams);
        debouncedFetch(newParams);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data alumni ini? Akun user terkait juga akan dihapus.')) {
            router.delete(route('admin.alumni.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Direktori Alumni" />

            {/* Header Section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Direktori Alumni
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Kelola data master, akun pengguna, dan pantau kelengkapan profil.
                    </p>
                </div>
                
                <Link 
                    href={route('admin.alumni.create')} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i> Tambah Alumni
                </Link>
            </div>

            {/* --- SMART FILTER TOOLBAR --- */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4">
                
                {/* 1. Global Search */}
                <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                    <input 
                        type="text" 
                        placeholder="Cari Nama, NIM, Jurusan, Perusahaan, atau Email..." 
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>

                {/* 2. Specific Filters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Filter Angkatan */}
                    <select 
                        value={params.graduation_year}
                        onChange={(e) => handleChange('graduation_year', e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                    >
                        <option value="">Semua Angkatan</option>
                        {graduationYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {/* Filter Status Kerja */}
                    <select 
                        value={params.employment_status}
                        onChange={(e) => handleChange('employment_status', e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                    >
                        <option value="">Status Pekerjaan</option>
                        <option value="employed">Sudah Bekerja</option>
                        <option value="unemployed">Belum Bekerja</option>
                    </select>

                    {/* Filter Lokasi */}
                    <div className="relative">
                        <i className="fa-solid fa-location-dot absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Filter Lokasi..." 
                            value={params.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Filter Akun */}
                    <select 
                        value={params.has_account}
                        onChange={(e) => handleChange('has_account', e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                    >
                        <option value="">Status Akun</option>
                        <option value="yes">Punya Akun</option>
                        <option value="no">Belum Ada Akun</option>
                    </select>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                <th className="px-6 py-4">Alumni Info</th>
                                <th className="px-6 py-4">Karir & Lokasi</th>
                                <th className="px-6 py-4">Status Akun</th>
                                <th className="px-6 py-4 text-center">Kelengkapan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {alumni.data.length > 0 ? (
                                alumni.data.map((alum) => (
                                    <tr key={alum.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        {/* 1. Alumni Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600">
                                                    {alum.avatar ? (
                                                        <img src={`/storage/${alum.avatar}`} alt={alum.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                                                            {alum.name.charAt(0)}
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

                                        {/* 2. Karir & Lokasi */}
                                        <td className="px-6 py-4">
                                            {alum.current_position ? (
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{alum.current_position}</p>
                                                    <p className="text-[10px] text-slate-500">{alum.company_name || '-'}</p>
                                                    {alum.address && (
                                                        <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-1">
                                                            <i className="fa-solid fa-location-dot"></i> {alum.address.substring(0, 20)}...
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400 italic bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    Belum bekerja / update
                                                </span>
                                            )}
                                        </td>

                                        {/* 3. Status Akun */}
                                        <td className="px-6 py-4">
                                            <StatusBadge 
                                                hasAccount={!!alum.user_id} 
                                                completeness={alum.profile_completeness} 
                                            />
                                            {alum.user && (
                                                <p className="text-[9px] text-slate-400 mt-1 truncate max-w-[120px]" title={alum.user.email}>
                                                    {alum.user.email}
                                                </p>
                                            )}
                                        </td>

                                        {/* 4. Kelengkapan (Progress) */}
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        alum.profile_completeness >= 80 ? 'bg-emerald-500' :
                                                        alum.profile_completeness >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`} 
                                                    style={{ width: `${alum.profile_completeness}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-[9px] text-center text-slate-400 mt-1 font-mono font-bold">
                                                {alum.profile_completeness}%
                                            </p>
                                        </td>

                                        {/* 5. Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={route('admin.alumni.edit', alum.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                                    title="Edit Data"
                                                >
                                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(alum.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                                                    title="Hapus Data"
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                                                <i className="fa-solid fa-filter-circle-xmark text-2xl"></i>
                                            </div>
                                            <p className="text-sm font-bold">Data tidak ditemukan</p>
                                            <p className="text-xs mt-1">Coba sesuaikan kata kunci atau filter pencarian.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                    <Pagination links={alumni.links} />
                </div>
            </div>
        </AdminLayout>
    );
}