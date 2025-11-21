import React from 'react';
import { Link } from '@inertiajs/react'; // <--- IMPORT LINK

export default function AlumniIDCard({ alumni, index = 0 }) {
    return (
        <Link // <--- GANTI DIV TERLUAR JADI LINK
            href={`/directory/${alumni.id}`} // <--- Link ke Detail Page
            className="group block relative border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-all duration-300 hover:z-10 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* ... (Isi komponen sama persis seperti sebelumnya) ... */}
            {/* Hover Reveal: Corner Accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-transparent border-r-transparent group-hover:border-r-brand-500 transition-all duration-300"></div>

            {/* 1. HEADER: IMAGE & BADGE */}
            <div className="flex justify-between items-start mb-6">
                <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    {alumni.avatar ? (
                        <img src={`/storage/${alumni.avatar}`} alt={alumni.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xl font-black">
                            {alumni.name.substring(0, 2)}
                        </div>
                    )}
                    {/* Tech Overlay Frame */}
                    <div className="absolute inset-0 border border-slate-900/10 dark:border-white/10 pointer-events-none"></div>
                </div>

                <div className="text-right">
                    {alumni.company_name && (
                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <i className="fa-solid fa-building text-[10px] text-brand-600"></i>
                            <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[80px]">
                                {alumni.company_name}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. INFO BLOCK */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-brand-600 transition-colors">
                    {alumni.name}
                </h3>
                <p className="text-xs font-mono text-slate-500 uppercase mb-4">
                    {alumni.current_job || 'Software Engineer'}
                </p>

                {/* SKILLS: SYSTEM TAGS */}
                <div className="flex flex-wrap gap-1.5">
                    {alumni.skills && alumni.skills.slice(0, 3).map(skill => (
                        <span key={skill.id} className="text-[9px] font-bold uppercase px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 group-hover:border-brand-400 group-hover:text-brand-500 transition-colors">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* 3. HOVER ACTION (BOTTOM BAR) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
    );
}