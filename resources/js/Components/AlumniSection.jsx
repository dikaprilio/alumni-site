import React, { useState, useMemo } from 'react';

export default function AlumniSection({ alumniList = [] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = [
        { id: 'All', label: 'Semua', icon: 'fa-layer-group' },
        { id: 'Engineering', label: 'Engineering', icon: 'fa-code' },
        { id: 'Creative', label: 'Creative', icon: 'fa-pen-nib' },
        { id: 'Data', label: 'Data & AI', icon: 'fa-chart-network' },
        { id: 'Business', label: 'Business', icon: 'fa-briefcase' },
    ];

    const filteredAlumni = useMemo(() => {
        if (activeFilter === 'All') return alumniList;

        return alumniList.filter(alumni => {
            const job = (alumni.current_job || '').toLowerCase();
            
            if (activeFilter === 'Engineering') 
                return job.includes('developer') || job.includes('engineer') || job.includes('programmer') || job.includes('tech');
            
            if (activeFilter === 'Creative') 
                return job.includes('design') || job.includes('ui') || job.includes('ux') || job.includes('art') || job.includes('writer');
            
            if (activeFilter === 'Data') 
                return job.includes('data') || job.includes('analyst') || job.includes('scientist') || job.includes('ai');
            
            if (activeFilter === 'Business') 
                return job.includes('manager') || job.includes('product') || job.includes('marketing') || job.includes('ceo') || job.includes('founder');
            
            return false;
        });
    }, [activeFilter, alumniList]);

    return (
        <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500 font-sans">
            
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
            <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* --- HEADER --- */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-brand-600 dark:text-brand-400 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                        /// ALUMNI NETWORK
                    </span>
                    <h2 className="mt-4 text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Jejak Langkah <span className="text-brand-600 dark:text-brand-400">Para Perintis</span>
                        {/* FIXED: Changed from gradient to solid brand color */}
                    </h2>
                    <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Temukan alumni kami yang kini berkarya di berbagai sektor industri. Bukti nyata kualitas pendidikan vokasi yang siap kerja.
                    </p>
                </div>

                {/* --- FILTER TABS --- */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border
                                ${activeFilter === cat.id 
                                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/25 scale-105' 
                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-600 hover:text-brand-600 dark:hover:text-white'
                                }
                            `}
                        >
                            <i className={`fa-solid ${cat.icon}`}></i>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* --- ALUMNI GRID --- */}
                {filteredAlumni.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredAlumni.map((alumni, index) => (
                            <AlumniCard key={alumni.id} alumni={alumni} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <i className="fa-solid fa-user-astronaut text-4xl text-slate-300 mb-4"></i>
                        <p className="text-slate-500">Belum ada alumni di kategori ini.</p>
                    </div>
                )}

                {/* --- FOOTER ACTION --- */}
                <div className="mt-16 flex justify-center">
                    <a href="/register" className="group flex items-center gap-2 text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white pb-1 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-600 dark:hover:border-brand-400 transition-all">
                        Lihat Semua Alumni
                        <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>

            </div>
        </section>
    );
}

function AlumniCard({ alumni, index }) {
    return (
        <div 
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-2 border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-900 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/5 flex flex-col"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Image Container */}
            <div className="relative h-64 w-full rounded-[1.5rem] overflow-hidden bg-slate-200 dark:bg-slate-800 mb-4">
                {alumni.avatar ? (
                    <img 
                        src={`/storage/${alumni.avatar}`} 
                        alt={alumni.name} 
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                        <span className="text-4xl font-bold text-slate-400/30">{alumni.name.substring(0, 2)}</span>
                    </div>
                )}
                
                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating Company Badge */}
                {alumni.company_name && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 dark:text-white shadow-sm transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <i className="fa-solid fa-building mr-1 text-brand-500"></i> {alumni.company_name}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-3 pb-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
                    {alumni.name}
                </h3>
                <p className="text-sm text-brand-600 dark:text-brand-400 font-medium mb-4 truncate">
                    {alumni.current_job || 'Alumni'}
                </p>

                {/* Skills Tags */}
                <div className="mt-auto flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {alumni.skills && alumni.skills.length > 0 ? (
                        alumni.skills.slice(0, 3).map(skill => (
                            <span key={skill.id} className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                                {skill.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-400 italic">Skill belum ditambahkan</span>
                    )}
                    {alumni.skills && alumni.skills.length > 3 && (
                        <span className="whitespace-nowrap px-2 py-1 text-[10px] text-slate-400">+{alumni.skills.length - 3}</span>
                    )}
                </div>
            </div>
        </div>
    );
}