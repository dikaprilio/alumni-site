import React from 'react';
import { Link } from '@inertiajs/react';

export default function NewsSection({ latestUpdates = [] }) {
    // Fallback Data
    const dummyData = [
        { id: 1, type: 'NEWS', title: "Revolusi AI: Peluang Lulusan TPL di Era Generative Pre-trained Transformer", category: "TECH", date: "2025-10-20", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800" },
        { id: 2, type: 'EVENT', title: "Annual Alumni Gala: Networking Night", category: "GATHERING", date: "2025-11-15", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800" },
        { id: 3, type: 'NEWS', title: "Google x TPL Partnership", category: "COLLAB", date: "2025-10-05", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800" },
        { id: 4, type: 'EVENT', title: "Cloud Architecture Workshop", category: "WORKSHOP", date: "2025-10-02", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800" },
        { id: 5, type: 'NEWS', title: "Hackathon Nasional 2025 Winners", category: "ACHIEVEMENT", date: "2025-09-28", image: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=800" },
        { id: 6, type: 'EVENT', title: "Mega Job Fair 2025", category: "CAREER", date: "2025-09-20", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800" },
    ];

    const items = latestUpdates.length > 0 ? latestUpdates : dummyData;
    const displayItems = items.slice(0, 6);

    return (
        <section className="relative py-16 md:py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans border-y border-slate-200 dark:border-slate-800">
            
            {/* CONTAINER RESPONSIVE: px-4 (HP) -> px-6 -> px-20 -> px-32 (Desktop) */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-20 lg:px-32 relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-4 border-slate-900 dark:border-white pb-4 md:pb-6">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                            News<span className="text-brand-600">/</span>Update
                        </h2>
                    </div>
                    <div>
                        <Link href="/news" className="text-xs md:text-sm font-bold uppercase tracking-widest hover:text-brand-600 transition-colors flex items-center gap-2 group">
                            See All Archive
                            <i className="fa-solid fa-arrow-right transform group-hover:-rotate-45 transition-transform duration-300"></i>
                        </Link>
                    </div>
                </div>

                {/* --- THE GRID (Responsive Layout) --- */}
                <div className="border-t border-l border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12">
                    
                    {/* 1. HERO ITEM */}
                    {/* Mobile: Full Width, Height 300px. Desktop: 7/12 Width, Height 500px */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-7 border-r border-b border-slate-200 dark:border-slate-800 min-h-[300px] md:min-h-[500px] relative group overflow-hidden">
                        <NewsCard item={displayItems[0]} size="hero" />
                    </div>

                    {/* 2. SIDE STACK */}
                    {/* Mobile: Stacked. Tablet: Side-by-side. Desktop: Stacked Vertical */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col md:flex-row lg:flex-col">
                        {/* Item 1 */}
                        <div className="flex-1 border-r border-b border-slate-200 dark:border-slate-800 min-h-[220px] md:min-h-[250px] relative group overflow-hidden">
                            <NewsCard item={displayItems[1]} size="compact" />
                        </div>
                        {/* Item 2 */}
                        <div className="flex-1 border-r border-b border-slate-200 dark:border-slate-800 min-h-[220px] md:min-h-[250px] relative group overflow-hidden">
                            <NewsCard item={displayItems[2]} size="compact" />
                        </div>
                    </div>

                    {/* 3. BOTTOM STRIP */}
                    {/* Mobile: Stacked. Tablet/Desktop: 3 Columns */}
                    {displayItems.slice(3, 6).map((item) => (
                        <div key={item.id} className="col-span-1 md:col-span-4 border-r border-b border-slate-200 dark:border-slate-800 min-h-[250px] md:min-h-[350px] relative group overflow-hidden">
                            <NewsCard item={item} size="standard" />
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}

// --- SUB-COMPONENT: NEWS CARD (Responsive Text & Padding) ---
function NewsCard({ item, size }) {
    if (!item) return null;
    const isEvent = item.type === 'EVENT';
    const dateObj = new Date(item.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();

    return (
        <Link href={isEvent ? `/events/${item.id}` : `/news/${item.id}`} className="block w-full h-full relative">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900 overflow-hidden">
                <img 
                    src={item.image || "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=800"} 
                    alt={item.title} 
                    className={`
                        w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 grayscale group-hover:grayscale-0
                        ${size === 'compact' ? 'opacity-40 group-hover:opacity-30' : 'opacity-100'}
                    `}
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=800"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            </div>

            {/* Responsive Padding: p-5 (Mobile) -> p-8 (Desktop) */}
            <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <span className={`
                        px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white border border-white/30 bg-black/20 backdrop-blur-sm
                        group-hover:bg-brand-600 group-hover:border-brand-600 transition-colors
                    `}>
                        {item.category || item.type}
                    </span>
                    <div className="text-right text-white">
                        <span className="block text-xl md:text-2xl font-black leading-none">{day}</span>
                        <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{month}</span>
                    </div>
                </div>

                <div className={`${size === 'hero' ? 'max-w-3xl' : ''}`}>
                    {/* Responsive Font Sizes */}
                    <h3 className={`
                        font-bold text-white leading-none mb-3 md:mb-4 group-hover:text-brand-400 transition-colors
                        ${size === 'hero' ? 'text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tighter' : ''}
                        ${size === 'standard' ? 'text-xl sm:text-2xl md:text-3xl tracking-tight' : ''}
                        ${size === 'compact' ? 'text-lg sm:text-xl md:text-2xl tracking-tight' : ''}
                    `}>
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-px bg-white/50 w-6 md:w-8 group-hover:w-12 md:group-hover:w-16 transition-all duration-500"></div>
                        <span className="text-[10px] md:text-xs font-mono text-white/70 uppercase tracking-wider group-hover:text-white transition-colors">
                            Read Article
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}