import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import CreateModal from './CreateModal';
import OpportunityCard from '../../Components/OpportunityCard';

function OpportunitiesIndex({ opportunities }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('JOB'); // JOB or MENTORING
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Client-side filtering
    const filteredOpportunities = opportunities.filter(op => {
        const matchesTab = op.type === activeTab;
        const matchesSearch = search === '' || 
            op.title.toLowerCase().includes(search.toLowerCase()) ||
            op.company_name?.toLowerCase().includes(search.toLowerCase()) ||
            op.description.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <>
            <Head title="Opportunities" />

            <div className="pt-32 pb-20">
                
                {/* --- HEADER SECTION --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 mb-12">
                    <div className="border-b border-slate-300 dark:border-slate-700 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-600 dark:text-brand-400 block mb-4">
                                /// CAREER & GROWTH
                            </span>
                            {/* MODIFICATION: Judul kini menggunakan text-4xl di mobile, dan menghilangkan gradien */}
                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                                OPPORTUNITIES <span className="text-slate-400 dark:text-slate-600">&</span> <br/>
                                <span className="text-brand-600 dark:text-brand-400">NETWORK.</span>
                            </h1>
                        </div>

                        {auth.user && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-400 hover:text-white transition-all shadow-lg"
                            >
                                <i className="fa-solid fa-plus mr-2"></i>
                                Post Opportunity
                            </button>
                        )}
                    </div>

                    {/* --- CONTROLS BAR --- */}
                    <div className="flex flex-col md:flex-row gap-6 mt-10">
                        
                        {/* TABS */}
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('JOB')}
                                className={`
                                    h-12 px-6 sm:px-8 text-xs font-bold uppercase tracking-widest transition-all border border-r-0 border-slate-300 dark:border-slate-700
                                    ${activeTab === 'JOB' 
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                <i className="fa-solid fa-briefcase mr-2"></i>
                                JOBS
                            </button>
                            <button
                                onClick={() => setActiveTab('MENTORING')}
                                className={`
                                    h-12 px-6 sm:px-8 text-xs font-bold uppercase tracking-widest transition-all border border-slate-300 dark:border-slate-700
                                    ${activeTab === 'MENTORING' 
                                        ? 'bg-purple-600 text-white border-purple-600' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                <i className="fa-solid fa-handshake-angle mr-2"></i>
                                MENTORSHIP
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
                                placeholder="SEARCH OPPORTUNITIES..."
                                className="w-full h-12 bg-transparent border border-slate-300 dark:border-slate-700 pl-12 pr-4 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all placeholder:text-slate-400 uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32">
                    <div className="border-t border-slate-200 dark:border-slate-800"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-slate-200 dark:border-slate-800">
                        {filteredOpportunities.length > 0 ? (
                            filteredOpportunities.map((op, idx) => (
                                <OpportunityCard key={op.id} opportunity={op} currentUser={auth.user} index={idx} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center border-r border-b border-slate-200 dark:border-slate-800">
                                <div className="inline-flex flex-col items-center opacity-50">
                                    <i className="fa-solid fa-folder-open text-4xl mb-4 text-slate-400"></i>
                                    <p className="font-mono uppercase text-sm text-slate-500">No opportunities found.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}


// Layout
OpportunitiesIndex.layout = page => <PublicLayout children={page} />;
export default OpportunitiesIndex;