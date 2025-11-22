import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react'; // Jangan lupa import Link
import AlumniIDCard from './AlumniIDCard'; // Import komponen kartu baru

export default function AlumniSection({ alumniList = [] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = [
        { id: 'All', label: 'SEMUA', icon: 'fa-layer-group' },
        { id: 'Engineering', label: 'ENGINEERING', icon: 'fa-code' },
        { id: 'Creative', label: 'CREATIVE', icon: 'fa-pen-nib' },
        { id: 'Data', label: 'DATA & AI', icon: 'fa-chart-network' },
        { id: 'Business', label: 'BUSINESS', icon: 'fa-briefcase' },
    ];

    const filteredAlumni = useMemo(() => {
        if (activeFilter === 'All') return alumniList;

        return alumniList.filter(alumni => {
            const job = (alumni.current_position || '').toLowerCase();
            if (activeFilter === 'Engineering') return job.includes('developer') || job.includes('engineer') || job.includes('programmer') || job.includes('tech');
            if (activeFilter === 'Creative') return job.includes('design') || job.includes('ui') || job.includes('ux') || job.includes('art') || job.includes('writer');
            if (activeFilter === 'Data') return job.includes('data') || job.includes('analyst') || job.includes('scientist') || job.includes('ai');
            if (activeFilter === 'Business') return job.includes('manager') || job.includes('product') || job.includes('marketing') || job.includes('ceo') || job.includes('founder');
            return false;
        });
    }, [activeFilter, alumniList]);

    return (
        <section className="relative py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500 font-sans border-b border-slate-200 dark:border-slate-800">
            
            {/* DECORATION */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 relative z-10">
                
                {/* HEADER */}
                <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-8 pb-8 border-b border-slate-300 dark:border-slate-700">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 bg-brand-600"></span>
                            <span className="font-mono text-xs tracking-[0.3em] uppercase text-slate-500">Directory</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
                            Jejak<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-400 dark:from-white dark:to-slate-500">
                                Perintis.
                            </span>
                        </h2>
                    </div>
                    
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md text-right leading-relaxed font-medium">
                        Database terverifikasi lulusan kami yang kini memimpin inovasi di berbagai sektor industri global.
                    </p>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-wrap border-l border-t border-slate-300 dark:border-slate-700 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`
                                flex-1 min-w-[120px] px-4 py-4 text-xs font-bold tracking-widest border-r border-b border-slate-300 dark:border-slate-700 uppercase transition-all
                                flex items-center justify-center gap-2
                                ${activeFilter === cat.id 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                                    : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <i className={`fa-solid ${cat.icon} ${activeFilter === cat.id ? 'text-brand-500' : ''}`}></i>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* ALUMNI GRID */}
                {filteredAlumni.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-200 dark:border-slate-800">
                        {filteredAlumni.map((alumni, index) => (
                            <AlumniIDCard key={alumni.id} alumni={alumni} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center opacity-50">
                        <i className="fa-solid fa-folder-open text-4xl mb-4"></i>
                        <p className="font-mono uppercase text-sm">Data Not Found</p>
                    </div>
                )}

                {/* FOOTER LINK (Revisi: Mengarah ke halaman Directory) */}
                <div className="mt-12 text-center">
                    <Link href="/directory" className="inline-block font-mono text-xs border-b border-slate-900 dark:border-white pb-1 hover:text-brand-600 hover:border-brand-600 transition-colors cursor-pointer uppercase tracking-widest">
                        [ Load More Data ]
                    </Link>
                </div>

            </div>
        </section>
    );
}