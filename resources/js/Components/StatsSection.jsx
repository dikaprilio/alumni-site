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

    // --- ANIMATION HELPERS ---
    const getHeadlineStyle = () => {
        if (progress < 0.2) {
            const localP = progress / 0.2; 
            return {
                opacity: localP, 
                filter: `blur(${(1 - localP) * 15}px)`, 
                transform: `translateY(0px) scale(${1.2 - (0.2 * localP)})` 
            };
        }
        else if (progress < 0.35) {
            return {
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'translateY(0px) scale(1)'
            };
        }
        else {
            const moveUp = (progress - 0.35) * 200; 
            return {
                opacity: 1, 
                filter: 'blur(0px)',
                transform: `translateY(-${Math.min(250, moveUp * 4)}px)` 
            };
        }
    };

    const getCardStyle = (index) => {
        const start = 0.35 + (index * 0.15); 
        const duration = 0.15; 
        const end = start + duration;

        if (progress < start) {
            return { 
                opacity: 0, 
                transform: 'translateY(150px)', 
                filter: 'blur(10px)'
            };
        } else if (progress >= start && progress <= end) {
            const localP = (progress - start) / duration;
            return {
                opacity: localP,
                transform: `translateY(${150 * (1 - localP)}px)`,
                filter: `blur(${(1 - localP) * 10}px)`
            };
        } else {
            return {
                opacity: 1,
                transform: 'translateY(0px)',
                filter: 'blur(0px)'
            };
        }
    };

    return (
        <section ref={sectionRef} className="relative h-[400vh] bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
            
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                
                {/* BACKGROUND FX */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 invert dark:invert-0 pointer-events-none transition-all duration-500"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-500"></div>

                {/* TEXT */}
                <div 
                    className="absolute top-[15%] w-full px-4 text-center z-10 will-change-transform"
                    style={getHeadlineStyle()}
                >
                    <p className="text-blue-600 dark:text-blue-400 font-mono text-xs md:text-sm tracking-[0.5em] uppercase mb-4 animate-pulse">
                        /// KENAPA MEMILIH KAMI?
                    </p>

                    <h2 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] drop-shadow-sm dark:drop-shadow-2xl transition-colors duration-500">
                        <span className="block text-slate-900 dark:text-white">BUKAN</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-600 to-slate-400 dark:from-slate-200 dark:to-slate-600">SEKADAR</span>
                        <span className="block text-slate-900 dark:text-white">KULIAH.</span>
                    </h2>
                    
                    <p 
                        className="mt-6 text-slate-600 dark:text-slate-400 text-sm md:text-lg max-w-xl mx-auto font-medium dark:font-light transition-all duration-300"
                        style={{ opacity: progress > 0.35 ? 0 : 1 }}
                    >
                        Mencetak profesional siap kerja, bukan sekadar lulusan.
                    </p>
                </div>

                {/* CARDS CONTAINER */}
                <div className="absolute bottom-0 w-full pb-12 md:pb-16 px-6 z-20 flex justify-center">
                    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        
                        {/* Card 1: Ganti warna ke 'blue' (lebih fresh daripada 'brand') */}
                        <div style={getCardStyle(0)} className="transition-all duration-100 ease-linear">
                            <GlassCard 
                                number="92%" 
                                label="Employability" 
                                desc="Lulusan bekerja < 3 bulan."
                                icon="fa-rocket"
                                color="blue" 
                            />
                        </div>

                        {/* Card 2 */}
                        <div style={getCardStyle(1)} className="transition-all duration-100 ease-linear md:mb-8"> 
                            <GlassCard 
                                number="70:30" 
                                label="Praktek vs Teori" 
                                desc="Coding di Lab, bukan hafalan."
                                icon="fa-code"
                                color="purple"
                            />
                        </div>

                        {/* Card 3 */}
                        <div style={getCardStyle(2)} className="transition-all duration-100 ease-linear">
                            <GlassCard 
                                number="50+" 
                                label="Mitra Industri" 
                                desc="Akses ke Tech Giants."
                                icon="fa-handshake"
                                color="emerald"
                            />
                        </div>

                    </div>
                </div>

                {/* Scroll Indicator */}
                <div 
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
                    style={{ opacity: progress > 0.1 ? 0 : 0.5 }}
                >
                    <div className="w-[1px] h-8 bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500 dark:to-transparent animate-pulse"></div>
                </div>

            </div>
        </section>
    );
}

// --- COMPONENT KARTU ---
function GlassCard({ number, label, desc, icon, color }) {
    const colors = {
        // UBAH LOGIKA WARNA: Pakai Blue/Sky yang lebih cerah, bukan Brand default
        blue: 'border-sky-200 bg-white/60 shadow-sky-500/10 dark:border-sky-500/30 dark:bg-sky-950/60 dark:shadow-sky-500/10',
        purple: 'border-purple-200 bg-white/60 shadow-purple-500/10 dark:border-purple-500/30 dark:bg-purple-950/60 dark:shadow-purple-500/10',
        emerald: 'border-emerald-200 bg-white/60 shadow-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:shadow-emerald-500/10',
    };
    
    const iconColors = {
        blue: 'text-sky-600 dark:text-sky-400',
        purple: 'text-purple-600 dark:text-purple-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
    };

    return (
        <div className={`
            group relative p-6 md:p-8 rounded-3xl backdrop-blur-xl border
            flex flex-col items-start text-left hover:-translate-y-2 transition-all duration-500
            shadow-xl hover:shadow-2xl ${colors[color]} w-full
        `}>
            {/* Icon Top Right */}
            <div className={`absolute top-6 right-6 text-xl opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300 ${iconColors[color]}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>

            {/* Big Number */}
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 dark:text-white tracking-tighter mb-1 leading-none transition-colors">
                {number}
            </h3>

            {/* Label */}
            <h4 className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-3 transition-colors">
                {label}
            </h4>

            {/* Divider */}
            <div className="w-10 h-1 bg-slate-200 dark:bg-white/10 rounded-full mb-3 group-hover:w-full transition-all duration-500"></div>

            {/* Desc */}
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium dark:font-light transition-colors">
                {desc}
            </p>
        </div>
    );
}