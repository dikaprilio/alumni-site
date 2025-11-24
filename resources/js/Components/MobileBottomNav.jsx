import React from 'react';
import { Link } from '@inertiajs/react';

export default function MobileBottomNav({ activeRoute, onOpenSidebar }) {
    const isActive = (r) => activeRoute === r;
    const isGroupActive = (prefix) => activeRoute && activeRoute.startsWith(prefix);
    
    // Deteksi apakah sedang di halaman admin
    const isAdmin = activeRoute && activeRoute.startsWith('admin.');

    return (
        <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-white border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-around px-2 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            
            {/* --- ADMIN NAVIGATION --- */}
            {isAdmin ? (
                <>
                    {/* Admin: Home / Dashboard */}
                    <Link 
                        href={route('admin.dashboard')} 
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isActive('admin.dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                    >
                        <i className="fa-solid fa-chart-pie text-lg"></i>
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>

                    {/* Admin: Alumni (Menggantikan Jobs/Karir) */}
                    <Link 
                        href={route('admin.alumni.index')} 
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isGroupActive('admin.alumni') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                    >
                        <i className="fa-solid fa-user-graduate text-lg"></i>
                        <span className="text-[10px] font-medium">Alumni</span>
                    </Link>

                    {/* Admin: News (Manajemen Konten) */}
                    <Link 
                        href={route('admin.news.index')} 
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isGroupActive('admin.news') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                    >
                        <i className="fa-solid fa-newspaper text-lg"></i>
                        <span className="text-[10px] font-medium">News</span>
                    </Link>
                </>
            ) : (
                /* --- USER/ALUMNI NAVIGATION (Existing) --- */
                <>
                    <Link 
                        href={route('alumni.dashboard')} 
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isActive('alumni.dashboard') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                    >
                        <i className="fa-solid fa-house text-lg"></i>
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                    
                    {/* User: Karir/Opportunities (Linked correctly) */}
                    <Link 
                        href={route('opportunities.index')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isActive('opportunities.index') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
                    >
                        <i className="fa-solid fa-briefcase text-lg"></i>
                        <span className="text-[10px] font-medium">Karir</span>
                    </Link>
                    
                    {/* User: Event (Placeholder/Button) */}
                    <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors">
                        <i className="fa-solid fa-calendar-days text-lg"></i>
                        <span className="text-[10px] font-medium">Event</span>
                    </button>
                </>
            )}

            {/* --- GLOBAL: MENU (Sidebar Toggle) --- */}
            <button 
                onClick={onOpenSidebar} 
                className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors"
            >
                <div className="relative">
                    <i className="fa-solid fa-bars text-lg"></i>
                    {/* Dot notifikasi opsional bisa ditaruh di sini */}
                </div>
                <span className="text-[10px] font-medium">Menu</span>
            </button>
        </div>
    );
}