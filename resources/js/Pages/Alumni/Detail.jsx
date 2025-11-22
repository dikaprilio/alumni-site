import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout'; // Import Layout

function Detail({ alumni }) {
    return (
        <>
            <Head title={`${alumni.name} - Alumni Profile`} />

            {/* CONTAINER UTAMA: Padding Top untuk kompensasi Fixed Navbar */}
            <div className="pt-32 pb-20">

                {/* --- BREADCRUMB & NAVIGATION --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 mb-8">
                    <Link href="/directory" className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-brand-600 transition-colors">
                        <i className="fa-solid fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
                        Back to Directory
                    </Link>
                </div>

                {/* --- PROFILE HEADER (THE DOSSIER HEADER) --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 mb-12">
                    <div className="border-b border-slate-300 dark:border-slate-700 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                    Verified Alumni
                                </span>
                                <span className="font-mono text-xs text-brand-600 dark:text-brand-400 tracking-wider">
                                    ID: {String(alumni.id).padStart(4, '0')}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9] mb-2">
                                {alumni.name}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium">
                                {alumni.current_position} <span className="text-slate-300 dark:text-slate-700 mx-2">/</span> {alumni.company_name}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {alumni.linkedin_url && (
                                <a
                                    href={alumni.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 px-6 flex items-center gap-2 bg-[#0077b5] hover:bg-[#006396] text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    <i className="fa-brands fa-linkedin text-lg"></i>
                                    Connect
                                </a>
                            )}

                            {/* Email Button (Hanya muncul jika data ada/tidak diprivate) */}
                            {alumni.email && (
                                <a
                                    href={`mailto:${alumni.email}`}
                                    className="h-12 w-12 flex items-center justify-center border border-slate-300 dark:border-slate-700 hover:border-brand-600 hover:text-brand-600 text-slate-500 transition-colors"
                                    title="Send Email"
                                >
                                    <i className="fa-solid fa-envelope text-lg"></i>
                                </a>
                            )}

                            {/* WhatsApp Button */}
                            {alumni.phone_number && (
                                <a
                                    href={`https://wa.me/${alumni.phone_number.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 w-12 flex items-center justify-center border border-slate-300 dark:border-slate-700 hover:border-green-600 hover:text-green-600 text-slate-500 transition-colors"
                                    title="Contact via WhatsApp"
                                >
                                    <i className="fa-brands fa-whatsapp text-lg"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- GRID LAYOUT (2 COLUMNS) --- */}
                <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-l border-slate-200 dark:border-slate-800 pl-0 lg:pl-12">

                        {/* LEFT SIDEBAR (Photo & Key Stats) - SPANS 4 */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Photo Frame */}
                            <div className="relative aspect-[4/5] w-full bg-slate-200 dark:bg-slate-800 grayscale group hover:grayscale-0 transition-all duration-500 overflow-hidden border border-slate-300 dark:border-slate-700 p-2">
                                <div className="absolute inset-0 border-[0.5px] border-white/20 z-10 pointer-events-none m-4"></div>
                                {alumni.avatar ? (
                                    <img src={`/storage/${alumni.avatar}`} alt={alumni.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-300 text-6xl font-black">
                                        {alumni.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Info Table */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    /// SYSTEM DATA
                                </h3>
                                <dl className="space-y-4 text-sm">
                                    <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                                        <dt className="text-slate-500 dark:text-slate-400 font-mono uppercase">Graduation</dt>
                                        <dd className="font-bold text-slate-900 dark:text-white">{alumni.graduation_year}</dd>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                                        <dt className="text-slate-500 dark:text-slate-400 font-mono uppercase">Major</dt>
                                        <dd className="font-bold text-slate-900 dark:text-white text-right">{alumni.major || 'Teknik Komputer'}</dd>
                                    </div>
                                    {alumni.address && (
                                        <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-2">
                                            <dt className="text-slate-500 dark:text-slate-400 font-mono uppercase">Base</dt>
                                            <dd className="font-bold text-slate-900 dark:text-white text-right max-w-[60%] truncate">{alumni.address}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Skills Cloud */}
                            <div>
                                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                    /// TECH STACK
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {alumni.skills && alumni.skills.length > 0 ? (
                                        alumni.skills.map(skill => (
                                            <span key={skill.id} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase hover:bg-brand-600 hover:border-brand-600 hover:text-white transition-colors cursor-default">
                                                {skill.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No skill data recorded.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT (Experience & Bio) - SPANS 8 */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* BIO SECTION */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1 h-6 bg-brand-600"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Biography</h2>
                                </div>
                                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {alumni.bio ? (
                                        <p>{alumni.bio}</p>
                                    ) : (
                                        <p className="text-slate-400 italic">User has not provided a biography yet.</p>
                                    )}
                                </div>
                            </section>

                            {/* EXPERIENCE TIMELINE */}
                            <section>
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-1 h-6 bg-brand-600"></div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Career History</h2>
                                </div>

                                <div className="border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
                                    {alumni.job_histories && alumni.job_histories.length > 0 ? (
                                        alumni.job_histories.map((job) => (
                                            <div key={job.id} className="relative pl-8 group">
                                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-300 dark:border-slate-700 group-hover:border-brand-500 transition-colors"></div>

                                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                                                        {job.position}
                                                    </h3>
                                                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2 py-1">
                                                        {new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {job.end_date ? new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'PRESENT'}
                                                    </span>
                                                </div>

                                                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                                    @ {job.company_name}
                                                </div>

                                                {job.description && (
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm max-w-2xl">
                                                        {job.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="pl-8">
                                            <p className="text-slate-400 italic">No career history available.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
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