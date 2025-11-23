import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { useToast } from '@/Components/ToastContext';
import { debounce } from 'lodash';

export default function LogsIndex({ auth, logs = { data: [], links: [] }, filters = {} }) {
    const { addToast } = useToast();

    // --- STATE MANAGEMENT ---
    const [params, setParams] = useState({
        search: filters?.search || '',
    });

    const [isSearching, setIsSearching] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Debounce Search
    const debouncedFetch = useCallback(
        debounce((queryParams) => {
            router.get(route('admin.logs.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            });
        }, 500),
        []
    );

    const handleChange = (field, value) => {
        setParams(prev => {
            const newParams = { ...prev, [field]: value };
            setIsSearching(true);
            debouncedFetch(newParams);
            return newParams;
        });
    };

    const handleExport = () => {
        addToast('Mempersiapkan file export...', 'success');
        const currentParams = new URLSearchParams(window.location.search);
        window.location.href = `${route('admin.logs.export')}?${currentParams.toString()}`;
    };

    const logList = logs?.data || [];
    const logLinks = logs?.links || [];

    return (
        <AdminLayout user={auth?.user} header="Activity Logs">
            <Head title="Activity Logs" />

            {/* HEADER */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Activity Logs
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pantau aktivitas pengguna dan admin dalam sistem.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* EXPORT BUTTON */}
                    <button 
                        onClick={handleExport}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2"
                    >
                        <i className="fa-solid fa-file-csv text-green-600 text-base"></i> Export CSV
                    </button>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm space-y-4 transition-all hover:shadow-md">
                <div className="relative group">
                    <i className={`fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-sm transition-colors ${isSearching ? 'text-brand-500' : ''}`}></i>
                    <input
                        type="text"
                        placeholder="Cari User, Action, Description, atau IP..."
                        value={params.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        autoComplete="off"
                        autoCorrect="off"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all focus:scale-[1.005]"
                    />
                    {isSearching && <div className="absolute right-4 top-3.5"><i className="fa-solid fa-circle-notch fa-spin text-brand-500 text-sm"></i></div>}
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                                {/* Mobile Chevron Header */}
                                <th className="pl-4 pr-2 py-4 md:hidden w-8"></th>

                                <th className="px-2 md:px-6 py-4">User</th>
                                <th className="px-2 md:px-6 py-4">Action</th>
                                <th className="hidden md:table-cell px-6 py-4">Description</th>
                                <th className="hidden md:table-cell px-6 py-4">IP Address</th>
                                <th className="hidden md:table-cell px-6 py-4">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {logList.length > 0 ? (
                                logList.map((log, index) => (
                                    <React.Fragment key={log.id}>
                                        {/* PRIMARY ROW */}
                                        <tr
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group animate-fade-in-up cursor-pointer md:cursor-default"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                            onClick={() => toggleRow(log.id)}
                                        >
                                            {/* Mobile Chevron Toggle */}
                                            <td className="pl-4 pr-2 py-4 md:hidden align-middle">
                                                <div className={`w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300 ${expandedRows[log.id] ? 'rotate-180 bg-blue-50 text-blue-500' : ''}`}>
                                                    <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                </div>
                                            </td>

                                            <td className="px-2 md:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                                                        {log.user ? log.user.name.charAt(0) : '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                            {log.user ? log.user.name : 'System/Guest'}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 truncate">
                                                            {log.user ? log.user.email : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-2 md:px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {log.action}
                                                </span>
                                            </td>

                                            <td className="hidden md:table-cell px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                                                {log.description}
                                            </td>

                                            <td className="hidden md:table-cell px-6 py-4 text-xs font-mono text-slate-500">
                                                {log.ip_address}
                                            </td>

                                            <td className="hidden md:table-cell px-6 py-4 text-xs text-slate-500">
                                                {new Date(log.created_at).toLocaleString('id-ID')}
                                            </td>
                                        </tr>

                                        {/* EXPANDED ROW (MOBILE DETAIL CARD) */}
                                        {expandedRows[log.id] && (
                                            <tr className="md:hidden bg-slate-50/50 dark:bg-slate-800/30 animate-slide-down">
                                                <td colSpan="3" className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="space-y-3 text-sm">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
                                                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{log.description}</p>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IP Address</p>
                                                                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">{log.ip_address}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</p>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Agent</p>
                                                            <p className="text-[10px] text-slate-500 mt-1 break-all">{log.user_agent}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center animate-fade-in">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                                                <i className="fa-solid fa-clipboard-list text-2xl"></i>
                                            </div>
                                            <p className="text-sm font-bold">Tidak ada log aktivitas ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {logLinks.length > 0 && <div className="border-t border-slate-200 dark:border-slate-800 p-4"><Pagination links={logLinks} /></div>}
            </div>
        </AdminLayout>
    );
}
