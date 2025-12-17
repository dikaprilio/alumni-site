import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    // Ensure links is an array before proceeding
    const linksArray = Array.isArray(links) ? links : [];

    // Jika hanya 1 halaman (tidak ada link navigasi yang berarti), jangan render apa-apa
    if (!linksArray.length || linksArray.length <= 3) return null;

    return (
        <div className="mt-12 flex flex-wrap justify-center gap-2">
            {linksArray.map((link, key) => {
                // LOGIKA PEMBERSIHAN LABEL
                // Mengganti teks "&laquo; Previous" jadi Icon Chevron
                let label = link.label;
                let isIcon = false;

                if (label.includes('Previous') || label.includes('&laquo;')) {
                    label = <i className="fa-solid fa-chevron-left"></i>;
                    isIcon = true;
                } else if (label.includes('Next') || label.includes('&raquo;')) {
                    label = <i className="fa-solid fa-chevron-right"></i>;
                    isIcon = true;
                } else {
                    // Untuk angka halaman, kita perlu decode HTML entities jika ada
                    // tapi biasanya React aman merender string angka langsung.
                    // Kita gunakan dangerouslySetInnerHTML hanya jika benar-benar perlu (misal ada formatting lain), 
                    // tapi untuk angka "1", "2" string biasa lebih aman.
                    // Namun Laravel defaultnya kirim string bersih untuk angka.
                }

                // Render Link Aktif/Non-aktif
                return link.url ? (
                    <Link
                        key={key}
                        href={link.url}
                        preserveScroll // Penting agar saat ganti page tidak scroll ke paling atas
                        className={`
                            h-10 w-10 flex items-center justify-center border text-xs font-bold transition-all duration-200
                            ${link.active
                                ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-600/20'
                                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
                            }
                            ${isIcon ? 'text-[10px]' : ''} 
                        `}
                    >
                        {/* Jika label adalah objek React (icon), render langsung. Jika string html, render sebagai html */}
                        {isIcon ? label : <span dangerouslySetInnerHTML={{ __html: link.label }}></span>}
                    </Link>
                ) : (
                    <span
                        key={key}
                        className="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 text-xs font-bold cursor-not-allowed opacity-50"
                    >
                        {isIcon ? label : <span dangerouslySetInnerHTML={{ __html: link.label }}></span>}
                    </span>
                );
            })}
        </div>
    );
}