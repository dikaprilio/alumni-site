import React from 'react';
import { Link, router } from '@inertiajs/react';
import SettingsModal from '@/Components/SettingsModal'; // <--- Tambahkan ini
export default function Sidebar({ auth, isOpen, setIsOpen, onOpenSettings }) {
    const menuItems = [
        { label: 'Dashboard', icon: 'fa-house', route: 'alumni.dashboard', active: true },
        { label: 'Lowongan Kerja', icon: 'fa-briefcase', route: '#', active: false },
        { label: 'Event Alumni', icon: 'fa-calendar-check', route: '#', active: false },
        { label: 'Forum Diskusi', icon: 'fa-comments', route: '#', active: false },
    ];

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            {/* Mobile Overlay (Backdrop) */}
            <div 
                className={`fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700
                transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-between shadow-2xl md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                {/* Header Logo */}
                <div className="h-20 flex items-center px-8 border-b border-slate-50 dark:border-slate-700/50 bg-white dark:bg-slate-800 shrink-0">
                    <div className="flex items-center gap-3 text-brand-600 dark:text-brand-400">
                        <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                            <i className="fa-solid fa-graduation-cap text-sm"></i>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">Alumni<span className="text-brand-600">Portal</span></span>
                    </div>
                    {/* Close Button Mobile */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden ml-auto text-slate-400 hover:text-slate-600">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.route !== '#' ? route(item.route) : '#'}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                item.active 
                                ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200 dark:bg-brand-900/20 dark:text-brand-400 dark:ring-brand-800' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <i className={`fa-solid ${item.icon} w-6 text-center transition-transform group-hover:scale-110 ${item.active ? 'text-brand-600' : 'text-slate-400'}`}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                    <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 border border-slate-100 dark:border-slate-600 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm overflow-hidden">
                                {auth.user.email.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="overflow-hidden min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{auth.user.name || 'User'}</p>
                                <p className="text-xs text-slate-500 truncate" title={auth.user.email}>{auth.user.email}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            {/* Tombol Settings Baru */}
                            <button 
                                onClick={onOpenSettings}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                title="Pengaturan Akun"
                            >
                                <i className="fa-solid fa-gear"></i> Akun
                            </button>

                            {/* Tombol Logout */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-xl hover:bg-red-100 transition-all shadow-sm"
                                title="Keluar"
                            >
                                <i className="fa-solid fa-right-from-bracket"></i> Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}