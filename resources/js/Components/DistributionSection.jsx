import React, { useState, useEffect } from 'react';

export default function DistributionSection({ jobStats = [], totalAlumni = 0 }) {
    const data = jobStats.length > 0 ? jobStats : [
        { current_job: "Software Engineer", total: 120 },
        { current_job: "Data Analyst", total: 85 },
        { current_job: "Product Manager", total: 60 },
        { current_job: "UI/UX Designer", total: 45 },
        { current_job: "IT Consultant", total: 30 },
    ];

    const maxVal = Math.max(...data.map(d => d.total));

    return (
        <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200/40 dark:bg-brand-900/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500"></div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-brand-600 dark:text-brand-400 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                            /// LIVE DATA TRACKING
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter transition-colors duration-500">
                            SEBARAN <span className="text-brand-600 dark:text-brand-400">KARIR ALUMNI</span>
                            {/* FIXED: Removed Gradient Text */}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl text-lg transition-colors duration-500">
                            Lihat bagaimana lulusan kami mendominasi berbagai sektor industri teknologi strategis.
                        </p>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Alumni Terdaftar</p>
                        <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">
                            {totalAlumni > 0 ? totalAlumni : "2,500+"}
                        </p>
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* LEFT: RADAR MAP */}
                    <div className="lg:col-span-7 relative min-h-[400px] md:min-h-[500px] bg-white/60 dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-white/10 backdrop-blur-xl overflow-hidden flex items-center justify-center shadow-xl dark:shadow-none transition-all duration-500">
                        
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
                            alt="World Map" 
                            className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 mix-blend-multiply dark:mix-blend-overlay grayscale"
                        />
                        
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')] opacity-10 dark:opacity-20"></div>

                        <RadarDot top="60%" left="75%" delay="0s" />
                        <RadarDot top="55%" left="72%" delay="1s" />
                        <RadarDot top="40%" left="85%" delay="2.5s" />
                        <RadarDot top="80%" left="90%" delay="1.5s" />
                        <RadarDot top="30%" left="48%" delay="0.5s" />
                        <RadarDot top="35%" left="15%" delay="3s" />

                        <div className="absolute w-full h-full animate-scan-radar bg-gradient-to-b from-transparent via-brand-500/5 to-transparent pointer-events-none"></div>

                        <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                <span className="text-xs font-mono text-green-400 font-bold">NETWORK: ONLINE</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: STATISTICS */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {data.map((item, index) => (
                            <StatRow 
                                key={index} 
                                label={item.current_job} 
                                value={item.total} 
                                max={maxVal} 
                                index={index}
                            />
                        ))}

                        <div className="mt-8 p-6 bg-brand-50 dark:bg-brand-900/10 border-l-4 border-brand-500 rounded-r-xl transition-colors duration-500">
                            <h4 className="text-slate-800 dark:text-white font-bold text-lg mb-2">Dominasi Sektor Teknologi</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Data menunjukkan mayoritas alumni bekerja di sektor <span className="text-brand-600 dark:text-brand-400 font-bold">Software Engineering</span> dan <span className="text-purple-600 dark:text-purple-400 font-bold">Data Science</span>, membuktikan relevansi kurikulum.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// --- SUB-COMPONENTS ---

function RadarDot({ top, left, delay }) {
    return (
        <div className="absolute group cursor-pointer" style={{ top, left }}>
            <div className="relative flex items-center justify-center">
                <div className="absolute w-4 h-4 bg-brand-500 rounded-full opacity-75 animate-ping" style={{ animationDelay: delay }}></div>
                <div className="relative w-2 h-2 bg-brand-600 dark:bg-white rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 shadow-lg z-20">
                    Alumni Found
                </div>
            </div>
        </div>
    );
}

function StatRow({ label, value, max, index }) {
    const [width, setWidth] = useState(0);
    const percentage = Math.round((value / max) * 100);

    useEffect(() => {
        setTimeout(() => {
            setWidth(percentage);
        }, index * 200);
    }, [percentage, index]);

    return (
        <div className="group">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-white group-hover:bg-brand-600 transition-colors duration-300">
                        <i className={`fa-solid ${getIcon(label)} text-xs`}></i>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-bold group-hover:text-brand-600 dark:group-hover:text-white transition-colors">{label}</span>
                </div>
                <span className="text-brand-600 dark:text-brand-400 font-mono font-bold text-sm">{value} Alumni</span>
            </div>
            
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-purple-600 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    );
}

function getIcon(jobTitle) {
    const lower = jobTitle.toLowerCase();
    if (lower.includes('engineer') || lower.includes('developer')) return 'fa-code';
    if (lower.includes('data') || lower.includes('analyst')) return 'fa-chart-pie';
    if (lower.includes('manager') || lower.includes('lead')) return 'fa-briefcase';
    if (lower.includes('design') || lower.includes('ui')) return 'fa-pen-nib';
    return 'fa-user-tie';
}