import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function Dashboard({ auth, alumni, completeness, badges }) {
    const [showSkillModal, setShowSkillModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);

    // --- RENDER HELPERS ---
    
    // Render Badges
    const renderBadges = () => {
        if (!badges || badges.length === 0) return <span className="text-slate-400 text-xs italic">Belum ada badge</span>;
        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
                        <i className="fa-solid fa-medal mr-1.5"></i> {badge}
                    </span>
                ))}
            </div>
        );
    };

    // Render Progress Bar
    const renderProgressBar = () => {
        let color = 'bg-red-500';
        if (completeness >= 50) color = 'bg-yellow-500';
        if (completeness >= 80) color = 'bg-brand-500';
        if (completeness === 100) color = 'bg-green-500';

        return (
            <div className="mt-4">
                <div className="flex justify-between text-sm font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Kelengkapan Profil</span>
                    <span className="text-brand-600 dark:text-brand-400">{completeness}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} 
                        style={{ width: `${completeness}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2 dark:text-slate-400">
                    {completeness < 100 ? "Lengkapi data diri, skill, dan riwayat kerja untuk mencapai 100%!" : "Profil Anda sempurna! Anda siap dilirik perusahaan."}
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-10">
            <Head title="Dashboard Alumni" />
            <Header />

            <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in-up">
                
                {/* --- WELCOME SECTION --- */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        Halo, {alumni.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Selamat datang di dashboard alumni.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: PROFILE CARD --- */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Main Profile Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-600 to-brand-400"></div>
                            
                            <div className="relative mt-12 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 shadow-lg">
                                    {/* Placeholder Avatar */}
                                    {alumni.name.substring(0, 2).toUpperCase()}
                                </div>
                                
                                <h2 className="mt-3 text-xl font-bold text-slate-800 dark:text-white">{alumni.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{alumni.nim}</p>
                                
                                {renderBadges()}
                                
                                <div className="w-full mt-6 border-t border-slate-100 dark:border-slate-700 pt-4 text-left">
                                    <div className="flex items-center gap-3 mb-3 text-sm text-slate-600 dark:text-slate-300">
                                        <i className="fa-solid fa-briefcase w-5 text-center text-brand-500"></i>
                                        <span className="truncate">{alumni.current_job || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-3 text-sm text-slate-600 dark:text-slate-300">
                                        <i className="fa-solid fa-building w-5 text-center text-brand-500"></i>
                                        <span className="truncate">{alumni.company_name || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-3 text-sm text-slate-600 dark:text-slate-300">
                                        <i className={`fa-solid fa-envelope w-5 text-center ${alumni.private_email ? 'text-yellow-500' : 'text-brand-500'}`}></i>
                                        <span className="truncate flex-1">{auth.user.email}</span>
                                        {alumni.private_email && <i className="fa-solid fa-lock text-xs text-yellow-500" title="Privat"></i>}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <i className={`fa-solid fa-phone w-5 text-center ${alumni.private_phone ? 'text-yellow-500' : 'text-brand-500'}`}></i>
                                        <span className="truncate flex-1">{alumni.phone_number || '-'}</span>
                                        {alumni.private_phone && <i className="fa-solid fa-lock text-xs text-yellow-500" title="Privat"></i>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gamification / Stats Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-trophy text-yellow-500"></i> Level Profil
                            </h3>
                            {renderProgressBar()}
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: DETAILS --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* SKILLS SECTION */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                    <i className="fa-solid fa-code text-brand-600 mr-2"></i> Skill & Keahlian
                                </h3>
                                <button 
                                    onClick={() => alert('Fitur tambah skill via modal akan segera aktif!')} 
                                    className="text-sm bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors font-semibold"
                                >
                                    <i className="fa-solid fa-plus mr-1"></i> Tambah
                                </button>
                            </div>

                            {alumni.skills && alumni.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {alumni.skills.map(skill => (
                                        <span key={skill.id} className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-600">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    <p className="text-slate-500">Belum ada skill ditambahkan.</p>
                                </div>
                            )}
                        </div>

                        {/* JOB HISTORY SECTION */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                    <i className="fa-solid fa-briefcase text-brand-600 mr-2"></i> Riwayat Pekerjaan
                                </h3>
                                <button 
                                     onClick={() => alert('Fitur tambah job via modal akan segera aktif!')} 
                                     className="text-sm bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors font-semibold"
                                >
                                    <i className="fa-solid fa-plus mr-1"></i> Tambah
                                </button>
                            </div>

                            {alumni.job_histories && alumni.job_histories.length > 0 ? (
                                <div className="space-y-6">
                                    {alumni.job_histories.map((job) => (
                                        <div key={job.id} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-brand-400 ring-4 ring-brand-50 dark:ring-brand-900/20"></div>
                                                <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2 group-last:hidden"></div>
                                            </div>
                                            <div className="pb-6 group-last:pb-0">
                                                <h4 className="text-base font-bold text-slate-800 dark:text-white">{job.position}</h4>
                                                <p className="text-sm font-semibold text-brand-600">{job.company_name}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {job.start_year} - {job.end_year || 'Sekarang'}
                                                </p>
                                                {job.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                                        {job.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    <p className="text-slate-500">Belum ada riwayat pekerjaan.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}