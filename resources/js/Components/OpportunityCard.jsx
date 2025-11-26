import React from 'react';
import { Link } from '@inertiajs/react';

export default function OpportunityCard({ opportunity, currentUser, index }) {
    if (!opportunity) return null;
    
    const isJob = opportunity.type === 'JOB';

    return (
        <div 
            className="group relative border-r border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 transition-all duration-300 hover:z-10 hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Hover Reveal: Corner Accent */}
            <div className={`absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-transparent border-r-transparent transition-all duration-300 ${isJob ? 'group-hover:border-r-slate-900 dark:group-hover:border-r-white' : 'group-hover:border-r-purple-600'}`}></div>

            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 rounded-full bg-slate-100 dark:bg-slate-800">
                        {opportunity.alumni?.avatar ? (
                            <img src={`/storage/${opportunity.alumni.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                                {opportunity.alumni?.name?.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Posted By</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{opportunity.alumni?.name}</p>
                    </div>
                </div>
                
                {/* TYPE BADGE */}
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${isJob ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                    {opportunity.type}
                </span>
            </div>

            {/* CONTENT */}
            <div className="mb-8 min-h-[120px]">
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-brand-600 transition-colors uppercase">
                    {opportunity.title}
                </h3>
                
                {isJob && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
                        <i className="fa-solid fa-building"></i>
                        {opportunity.company_name}
                        {opportunity.location && <span className="font-normal opacity-50">| {opportunity.location}</span>}
                    </div>
                )}

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 font-mono">
                    {opportunity.description}
                </p>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <a
                    href={(() => {
                        const contact = opportunity.contact_info || '';
                        if (!contact) return '#';
                        if (contact.includes('@')) return `mailto:${contact}`;
                        if (/^(\+62|62|08)/.test(contact)) {
                            const cleanNumber = contact.replace(/\D/g, '');
                            const waNumber = cleanNumber.startsWith('0') ? '62' + cleanNumber.substring(1) : cleanNumber;
                            return `https://wa.me/${waNumber}`;
                        }
                        return contact.startsWith('http') ? contact : `https://${contact}`;
                    })()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-500 transition-colors"
                >
                    Apply Now <i className="fa-solid fa-arrow-right"></i>
                </a>

                {currentUser?.alumni?.id === (opportunity.alumni_id || opportunity.alumni?.id) && (
                    <Link
                        href={route('opportunities.destroy', opportunity.id)}
                        method="delete"
                        as="button"
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Delete
                    </Link>
                )}
            </div>

            {/* Bottom Bar */}
            <div className={`absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isJob ? 'bg-brand-500' : 'bg-purple-500'}`}></div>
        </div>
    );
}