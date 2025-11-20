import React from 'react';
import { Link } from '@inertiajs/react';

export default function MobileBottomNav({ activeRoute, onOpenSidebar }) {
    const isActive = (r) => activeRoute === r;

    return (
        <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-white border-t border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-around px-2 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link 
                href={route('alumni.dashboard')} 
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${isActive('alumni.dashboard') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}
            >
                <i className="fa-solid fa-house text-lg"></i>
                <span className="text-[10px] font-bold">Home</span>
            </Link>
            
            <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors">
                <i className="fa-solid fa-briefcase text-lg"></i>
                <span className="text-[10px] font-medium">Karir</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors">
                <i className="fa-solid fa-calendar-days text-lg"></i>
                <span className="text-[10px] font-medium">Event</span>
            </button>

            <button 
                onClick={onOpenSidebar} 
                className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 transition-colors"
            >
                <div className="relative">
                    <i className="fa-solid fa-bars text-lg"></i>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span> 
                </div>
                <span className="text-[10px] font-medium">Menu</span>
            </button>
        </div>
    );
}