import React, { useState, useEffect, useRef } from 'react'; // <--- Tambah useRef
import { Head, router } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Pagination from '../../Components/Pagination';
import NewsGridCard from '../../Components/NewsGridCard';

function NewsIndex({ items, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'news'); 
    
    // REF UNTUK MENCEGAH AUTO-UPDATE SAAT MOUNT
    const isFirstRender = useRef(true);

    // Handle Filter Changes
    useEffect(() => {
        // Skip render pertama
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            // Bersihkan query params
            const query = {};
            if (search) query.search = search;
            if (type && type !== 'news') query.type = type; // Default 'news' tidak perlu masuk URL

            router.get('/news', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [search, type]);

    return (
        <>
            <Head title="Warta - News & Events" />

            <div className="pt-32 pb-20">
                
                {/* --- HEADER SECTION --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 mb-12">
                    <div className="border-b border-slate-300 dark:border-slate-700 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-600 dark:text-brand-400 block mb-4">
                                /// INFORMATION FEED
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                                WARTA <span className="text-slate-400 dark:text-slate-600">&</span> <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">AGENDA.</span>
                            </h1>
                        </div>
                        
                        {/* Ticker */}
                        <div className="hidden lg:flex items-center gap-4 font-mono text-xs text-slate-400 uppercase tracking-widest border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-none bg-white dark:bg-slate-900">
                            <span className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></span>
                            System Online
                            <span className="mx-2">|</span>
                            Updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* --- CONTROLS BAR --- */}
                    <div className="flex flex-col md:flex-row gap-6 mt-10">
                        
                        {/* TYPE TABS */}
                        <div className="flex">
                            <button
                                onClick={() => setType('news')}
                                className={`
                                    h-12 px-8 text-xs font-bold uppercase tracking-widest transition-all border border-r-0 border-slate-300 dark:border-slate-700
                                    ${type === 'news' 
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                BERITA
                            </button>
                            <button
                                onClick={() => setType('event')}
                                className={`
                                    h-12 px-8 text-xs font-bold uppercase tracking-widest transition-all border border-slate-300 dark:border-slate-700
                                    ${type === 'event' 
                                        ? 'bg-purple-600 text-white border-purple-600' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                EVENT
                            </button>
                        </div>

                        {/* SEARCH BAR */}
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <i className="fa-solid fa-magnifying-glass text-slate-400 group-focus-within:text-brand-600 transition-colors"></i>
                            </div>
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`SEARCH ${type === 'news' ? 'ARTICLES' : 'AGENDA'}...`}
                                className="w-full h-12 bg-transparent border border-slate-300 dark:border-slate-700 pl-12 pr-4 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all placeholder:text-slate-400 uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32">
                    <div className="border-t border-slate-200 dark:border-slate-800"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-slate-200 dark:border-slate-800">
                        {items.data.length > 0 ? (
                            items.data.map((item) => (
                                <NewsGridCard key={item.id} item={item} />
                            ))
                        ) : (
                            <div className="col-span-3 py-32 text-center border-r border-b border-slate-200 dark:border-slate-800">
                                <div className="inline-flex flex-col items-center opacity-50">
                                    <i className="fa-regular fa-newspaper text-4xl mb-4 text-slate-400"></i>
                                    <p className="font-mono uppercase text-sm text-slate-500">No Updates Found.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION --- */}
                    <Pagination links={items.links} />
                </div>
            </div>
        </>
    );
}

NewsIndex.layout = page => <PublicLayout children={page} />;
export default NewsIndex;