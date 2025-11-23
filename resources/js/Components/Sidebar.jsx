import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ isOpen, setIsOpen, user }) {
    const { url } = usePage();

    // Helper to check active routes
    const isActive = (route) => url.startsWith(route);

    const NavLink = ({ href, active, icon, children }) => (
        <Link
            href={href}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                active
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 border-r-4 border-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
            <i className={`fa-solid ${icon} w-6 text-lg`}></i>
            <span>{children}</span>
        </Link>
    );

    return (
        <>
            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo / Brand */}
                <div className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                        AlumniAdmin
                    </span>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* User Profile Snippet */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="mt-6 space-y-1">
                    <NavLink href={route('admin.dashboard')} active={url === '/admin/dashboard'} icon="fa-chart-pie">
                        Dashboard
                    </NavLink>
                    
                    <div className="px-6 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Manage
                    </div>
                    
                    <NavLink href={route('admin.alumni.index')} active={isActive('/admin/alumni')} icon="fa-user-graduate">
                        Alumni
                    </NavLink>
                    <NavLink href={route('admin.jobs.index')} active={isActive('/admin/jobs')} icon="fa-briefcase">
                        Jobs
                    </NavLink>
                    <NavLink href={route('admin.events.index')} active={isActive('/admin/events')} icon="fa-calendar-days">
                        Events
                    </NavLink>
                    <NavLink href={route('admin.news.index')} active={isActive('/admin/news')} icon="fa-newspaper">
                        News
                    </NavLink>

                    <div className="px-6 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        System
                    </div>

                    <NavLink href={route('admin.settings')} active={isActive('/admin/settings')} icon="fa-gear">
                        Settings
                    </NavLink>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                        <i className="fa-solid fa-right-from-bracket w-6 text-lg"></i>
                        <span>Logout</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
}