import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const { auth } = props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    // Ref untuk dropdown profil
    const profileRef = useRef(null);

    // Close dropdown profile if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    // State untuk Dark Mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Helper untuk cek aktif
    const isActive = (path) => url.startsWith(path);

    // --- COMPONENT: NAV ITEM (Desktop Sidebar) ---
    const SidebarItem = ({ href, icon, label }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    active 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}>
                    <i className={`fa-solid ${icon} text-sm`}></i>
                </div>
                <span className="font-medium text-sm">{label}</span>
            </Link>
        );
    };

    // --- COMPONENT: MOBILE NAV ITEM (Bottom Bar) ---
    const MobileNavItem = ({ href, icon, label }) => {
        const active = isActive(href);
        return (
            <Link 
                href={href} 
                className={`flex flex-col items-center justify-center w-full h-full py-1 space-y-0.5 ${
                    active 
                        ? 'text-brand-600 dark:text-brand-400' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
            >
                <i className={`fa-solid ${icon} text-xl mb-0.5 transition-transform duration-200 ${active ? 'scale-110' : ''}`}></i>
                <span className={`text-[10px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>
                    {label}
                </span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans flex flex-col lg:flex-row transition-colors duration-300 pb-24 lg:pb-0">
            
            {/* --- SIDEBAR (DESKTOP ONLY) --- */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col fixed inset-y-0 z-50 transition-colors duration-300">
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                        <i className="fa-solid fa-shield-cat text-white"></i>
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-tight uppercase text-slate-900 dark:text-white">Admin<span className="text-brand-600 dark:text-brand-500">Panel</span></h1>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Alumni CMS v2.0</p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Overview</p>
                    <SidebarItem href="/admin/dashboard" icon="fa-gauge-high" label="Dashboard" />
                    
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Master Data</p>
                    <SidebarItem href="/admin/alumni" icon="fa-users" label="Alumni Directory" />
                    <SidebarItem href="/admin/jobs" icon="fa-briefcase" label="Job Vacancies" />
                    
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Content & Events</p>
                    <SidebarItem href="/admin/news" icon="fa-newspaper" label="News & Updates" />
                    <SidebarItem href="/admin/events" icon="fa-calendar-day" label="Events Agenda" />
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                            <i className="fa-solid fa-user-astronaut"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{auth.user.name}</p>
                            <p className="text-xs text-slate-500 truncate">Administrator</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={toggleTheme}
                            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
                        >
                            {isDarkMode ? <><i className="fa-solid fa-sun text-amber-400"></i> Light</> : <><i className="fa-solid fa-moon text-brand-400"></i> Dark</>}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 py-2 px-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 rounded-lg text-xs font-bold transition-colors"
                        >
                            <i className="fa-solid fa-power-off"></i> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                
                {/* HEADER MOBILE (Top Bar) */}
                <header className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
                    
                    {/* Left: Logo & Theme Toggle */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-brand-500/20 shadow-lg">
                            <i className="fa-solid fa-shield-cat text-white text-xs"></i>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">ADMIN</span>
                    </div>

                    {/* Right: Theme Toggle & Profile Dropdown */}
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {isDarkMode ? <i className="fa-solid fa-sun text-amber-400 text-lg"></i> : <i className="fa-solid fa-moon text-lg"></i>}
                        </button>

                        {/* PROFILE DROPDOWN (MOBILE) */}
                        <div className="relative" ref={profileRef}>
                            <button 
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 overflow-hidden"
                            >
                                <i className="fa-solid fa-user text-sm"></i>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animation-fade-in-up origin-top-right">
                                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{auth.user.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{auth.user.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <Link href={route('alumni.settings')} className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                            <i className="fa-solid fa-cog text-slate-400"></i> Edit Profil
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <i className="fa-solid fa-power-off"></i> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>

                {/* --- BOTTOM NAVIGATION BAR (MOBILE ONLY) --- */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none pb-[env(safe-area-inset-bottom)]">
                    <nav className="flex items-center justify-between h-[72px] px-4 w-full max-w-md mx-auto relative">
                        
                        <MobileNavItem href="/admin/dashboard" icon="fa-gauge-high" label="Home" />
                        <MobileNavItem href="/admin/alumni" icon="fa-users" label="Alumni" />
                        
                        {/* Center Action Button (Add Only) */}
                        <div className="relative -top-6 pointer-events-auto px-2">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-brand-600/40 border-4 border-slate-50 dark:border-slate-950 transition-transform active:scale-95 flex-col gap-0.5 ${isMobileMenuOpen ? 'rotate-45 bg-slate-700 hover:bg-slate-600' : ''}`}
                            >
                                <i className="fa-solid fa-plus text-2xl transition-transform duration-300"></i>
                            </button>
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">
                                Create
                            </div>
                        </div>

                        <MobileNavItem href="/admin/jobs" icon="fa-briefcase" label="Jobs" />
                        <MobileNavItem href="/admin/news" icon="fa-newspaper" label="News" />
                        
                    </nav>
                </div>

                {/* --- MOBILE EXPANDED MENU (Just Quick Actions) --- */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-slate-900/20 dark:bg-slate-900/90 backdrop-blur-sm lg:hidden flex flex-col justify-end pb-32 animate-fade-in">
                        <div className="mx-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 shadow-2xl transform transition-all">
                            
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 px-2">Create New</p>
                            
                            <Link href={route('admin.news.create')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white transition-colors bg-slate-50 dark:bg-slate-700/50">
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                                    <i className="fa-solid fa-pen-nib text-lg"></i>
                                </div>
                                <span className="font-bold text-base">Post News</span>
                            </Link>
                            
                            <Link href={route('admin.jobs.create')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white transition-colors bg-slate-50 dark:bg-slate-700/50">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                                    <i className="fa-solid fa-briefcase text-lg"></i>
                                </div>
                                <span className="font-bold text-base">Add Job</span>
                            </Link>
                            
                            <Link href={route('admin.alumni.create')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white transition-colors bg-slate-50 dark:bg-slate-700/50">
                                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-500 rounded-lg flex items-center justify-center shadow-sm">
                                    <i className="fa-solid fa-user-plus text-lg"></i>
                                </div>
                                <span className="font-bold text-base">Add User</span>
                            </Link>
                            
                            {/* Removed Logout from here since it's now in the top profile menu */}
                        </div>
                        
                        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 -z-10"></button>
                    </div>
                )}

            </div>
        </div>
    );
}