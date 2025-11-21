import React from 'react';
import { Link } from '@inertiajs/react';

export default function CTASection() {
    return (
        <section className="relative w-full py-32 bg-white dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500">
            
            {/* Decoration Lines (Grid Extension) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-8 md:left-20 lg:left-32 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="absolute right-8 md:right-20 lg:right-32 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            {/* CONTAINER: Breathing Room Konsisten */}
            <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 relative z-10">
                
                {/* MAIN WRAPPER: The "Block" */}
                <div className="relative group border-y border-slate-200 dark:border-slate-800 overflow-hidden">
                    
                    {/* 1. HOVER REVEAL BACKGROUND (The "Fill" Effect) */}
                    {/* Awalnya tersembunyi di bawah, saat hover naik ke atas mengisi box */}
                    <div className="absolute inset-0 bg-brand-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"></div>
                    
                    {/* 2. CONTENT GRID */}
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* LEFT: HEADLINE */}
                        <div className="p-12 md:p-16 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 group-hover:border-white/20 transition-colors duration-500">
                            <span className="block font-mono text-xs tracking-[0.3em] uppercase text-brand-600 dark:text-brand-400 group-hover:text-white mb-6 transition-colors">
                                /// FINAL CALL
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white group-hover:text-white transition-colors duration-500">
                                JANGAN HILANG <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-900 dark:from-slate-400 dark:to-white group-hover:text-white group-hover:bg-none transition-all">
                                    DARI RADAR.
                                </span>
                            </h2>
                            <p className="mt-8 text-lg text-slate-600 dark:text-slate-400 group-hover:text-white/90 max-w-md leading-relaxed transition-colors duration-500">
                                Ribuan peluang karier dan koneksi industri lewat begitu saja jika profil Anda tidak aktif. Sinergi ini butuh Anda.
                            </p>
                        </div>

                        {/* RIGHT: ACTION AREA */}
                        <div className="p-12 md:p-16 flex flex-col justify-center items-start lg:items-center relative overflow-hidden">
                            
                            {/* Background Noise (Hanya muncul di kanan saat hover) */}
                            <div className="absolute inset-0 bg-noise opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                <Link 
                                    href="/register" 
                                    className="inline-flex items-center justify-between gap-8 w-full md:w-auto px-8 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 group-hover:bg-white group-hover:text-brand-600 transition-all duration-500 shadow-2xl hover:shadow-white/20 min-w-[280px]"
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Bergabung Sekarang</span>
                                        <span className="text-2xl font-black tracking-tight">AKTIFKAN AKUN</span>
                                    </div>
                                    <i className="fa-solid fa-arrow-right text-2xl transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"></i>
                                </Link>

                                <div className="mt-6 flex items-center gap-4 opacity-60 group-hover:opacity-100 group-hover:text-white transition-all duration-500 delay-100">
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900"></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900"></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white">
                                            +2k
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">Alumni telah bergabung</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}