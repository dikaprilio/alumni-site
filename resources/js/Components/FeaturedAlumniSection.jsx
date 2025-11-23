import React from 'react';
import { Link } from '@inertiajs/react';

export default function FeaturedAlumniSection({ alumni }) {
    if (!alumni) return null;

    return (
        <section className="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
            
            {/* --- 1. BACKGROUND PATTERN (Tech/Modern Feel) --- */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                 style={{ 
                     backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                     backgroundSize: '32px 32px' 
                 }}>
            </div>
            
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    {/* --- 2. LEFT CONTENT (Typography Focus) --- */}
                    <div className="lg:col-span-7 order-2 lg:order-1 space-y-10">
                        
                        {/* Header Badge Style Baru */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                                Alumni of the Month
                            </span>
                        </div>

                        {/* Massive Title with Solid Colors */}
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-4">
                                {alumni.name}
                            </h2>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xl md:text-2xl font-medium text-slate-500 dark:text-slate-400">
                                <span className="text-brand-600 font-bold">{alumni.current_position}</span>
                                <span className="hidden md:inline text-slate-300">•</span>
                                <span>{alumni.company_name}</span>
                            </div>
                        </div>

                        {/* Editorial Quote Box */}
                        <div className="relative pl-8 border-l-4 border-brand-500 py-2">
                            <p className="text-xl md:text-2xl italic text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                                "{alumni.featured_reason || alumni.bio || 'Konsistensi adalah kunci kesuksesan. Teruslah belajar dan jangan takut untuk mencoba hal baru di dunia profesional.'}"
                            </p>
                        </div>

                        {/* Technical Details Grid */}
                        <div className="grid grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-800 pt-8">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Angkatan</p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white font-mono">{alumni.graduation_year}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Program Studi</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight max-w-[200px]">{alumni.major}</p>
                            </div>
                        </div>

                        {/* Action Buttons (High Contrast) */}
                        <div className="flex gap-4 pt-2">
                            <Link 
                                href={route('public.alumni.show', alumni.id)} 
                                // MODIFICATION: Changed py-4 to py-3 and text-xs to text-sm
                                className="flex-1 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                            >
                                Profil <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            {alumni.linkedin_url && (
                                <a 
                                    href={alumni.linkedin_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    // MODIFICATION: Changed py-4 to py-3 and added text-sm
                                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fa-brands fa-linkedin text-blue-600 text-xl"></i> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>

                    {/* --- 3. RIGHT CONTENT (Visual Impact) --- */}
                    <div className="lg:col-span-5 order-1 lg:order-2 relative">
                        
                        {/* Abstract Shape Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-500/20 to-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

                        {/* Stacked Card Effect */}
                        <div className="relative z-10">
                            {/* Card Accent (Back) */}
                            <div className="absolute inset-0 bg-slate-900 dark:bg-slate-700 rounded-[2.5rem] rotate-6 transform translate-x-4 translate-y-4 opacity-10 dark:opacity-30"></div>
                            
                            {/* Main Image Frame */}
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[3/4] border-[6px] border-white dark:border-slate-800">
                                {alumni.avatar ? (
                                    <img 
                                        src={`/storage/${alumni.avatar}`} 
                                        alt={alumni.name} 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                        <i className="fa-solid fa-user text-8xl text-slate-300 dark:text-slate-600"></i>
                                    </div>
                                )}
                                
                                {/* Floating Badge Decoration */}
                                <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 pl-6 pt-6 rounded-tl-[2rem]">
                                    <div className="bg-brand-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-2xl">
                                        <i className="fa-solid fa-star animate-spin-slow"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}