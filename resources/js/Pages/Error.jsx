import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';

export default function Error({ status }) {
    // Mapping pesan berdasarkan status code
    const title = {
        503: '503: SERVICE UNAVAILABLE',
        500: '500: SERVER ERROR',
        404: '404: PAGE NOT FOUND',
        403: '403: FORBIDDEN',
    }[status] || 'UNKNOWN ERROR';

    const description = {
        503: 'System maintenance in progress. Please check back shortly.',
        500: 'Critical system failure. Our engineers have been notified.',
        404: 'The requested resource could not be located in the system database.',
        403: 'Access denied. You do not have clearance for this area.',
    }[status] || 'An unexpected error occurred.';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
            <Head title={title} />
            
            {/* --- GLITCH TEXT EFFECT --- */}
            <div className="relative mb-8">
                <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter relative z-10">
                    {status}
                </h1>
                {/* Shadow Glitch Layers */}
                <h1 className="text-6xl md:text-9xl font-black text-brand-600 absolute top-0 left-0 -translate-x-1 translate-y-1 opacity-50 animate-pulse z-0">
                    {status}
                </h1>
                <h1 className="text-6xl md:text-9xl font-black text-cyan-600 absolute top-0 left-0 translate-x-1 -translate-y-1 opacity-50 animate-pulse delay-75 z-0">
                    {status}
                </h1>
            </div>

            {/* --- INDUSTRIAL MESSAGE BOX --- */}
            <div className="max-w-xl w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 relative overflow-hidden">
                {/* Striped Warning Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,#F52A91,#F52A91_10px,transparent_10px,transparent_20px)] opacity-50"></div>
                
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-brand-600 font-mono text-xs uppercase tracking-widest">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>System Alert</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase leading-none">
                        {title.split(': ')[1]}
                    </h2>
                    
                    <p className="text-slate-600 dark:text-slate-400 font-mono text-sm leading-relaxed">
                        /// ERROR_LOG: {description} <br/>
                        /// TIMESTAMP: {new Date().toISOString()}
                    </p>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 dark:hover:text-white transition-all"
                    >
                        <i className="fa-solid fa-house"></i>
                        Return to Base
                    </Link>
                </div>
            </div>

        </div>
    );
}

// Gunakan PublicLayout agar Navbar & Footer tetap muncul
Error.layout = page => <PublicLayout children={page} />;