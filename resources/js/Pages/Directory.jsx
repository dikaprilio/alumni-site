import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import AlumniIDCard from '../Components/AlumniIDCard';
import Pagination from '../Components/Pagination';

function Directory({ alumni, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'All');
    const isFirstRender = useRef(true);

    // Handle Search & Filter Update
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            const query = {};
            if (search) query.search = search;
            if (category && category !== 'All') query.category = category;

            router.get('/directory', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [search, category]);

    // --- KATEGORI BARU ---
    const categories = [
        { id: 'All', label: 'SEMUA' },
        { id: 'Engineering', label: 'ENGINEERING & TECH' },
        { id: 'Data & AI', label: 'DATA & AI' },
        { id: 'Product', label: 'PRODUCT MGMT' },
        { id: 'Creative', label: 'DESIGN & CREATIVE' },
        { id: 'Marketing', label: 'MARKETING & GROWTH' },
        { id: 'Business', label: 'BUSINESS & STRATEGY' },
        { id: 'Operations', label: 'OPS & FINANCE' },
    ];

    return (
        <>
            <Head title="Alumni Directory" />
            
            <div className="pt-32 pb-20">
                
                {/* --- HEADER SECTION --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 mb-12">
                    <div className="border-b border-slate-300 dark:border-slate-700 pb-8">
                        <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-600 dark:text-brand-400 block mb-4">
                            /// DATABASE ACCESS
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                            Alumni <span className="text-slate-400 dark:text-slate-600">Directory</span>
                        </h1>
                    </div>

                    {/* --- CONTROLS BAR --- */}
                    <div className="flex flex-col gap-6 mt-8">
                        
                        {/* 1. SCROLLABLE TABS (Industrial Look) */}
                        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex min-w-max border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`
                                            px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all border-r border-slate-300 dark:border-slate-700 last:border-r-0
                                            ${category === cat.id 
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                            }
                                        `}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. SEARCH INPUT */}
                        <div className="relative group w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <i className="fa-solid fa-magnifying-glass text-slate-400 group-focus-within:text-brand-600 transition-colors"></i>
                            </div>
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="SEARCH BY NAME, ROLE, COMPANY, OR SKILL..." 
                                className="w-full bg-transparent border-b-2 border-slate-300 dark:border-slate-700 py-4 pl-12 pr-4 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-600 transition-colors placeholder:text-slate-400 uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* --- GRID CONTENT --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-200 dark:border-slate-800">
                        {alumni.data.length > 0 ? (
                            alumni.data.map((alum, idx) => (
                                <AlumniIDCard key={alum.id} alumni={alum} index={idx} />
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 py-32 text-center border-r border-b border-slate-200 dark:border-slate-800">
                                <div className="inline-flex flex-col items-center opacity-50">
                                    <i className="fa-solid fa-database text-4xl mb-4 text-slate-400"></i>
                                    <p className="font-mono uppercase text-sm text-slate-500">
                                        No Records Found in "{category}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION --- */}
                    <Pagination links={alumni.links} />
                </div>
            </div>
        </>
    );
}

Directory.layout = page => <PublicLayout children={page} />;
export default Directory;