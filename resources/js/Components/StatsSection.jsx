import React, { useState, useEffect, useRef } from 'react';

export default function StatsSection() {
    const sectionRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = sectionRef.current.offsetHeight;
            
            const scrollDistance = -rect.top; 
            const maxScroll = sectionHeight - viewportHeight;

            let percent = 0;
            if (scrollDistance > 0) {
                percent = scrollDistance / maxScroll;
            }
            percent = Math.max(0, Math.min(1, percent));
            
            requestAnimationFrame(() => setProgress(percent));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- ANIMATION LOGIC (SCENES) ---
    
    // SCENE 1: HEADLINE
    const getHeadlineStyle = () => {
        if (progress < 0.15) {
            return { opacity: 1, transform: 'scale(1) translateY(0)' };
        } else if (progress < 0.25) {
            const localP = (progress - 0.15) / 0.10;
            return { 
                opacity: 1 - localP, 
                transform: `scale(${1 - (0.2 * localP)}) translateY(-${50 * localP}px)`,
                filter: `blur(${10 * localP}px)`
            };
        }
        return { opacity: 0, pointerEvents: 'none' };
    };

    // SCENE 2: NARRATIVE
    const getNarrativeStyle = () => {
        const start = 0.20;
        const end = 0.45;
        const peak = 0.32;

        if (progress < start || progress > end) return { opacity: 0, pointerEvents: 'none' };

        let opacity = 0;
        let blur = 10;
        let y = 50;

        if (progress < peak) {
            const localP = (progress - start) / (peak - start);
            opacity = localP;
            blur = 10 * (1 - localP);
            y = 50 * (1 - localP);
        } else {
            const localP = (progress - peak) / (end - peak);
            opacity = 1 - localP;
            blur = 10 * localP;
            y = -50 * localP;
        }

        return { opacity, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` };
    };

    // SCENE 3: BIG ACCREDITATION SEAL
    const getSealStyle = () => {
        const start = 0.45;
        const end = 0.60;
        
        if (progress < start) return { opacity: 0, transform: 'scale(0.5)', filter: 'blur(20px)' };
        if (progress > 0.7) return { opacity: 0, pointerEvents: 'none' };

        if (progress <= 0.55) {
            const localP = Math.min(1, (progress - start) / 0.1);
            return {
                opacity: localP,
                transform: `scale(${0.8 + (0.4 * localP)})`,
                filter: `blur(${(1 - localP) * 20}px)`
            };
        } else {
            const localP = (progress - 0.55) / 0.15;
            return {
                opacity: 1 - localP,
                transform: `scale(1.2)`,
                filter: `blur(${localP * 10}px)`
            };
        }
    };

    // SCENE 4: CARDS GRID
    const getGridStyle = () => {
        const start = 0.60;
        if (progress < start) return { opacity: 0, pointerEvents: 'none' };
        return { opacity: 1, pointerEvents: 'auto' };
    };

    const getCardStyle = (index) => {
        const gridStart = 0.60;
        const cardStart = gridStart + (index * 0.03);
        const duration = 0.1;

        if (progress < cardStart) {
            return { 
                opacity: 0, 
                transform: 'translateY(50px) scale(0.9)', // Jarak lebih dekat untuk mobile
                filter: 'blur(10px)' 
            };
        } else if (progress < cardStart + duration) {
            const localP = (progress - cardStart) / duration;
            return { 
                opacity: localP, 
                transform: `translateY(${50 * (1-localP)}px) scale(${0.9 + (0.1*localP)})`,
                filter: `blur(${10 * (1-localP)}px)`
            };
        }
        return { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' };
    };

    return (
        <section ref={sectionRef} className="relative h-[800vh] bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
            
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-16 md:pt-20">
                
                {/* BACKGROUND FX */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 invert dark:invert-0 pointer-events-none transition-all duration-500"></div>
                <div 
                    className="absolute top-1/4 left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none transition-all duration-1000 ease-in-out"
                    style={{ transform: `translate(${progress * -50}px, ${progress * 50}px)` }}
                ></div>
                <div 
                    className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none transition-all duration-1000 ease-in-out"
                    style={{ transform: `translate(${progress * 50}px, ${progress * -50}px)` }}
                ></div>

                {/* SCENE 1: HEADLINE */}
                <div 
                    className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10 will-change-transform"
                    style={getHeadlineStyle()}
                >
                    <p className="text-blue-600 dark:text-blue-400 font-mono text-[10px] md:text-sm tracking-[0.5em] uppercase mb-4 animate-pulse">
                        /// PENDIDIKAN MASA DEPAN
                    </p>
                    <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] drop-shadow-sm dark:drop-shadow-2xl">
                        <span className="block text-slate-900 dark:text-white">AKSELERASI</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-400 dark:from-slate-200 dark:to-slate-600">KARIER</span>
                        <span className="block text-slate-900 dark:text-white">DIGITAL.</span>
                    </h2>
                </div>

                {/* SCENE 2: NARRATIVE */}
                <div 
                    className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20 pointer-events-none"
                    style={getNarrativeStyle()}
                >
                    <h3 className="text-2xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 leading-tight mb-6 max-w-4xl">
                        "Dunia industri tidak mencari mereka yang <span className="text-red-500 decoration-4 underline decoration-wavy underline-offset-4">sekadar menghafal</span>."
                    </h3>
                    <p className="text-sm md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl">
                        Mereka mencari inovator, pemecah masalah, dan praktisi yang siap beradaptasi sejak hari pertama.
                    </p>
                </div>

                {/* SCENE 3: BIG SEAL */}
                <div 
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    style={getSealStyle()}
                >
                    <div className="relative group scale-75 md:scale-100">
                        <div className="absolute inset-0 bg-amber-400/20 dark:bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative w-64 h-64 md:w-80 md:h-80 border-[6px] border-amber-500 dark:border-amber-400 rounded-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-md text-center p-4 shadow-[0_0_60px_-15px_rgba(245,158,11,0.5)]">
                            <i className="fa-solid fa-certificate text-6xl text-amber-500 dark:text-amber-400 mb-4 drop-shadow-lg"></i>
                            <h4 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">UNGGUL</h4>
                            <p className="text-xs font-bold tracking-[0.2em] text-slate-600 dark:text-slate-300 mt-1 uppercase">Akreditasi Nasional</p>
                        </div>
                    </div>
                </div>

                {/* SCENE 4: CARDS GRID (RESPONSIVE 2x3 MOBILE) */}
                <div 
                    className="absolute inset-0 flex items-center justify-center px-4 md:px-6 z-30"
                    style={getGridStyle()}
                >
                    {/* REVISI GRID: grid-cols-2 (Mobile) -> grid-cols-3 (Desktop) */}
                    <div className="w-full max-w-6xl grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        
                        <div style={getCardStyle(0)} className="transition-all">
                            <GlassCard number="A" label="Akreditasi" desc="Predikat UNGGUL." icon="fa-award" color="amber" />
                        </div>

                        <div style={getCardStyle(1)} className="transition-all">
                            <GlassCard number="92%" label="Employability" desc="Kerja < 3 bulan." icon="fa-rocket" color="blue" />
                        </div>

                        <div style={getCardStyle(2)} className="transition-all"> 
                            <GlassCard number="70:30" label="Praktek" desc="Lebih banyak Lab." icon="fa-code" color="purple" />
                        </div>

                        <div style={getCardStyle(3)} className="transition-all">
                            <GlassCard number="50+" label="Mitra" desc="Akses Tech Giants." icon="fa-handshake" color="emerald" />
                        </div>

                        <div style={getCardStyle(4)} className="transition-all">
                            <GlassCard number="4 th" label="Pengalaman" desc="Portfolio Nyata." icon="fa-briefcase" color="indigo" />
                        </div>

                         <div style={getCardStyle(5)} className="transition-all">
                            <GlassCard number="100%" label="Relevan" desc="Kurikulum Update." icon="fa-check-circle" color="rose" />
                        </div>

                    </div>
                </div>

                {/* Scroll Indicator */}
                <div 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
                    style={{ opacity: progress > 0.9 ? 0 : 0.5 }}
                >
                    <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500 dark:to-transparent animate-pulse"></div>
                </div>

            </div>
        </section>
    );
}

// --- COMPONENT KARTU (FINE-TUNED FOR MOBILE) ---
function GlassCard({ number, label, desc, icon, color }) {
    const colors = {
        blue: 'border-sky-200 bg-white/60 shadow-sky-500/10 dark:border-sky-500/30 dark:bg-sky-950/60 dark:shadow-sky-500/10',
        purple: 'border-purple-200 bg-white/60 shadow-purple-500/10 dark:border-purple-500/30 dark:bg-purple-950/60 dark:shadow-purple-500/10',
        emerald: 'border-emerald-200 bg-white/60 shadow-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:shadow-emerald-500/10',
        amber: 'border-amber-200 bg-white/60 shadow-amber-500/10 dark:border-amber-500/30 dark:bg-amber-950/60 dark:shadow-amber-500/10',
        rose: 'border-rose-200 bg-white/60 shadow-rose-500/10 dark:border-rose-500/30 dark:bg-rose-950/60 dark:shadow-rose-500/10',
        indigo: 'border-indigo-200 bg-white/60 shadow-indigo-500/10 dark:border-indigo-500/30 dark:bg-indigo-950/60 dark:shadow-indigo-500/10',
    };
    
    const iconColors = {
        blue: 'text-sky-600 dark:text-sky-400',
        purple: 'text-purple-600 dark:text-purple-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        amber: 'text-amber-600 dark:text-amber-400',
        rose: 'text-rose-600 dark:text-rose-400',
        indigo: 'text-indigo-600 dark:text-indigo-400',
    };

    return (
        <div className={`
            group relative rounded-2xl md:rounded-3xl backdrop-blur-xl border
            flex flex-col items-start text-left hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500
            shadow-lg md:shadow-xl hover:shadow-2xl ${colors[color]} w-full h-full 
            
            /* RESPONSIVE PADDING & HEIGHT */
            p-4 md:p-6 
            min-h-[140px] md:min-h-[180px] 
            justify-between
        `}>
            {/* Icon Top Right (Smaller on mobile) */}
            <div className={`absolute top-3 right-3 md:top-5 md:right-5 text-xs md:text-lg opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300 ${iconColors[color]}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>

            {/* Big Number (Responsive Font) */}
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white tracking-tighter mb-1 leading-none transition-colors">
                {number}
            </h3>

            <div className="w-full">
                {/* Label */}
                <h4 className="text-[9px] md:text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1 md:mb-2 transition-colors truncate">
                    {label}
                </h4>

                {/* Divider */}
                <div className="w-6 md:w-8 h-0.5 md:h-1 bg-slate-200 dark:bg-white/10 rounded-full mb-1 md:mb-2 group-hover:w-full transition-all duration-500"></div>

                {/* Desc */}
                <p className="text-[9px] md:text-xs text-slate-600 dark:text-slate-400 leading-tight md:leading-relaxed font-medium dark:font-light transition-colors">
                    {desc}
                </p>
            </div>
        </div>
    );
}