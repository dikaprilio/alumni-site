import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout'; // Import Layout

function Detail({ article, type }) {
    const isEvent = type === 'EVENT';
    const dateObj = new Date(isEvent ? article.event_date : article.created_at);
    const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <>
            <Head title={`${article.title} - Warta`} />

            <div className="pt-32 pb-20">
                
                {/* --- NAVIGATION --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 mb-8">
                    <Link href="/news" className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-brand-600 transition-colors">
                        <i className="fa-solid fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
                        Back to Feed
                    </Link>
                </div>

                {/* --- ARTICLE HEADER --- */}
                <div className="max-w-[1000px] mx-auto px-8 md:px-20 lg:px-0 mb-12 text-center">
                    <div className="inline-flex items-center gap-3 mb-6 border border-slate-300 dark:border-slate-700 px-4 py-1 bg-white dark:bg-slate-900">
                        <span className={`w-2 h-2 rounded-full ${isEvent ? 'bg-purple-600' : 'bg-brand-600'}`}></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                            {article.category || type}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm font-mono text-slate-500 uppercase tracking-wider">
                        <span><i className="fa-regular fa-calendar mr-2"></i>{dateStr}</span>
                        {isEvent && article.location && (
                            <span><i className="fa-solid fa-location-dot mr-2"></i>{article.location}</span>
                        )}
                    </div>
                </div>

                {/* --- FEATURED IMAGE --- */}
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 mb-16">
                    <div className="aspect-video w-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200">
                        <img 
                            src={article.image ? `/storage/${article.image}` : "https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=1200"} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* --- CONTENT --- */}
                <div className="max-w-[800px] mx-auto px-8 md:px-20 lg:px-0">
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600 hover:prose-a:text-brand-500">
                        <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                           {article.content || article.description}
                        </div>
                    </article>

                    {/* --- SHARE / FOOTER --- */}
                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                         <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Share this Update</span>
                         <div className="flex gap-4">
                             <button className="w-10 h-10 border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors">
                                 <i className="fa-brands fa-twitter"></i>
                             </button>
                             <button className="w-10 h-10 border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors">
                                 <i className="fa-brands fa-linkedin"></i>
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// PERSISTENT LAYOUT DEFINITION
Detail.layout = page => <PublicLayout children={page} />;

export default Detail;