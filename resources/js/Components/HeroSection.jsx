import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function HeroSection() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const marqueeText = "JARINGAN RESMI ALUMNI SEKOLAH VOKASI IPB";

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            
            {/* --- 1. ENTRANCE CURTAIN --- */}
            <div className="fixed inset-0 z-[100] bg-brand-600 flex items-center justify-center animate-curtain-fun pointer-events-none">
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <i className="fa-solid fa-graduation-cap text-4xl text-white"></i>
                    <span className="text-white font-bold tracking-widest text-lg uppercase">Alumni TPL</span>
                </div>
            </div>

            {/* --- 2. BACKGROUND LAYERS --- */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                 <img 
                    src="/images/hero-bg.jpg" 
                    alt="Background" 
                    className={`w-full h-full object-cover opacity-20 dark:opacity-30 transition-all duration-1000 ease-out ${loaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'}`}
                />
            </div>
            <div className="absolute inset-0 z-0 bg-grid-slate dark:bg-grid-white opacity-40 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:from-transparent dark:via-slate-900/80 dark:to-slate-900"></div>

            {/* --- 3. HERO CONTENT --- */}
            <div className="relative z-10 container mx-auto px-6 pt-28 pb-24 text-center flex flex-col items-center justify-center h-full">
                
                {/* HEADLINE */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[0.95] cursor-default">
                    
                    {/* LINE 1: TEKNOLOGI */}
                    <div className="overflow-hidden block">
                        {/* Outer Span: Entrance Animation */}
                        <span className="block animate-spring-up delay-hero-start">
                            {/* Inner Span: Hover Interaction (Tech Snap Only) */}
                            <span className="inline-block hover-tech-snap transition-all duration-300 hover:text-brand-600 dark:hover:text-brand-400">
                                TEKNOLOGI
                            </span>
                        </span>
                    </div>

                    {/* LINE 2: REKAYASA */}
                    <div className="overflow-hidden block py-1">
                        <span className="block text-brand-600 dark:text-brand-500 animate-spring-up delay-hero-mid">
                             {/* Removed Float Idle, Kept Tech Snap */}
                            <span className="inline-block hover-tech-snap">
                                REKAYASA
                            </span>
                        </span>
                    </div>

                    {/* LINE 3: PERANGKAT LUNAK */}
                    <div className="overflow-hidden block">
                        <span className="block animate-spring-up delay-hero-end">
                             <span className="inline-block hover-tech-snap transition-all duration-300 hover:text-brand-600 dark:hover:text-brand-400">
                                PERANGKAT LUNAK
                            </span>
                        </span>
                    </div>
                </h1>

                {/* DESCRIPTION */}
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-spring-up delay-hero-end opacity-0">
                    Membangun ekosistem digital untuk <span className="font-bold text-brand-600 dark:text-brand-400">berkarya</span>, <span className="font-bold text-brand-600 dark:text-brand-400">berinovasi</span>, dan <span className="font-bold text-brand-600 dark:text-brand-400">berkolaborasi</span> tanpa batas.
                </p>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-spring-up delay-hero-end opacity-0">
                    <Link
                        href="/register"
                        className="hover-lift group min-w-[180px] px-8 py-3.5 bg-brand-600 text-white rounded-full font-bold text-sm md:text-base shadow-lg shadow-brand-600/20 hover:bg-brand-500 transition-all flex items-center justify-center gap-2"
                    >
                        Gabung Sekarang
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                    
                    <Link
                        href="/about"
                        className="hover-lift min-w-[180px] px-8 py-3.5 bg-white dark:bg-white/5 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-white/10 rounded-full font-bold text-sm md:text-base hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-500 dark:hover:text-brand-400 transition-all"
                    >
                        Intip Alumni
                    </Link>
                </div>
            </div>

            {/* --- 4. FULL WIDTH MARQUEE --- */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-brand-600 dark:bg-brand-800 z-20 border-t border-brand-500/30 py-3">
                <div className="animate-marquee-infinite flex items-center whitespace-nowrap">
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                    <MarqueeItem text={marqueeText} />
                </div>
            </div>
        </div>
    );
}

function MarqueeItem({ text }) {
    return (
        <div className="flex items-center gap-8 px-4">
            <span className="text-white font-bold tracking-[0.2em] text-sm md:text-base uppercase">
                {text}
            </span>
            <span className="w-1.5 h-1.5 bg-brand-300 rounded-full opacity-50"></span>
        </div>
    );
}