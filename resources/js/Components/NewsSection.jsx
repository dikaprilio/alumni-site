import React from 'react';
import { Link } from '@inertiajs/react';

export default function NewsSection({ latestUpdates = [] }) {
    // Fallback Dummy Data (Campuran News & Event)
    const dummyData = [
        { id: 1, type: 'NEWS', title: "Revolusi AI: Peluang Lulusan TPL", category: "TECH", date: "2025-10-20", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800" },
        { id: 2, type: 'EVENT', title: "Annual Alumni Gala Dinner", category: "GATHERING", date: "2025-11-15", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800" },
        { id: 3, type: 'NEWS', title: "Kerjasama Strategis Google x TPL", category: "PARTNERSHIP", date: "2025-10-05", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800" },
        { id: 4, type: 'EVENT', title: "Workshop: Cloud Architecture 101", category: "WORKSHOP", date: "2025-10-02", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800" },
        { id: 5, type: 'NEWS', title: "Prestasi Mahasiswa di Hackathon Nasional", category: "ACHIEVEMENT", date: "2025-09-28", image: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=800" },
        { id: 6, type: 'EVENT', title: "Job Fair 2025: Meet Your Future Employer", category: "CAREER", date: "2025-09-20", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800" },
    ];

    const items = latestUpdates.length > 0 ? latestUpdates : dummyData;

    return (
        <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500 font-sans">
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
            <div className="absolute -right-20 top-40 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <span className="text-brand-600 dark:text-brand-400 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                            /// WHAT'S HAPPENING
                        </span>
                        <h2 className="mt-3 text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                            BERITA & <br />
                            <span className="text-brand-600 dark:text-brand-400">AGENDA KEGIATAN</span>
                        </h2>
                    </div>
                    
                    <div className="hidden md:block">
                        <ViewAllButton />
                    </div>
                </div>

                {/* --- ASYMMETRICAL MOSAIC GRID --- */}
                {/* Grid Configuration: 
                    - Mobile: 1 kolom
                    - Tablet: 2 kolom
                    - Desktop: 4 kolom (agar bisa mainin col-span) 
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[300px]">
                    
                    {items.map((item, index) => {
                        // LOGIKA ASIMETRIS (Pola Grid)
                        // Item 0 (Pertama): Besar (2x2)
                        // Item 1 (Kedua): Tinggi (1x2)
                        // Item 2 & 3: Biasa (1x1)
                        // Item 4: Lebar (2x1) - Optional, kita buat variasi
                        
                        let gridClass = "";
                        
                        if (index === 0) gridClass = "lg:col-span-2 lg:row-span-2"; // Big Box
                        else if (index === 1) gridClass = "lg:col-span-1 lg:row-span-2"; // Tall Box
                        else if (index === 4) gridClass = "lg:col-span-2 lg:row-span-1"; // Wide Box
                        else gridClass = "lg:col-span-1 lg:row-span-1"; // Standard Box

                        return (
                            <MosaicCard 
                                key={item.id} 
                                item={item} 
                                className={gridClass} 
                            />
                        );
                    })}

                </div>

                {/* Mobile View More */}
                <div className="mt-8 md:hidden flex justify-center">
                    <ViewAllButton />
                </div>

            </div>
        </section>
    );
}

// --- COMPONENT KARTU MOSAIC ---
function MosaicCard({ item, className }) {
    // Helper Date
    const dateObj = new Date(item.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();

    // Label Warna (Beda antara News & Event)
    const isEvent = item.type === 'EVENT';
    const typeColor = isEvent ? 'bg-purple-600' : 'bg-brand-600';

    return (
        <Link 
            href={isEvent ? `/events/${item.id}` : `/news/${item.id}`}
            className={`
                group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500
                hover:shadow-2xl hover:shadow-brand-900/20 hover:-translate-y-1
                ${className}
            `}
        >
            {/* 1. BACKGROUND IMAGE */}
            <div className="absolute inset-0 bg-slate-800">
                <img 
                    src={item.image ? `/storage/${item.image}` : item.fallbackImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800"} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-60"
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800"}
                />
            </div>

            {/* 2. GRADIENT OVERLAY (Agar teks terbaca) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90"></div>

            {/* 3. CONTENT WRAPPER */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-start">
                
                {/* Badge Type (Top Left) */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 flex gap-2">
                    <span className={`inline-block px-3 py-1 ${typeColor} text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg`}>
                        {item.type}
                    </span>
                    {item.category && (
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {item.category}
                        </span>
                    )}
                </div>

                {/* Date Badge (Top Right for Big Cards, or Inline) */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 flex flex-col items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white group-hover:bg-white group-hover:text-slate-900 transition-colors duration-300">
                    <span className="text-sm font-black leading-none">{day}</span>
                    <span className="text-[8px] font-bold uppercase leading-none mt-0.5">{month}</span>
                </div>

                {/* Title & Arrow */}
                <div className="w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className={`font-bold text-white leading-tight mb-4 group-hover:text-brand-200 transition-colors ${className.includes('col-span-2') ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                        {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                        <span className="text-xs font-mono text-brand-400 uppercase tracking-wider">Baca Selengkapnya</span>
                        <i className="fa-solid fa-arrow-right text-brand-400 text-xs animate-pulse"></i>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// --- BUTTON HELPER ---
function ViewAllButton() {
    return (
        <Link 
            href="/news"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300 shadow-sm"
        >
            <span>Arsip Berita</span>
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-white/20 dark:group-hover:bg-black/10 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
            </span>
        </Link>
    );
}