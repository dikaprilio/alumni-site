import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Dashboard({ completeness }) {
    const { auth } = usePage().props;
    const alumni = auth.user.alumni;

    // Handle Toggle Privacy
    const togglePrivacy = (type, currentValue) => {
        router.post('/alumni/privacy', {
            type: type,
            value: !currentValue,
        }, {
            preserveScroll: true,
        });
    };

    // Helper Avatar
    const avatarUrl = alumni?.avatar ? `/storage/${alumni.avatar}` : null;
    const initials = auth.user.name.substring(0, 2).toUpperCase();

    return (
        <>
            <Head title="My Account" />

            <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
                
                {/* CONTAINER */}
                <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                    
                    {/* --- HEADER --- */}
                    <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-600 dark:text-brand-400 block mb-3">
                                /// SYSTEM ACCESS
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                                My <span className="text-slate-400 dark:text-slate-600">Account</span>
                            </h1>
                        </div>
                        
                        {/* Logout Button (Visible & Accessible) */}
                        <button 
                            onClick={() => router.post('/logout')}
                            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                        >
                            Sign Out
                            <i className="fa-solid fa-right-from-bracket transform group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>

                    {/* --- MAIN GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* 1. IDENTITY CARD (Span 8) */}
                        <div className="col-span-1 md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 relative overflow-hidden group">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <i className="fa-solid fa-id-card text-8xl"></i>
                            </div>

                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-black text-slate-300">{initials}</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {auth.user.name}
                                    </h2>
                                    <p className="text-brand-600 dark:text-brand-400 font-mono text-sm mb-1">
                                        {alumni?.current_position || 'Job Title Not Set'}
                                    </p>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider">
                                        {auth.user.email}
                                    </p>
                                </div>

                                {/* Action */}
                                <Link 
                                    href="/alumni/edit" 
                                    className="mt-4 sm:mt-0 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-brand-600 dark:hover:bg-brand-400 hover:text-white transition-all shadow-lg"
                                >
                                    Edit Data
                                </Link>
                            </div>
                        </div>

                        {/* 2. COMPLETENESS STATUS (Span 4) */}
                        <div className="col-span-1 md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase">Profile Health</h3>
                                    <span className="font-mono text-brand-600 font-bold">{completeness}%</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-brand-600 transition-all duration-1000 ease-out" 
                                        style={{ width: `${completeness}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                {completeness === 100 ? (
                                    <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase">
                                        <i className="fa-solid fa-circle-check"></i>
                                        <span>System Ready</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        <span>Incomplete Data</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. PRIVACY SETTINGS (Span 6) */}
                        <div className="col-span-1 md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-6 text-slate-400">
                                <i className="fa-solid fa-shield-halved"></i>
                                <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Privacy Controls</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Toggle Email */}
                                <PrivacyToggle 
                                    label="Hide Email Address" 
                                    desc="Sembunyikan email dari publik di halaman direktori."
                                    checked={alumni?.private_email}
                                    onChange={() => togglePrivacy('email', alumni?.private_email)}
                                />
                                
                                {/* Toggle Phone */}
                                <PrivacyToggle 
                                    label="Hide Phone Number" 
                                    desc="Sembunyikan tombol WhatsApp dari publik."
                                    checked={alumni?.private_phone}
                                    onChange={() => togglePrivacy('phone', alumni?.private_phone)}
                                />
                            </div>
                        </div>

                        {/* 4. QUICK SHORTCUTS (Span 6) */}
                        <div className="col-span-1 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            {/* Preview Button */}
                            <Link 
                                href={`/directory/${alumni?.id}`}
                                className="group flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all"
                            >
                                <i className="fa-solid fa-eye text-2xl text-slate-400 group-hover:text-brand-500 mb-4 transition-colors"></i>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Public Preview</h4>
                                    <p className="text-xs text-slate-500 mt-1">Lihat profil sebagai tamu.</p>
                                </div>
                            </Link>

                            {/* Security Button */}
                            <Link 
                                href="/alumni/settings" // Route bawaan Breeze/Jetstream utk edit password biasanya di /profile
                                className="group flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all"
                            >
                                <i className="fa-solid fa-lock text-2xl text-slate-400 group-hover:text-brand-500 mb-4 transition-colors"></i>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Security</h4>
                                    <p className="text-xs text-slate-500 mt-1">Ganti Password / Email.</p>
                                </div>
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

// --- SUB COMPONENT: TOGGLE SWITCH ---
function PrivacyToggle({ label, desc, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{label}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[250px]">{desc}</p>
            </div>
            
            <button 
                onClick={onChange}
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0
                    ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}
                `}
            >
                <div className={`
                    absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}></div>
            </button>
        </div>
    );
}

// GUNAKAN PUBLIC LAYOUT
Dashboard.layout = page => <PublicLayout children={page} />;