import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useToast } from '../Components/ToastContext';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const { auth, flash } = props;
    const { addToast } = useToast();

    // --- FLASH MESSAGE LISTENER ---
    useEffect(() => {
        if (flash?.success) addToast(flash.success, 'success');
        if (flash?.error) addToast(flash.error, 'error');
        if (flash?.message) addToast(flash.message, 'info');
    }, [flash, addToast]);

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'dark';
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

    const toggleTheme = () => setIsDarkMode(!isDarkMode);
    const handleLogout = () => router.post(route('logout'));
    const isActive = (path) => url.startsWith(path);

    // --- SUBCOMPONENTS ---
    const SidebarItem = ({ href, icon, label }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
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

    const MobileNavItem = ({ href, icon, label }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={`flex flex-col items-center justify-center w-full h-full py-1 space-y-0.5 ${active
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

    // --- DRAGGABLE FLOATING WINDOW (FAB) ---
    const DraggableFloatingNav = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [isDragging, setIsDragging] = useState(false);
        const fabRef = useRef(null);
        const offset = useRef({ x: 0, y: 0 });

        // Initialize Position safely
        useEffect(() => {
            if (typeof window !== 'undefined') {
                setPosition({
                    x: window.innerWidth - 80,
                    y: window.innerHeight - 160
                });
            }
        }, []);

        // --- MOUSE HANDLERS ---
        const handleMouseDown = (e) => {
            if (e.button !== 0) return;
            e.preventDefault();

            setIsDragging(false);
            const rect = fabRef.current.getBoundingClientRect();
            offset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            const onMouseMove = (e) => {
                setIsDragging(true);
                let newX = e.clientX - offset.current.x;
                let newY = e.clientY - offset.current.y;

                const maxX = window.innerWidth - 60;
                const maxY = window.innerHeight - 80;

                if (newX < 0) newX = 0;
                if (newX > maxX) newX = maxX;
                if (newY < 0) newY = 0;
                if (newY > maxY) newY = maxY;

                setPosition({ x: newX, y: newY });
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                setTimeout(() => setIsDragging(false), 50);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        // --- TOUCH HANDLERS ---
        const handleTouchStart = (e) => {
            setIsDragging(false);
            const touch = e.touches[0];
            const rect = fabRef.current.getBoundingClientRect();
            offset.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };

            const onTouchMove = (e) => {
                if (e.cancelable) e.preventDefault();

                setIsDragging(true);
                const touch = e.touches[0];
                let newX = touch.clientX - offset.current.x;
                let newY = touch.clientY - offset.current.y;

                const maxX = window.innerWidth - 60;
                const maxY = window.innerHeight - 80;

                if (newX < 0) newX = 0;
                if (newX > maxX) newX = maxX;
                if (newY < 0) newY = 0;
                if (newY > maxY) newY = maxY;

                setPosition({ x: newX, y: newY });
            };

            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                setTimeout(() => setIsDragging(false), 50);
            };

            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
        };

        const toggleMenu = () => {
            if (!isDragging) {
                setIsOpen(!isOpen);
            }
        };

        if (position.x === 0 && position.y === 0 && typeof window === 'undefined') return null;

        return (
            <div
                ref={fabRef}
                className="fixed z-[9999] select-none"
                style={{
                    left: position.x,
                    top: position.y,
                    touchAction: 'none'
                }}
            >
                {/* FLOATING WINDOW MENU */}
                <div
                    className={`absolute bottom-16 right-0 w-52 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}
                >
                    <div className="p-3 bg-brand-50 dark:bg-brand-900/20 border-b border-brand-100 dark:border-brand-800/30">
                        <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-center">
                            Quick Create
                        </p>
                    </div>
                    <div className="p-2 space-y-1">
                        <Link href={route('admin.news.create')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" onClick={() => setIsOpen(false)}>
                            <div className="w-6 h-6 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
                                <i className="fa-solid fa-pen-nib text-amber-500 text-xs"></i>
                            </div>
                            <span className="text-[11px] font-medium">Tulis Berita</span>
                        </Link>
                        <Link href={route('admin.events.create')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" onClick={() => setIsOpen(false)}>
                            <div className="w-6 h-6 bg-teal-100 dark:bg-teal-500/20 rounded-full flex items-center justify-center">
                                <i className="fa-solid fa-calendar-plus text-teal-500 text-xs"></i>
                            </div>
                            <span className="text-[11px] font-medium">Buat Event</span>
                        </Link>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                        <Link href={route('admin.alumni.create')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors" onClick={() => setIsOpen(false)}>
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                                <i className="fa-solid fa-user-plus text-blue-500 text-xs"></i>
                            </div>
                            <span className="text-[11px] font-medium">Tambah User</span>
                        </Link>
                    </div>
                </div>

                {/* THE FAB BUTTON */}
                <button
                    className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 relative z-20 active:scale-95 cursor-move ${isOpen
                        ? 'bg-slate-800 text-white rotate-45'
                        : 'bg-gradient-to-br from-brand-600 to-brand-700 text-white hover:shadow-brand-500/30'
                        }`}
                    style={{ touchAction: 'none' }}
                    onClick={toggleMenu}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    <i className={`fa-solid fa-plus text-xl transition-all`}></i>

                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans flex flex-col lg:flex-row transition-colors duration-300 pb-24 lg:pb-0">

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col fixed inset-y-0 z-50 transition-colors duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 overflow-hidden">
                        <img src="/images/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-tight uppercase text-slate-900 dark:text-white">Admin<span className="text-brand-600 dark:text-brand-500">Panel</span></h1>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Alumni CMS v2.0</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Overview</p>
                    <SidebarItem href="/admin/dashboard" icon="fa-gauge-high" label="Dashboard" />

                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Master Data</p>
                    <SidebarItem href="/admin/alumni" icon="fa-users" label="Alumni Directory" />
                    <SidebarItem href="/admin/opportunities" icon="fa-bullhorn" label="Posting" />

                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Content & Events</p>
                    <SidebarItem href="/admin/news" icon="fa-newspaper" label="News & Updates" />
                    <SidebarItem href="/admin/events" icon="fa-calendar-day" label="Events Agenda" />

                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">System</p>
                    <SidebarItem href="/admin/logs" icon="fa-list-check" label="Activity Logs" />
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <Link
                        href={route('admin.settings')}
                        className="bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-slate-800 rounded-xl p-3 flex items-center gap-3 transition-colors cursor-pointer group border border-transparent hover:border-brand-200 dark:hover:border-slate-700"
                    >
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
                            <i className="fa-solid fa-user-astronaut"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                <i className="fa-solid fa-gear text-[10px]"></i> Settings
                            </p>
                        </div>
                        <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-brand-400"></i>
                    </Link>

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

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                {/* --- TOP HEADER (MOBILE & DESKTOP) --- */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between lg:justify-end">

                    {/* Mobile Menu Button & Logo (LG Hidden) */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
                            <img src="images/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight">Alumni<span className="text-brand-600">TPL</span></span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isDarkMode ? <i className="fa-solid fa-sun text-amber-400 text-lg"></i> : <i className="fa-solid fa-moon text-lg"></i>}
                        </button>

                        <Link
                            href={route('admin.logs.index')}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isActive('/admin/logs') ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 ring-2 ring-brand-200 dark:ring-brand-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            title="Activity Logs"
                        >
                            <i className="fa-solid fa-list-check text-lg"></i>
                        </Link>

                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700 overflow-hidden"
                            >
                                <i className="fa-solid fa-user text-sm"></i>
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animation-fade-in-up origin-top-right">
                                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{auth.user.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{auth.user.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <Link href={route('admin.settings')} className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                            <i className="fa-solid fa-gear text-slate-400"></i> Settings
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

                {/* MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>

                {/* DRAGGABLE FAB - visible on mobile only, hidden on desktop */}
                <div className="lg:hidden">
                    <DraggableFloatingNav />
                </div>

                {/* MOBILE BOTTOM NAV - 5 BUTTONS */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none pb-[env(safe-area-inset-bottom)]">
                    <nav className="grid grid-cols-5 h-[72px] px-2 w-full relative">
                        <MobileNavItem href="/admin/dashboard" icon="fa-gauge-high" label="Home" />
                        <MobileNavItem href="/admin/alumni" icon="fa-users" label="Alumni" />
                        <MobileNavItem href="/admin/opportunities" icon="fa-bullhorn" label="Posting" />
                        <MobileNavItem href="/admin/events" icon="fa-calendar-day" label="Events" />
                        <MobileNavItem href="/admin/news" icon="fa-newspaper" label="News" />
                    </nav>
                </div>

            </div>
        </div>
    );
}