import React from 'react';
import { Link } from '@inertiajs/react';

export default function NewsGridCard({ item }) {
    const dateObj = new Date(item.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();

    const isEvent = item.type === 'EVENT';
    
    // Link Destination
    const href = isEvent ? `/events/${item.id}` : `/news/${item.id}`;

    return (
        <Link 
            href={href}
            className="group flex flex-col h-full border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:z-10 hover:shadow-2xl dark:hover:shadow-brand-900/10 transition-all duration-300"
        >
            {/* 1. IMAGE CONTAINER */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-900">
                {/* Image */}
                <img 
                    src={item.image ? `/storage/${item.image}` : "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=800"} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=800"}
                />
                
                {/* Date Badge (Industrial Box) */}
                <div className="absolute top-0 left-0 bg-white dark:bg-slate-950 border-r border-b border-slate-200 dark:border-slate-800 p-3 flex flex-col items-center min-w-[60px]">
                    <span className="text-xl font-black leading-none text-slate-900 dark:text-white">{day}</span>
                    <span className="text-[10px] font-bold uppercase text-slate-500">{month}</span>
                </div>

                {/* Type Label */}
                <div className="absolute top-0 right-0 p-3">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white ${isEvent ? 'bg-purple-600' : 'bg-brand-600'}`}>
                        {item.type}
                    </span>
                </div>
            </div>

            {/* 2. CONTENT */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
                {/* Meta Info */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono uppercase text-brand-600 dark:text-brand-400 tracking-widest">
                        /// {item.category}
                    </span>
                    {item.location && (
                         <span className="text-[10px] font-mono uppercase text-slate-400 truncate max-w-[150px]">
                            @ {item.location}
                         </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                    {item.excerpt}
                </p>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        Read Dossier
                    </span>
                    <i className="fa-solid fa-arrow-right text-brand-500 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"></i>
                </div>
            </div>
        </Link>
    );
}