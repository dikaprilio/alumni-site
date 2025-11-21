import React, { useEffect, useRef, useState } from 'react';

export default function DistributionSection() {
    // --- SCROLL ANIMATION LOGIC ---
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // --- CSS MARQUEE ---
    const marqueeStyle = `
        @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }
        .animate-scroll-left {
            animation: scrollLeft 40s linear infinite;
        }
        .animate-scroll-right {
            animation: scrollRight 40s linear infinite;
        }
        .marquee-container:hover .animate-scroll-left,
        .marquee-container:hover .animate-scroll-right {
            animation-play-state: paused;
        }
    `;

    return (
        // OUTER WRAPPER: Full Width Background
        <section ref={sectionRef} className="relative py-32 bg-white dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500 w-full">
            <style>{marqueeStyle}</style>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Gradient Fade Overlay */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

            {/* REVISI DISINI: BREATHING ROOM 
                - px-8 (Mobile): Tidak terlalu mepet
                - md:px-20 (Tablet): Mulai lega
                - lg:px-32 (Desktop): Sangat lega, fokus ke tengah (Editorial Look)
            */}
            <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 relative z-20">
                
                {/* --- HEADER --- */}
                <div className="mb-24 text-center mx-auto max-w-4xl">
                    <div className={`flex justify-center items-center gap-3 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="h-px w-12 bg-slate-400"></div>
                        <span className="text-xs font-bold font-mono tracking-[0.3em] uppercase text-slate-500">Industrial Ecosystem</span>
                        <div className="h-px w-12 bg-slate-400"></div>
                    </div>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                        <span className="block overflow-hidden">
                            <span className={`block transition-transform duration-[800ms] ease-out delay-100 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                                SINERGI TANPA
                            </span>
                        </span>
                        <span className="block overflow-hidden">
                            <span className={`block text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-500 transition-transform duration-[800ms] ease-out delay-200 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                                BATAS RUANG.
                            </span>
                        </span>
                    </h2>

                    <p className={`mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        Bukan sekadar logo di website. Ini adalah jalur cepat ("Fast-Track") alumni kami menuju meja kerja perusahaan teknologi global.
                    </p>
                </div>


                {/* --- BENTO GRID --- */}
                <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    
                    {/* CARD 1: MARQUEE (Wide) */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] py-16 overflow-hidden relative group marquee-container shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all duration-500">
                        <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>

                        <div className="flex flex-col gap-12">
                            <div className="flex w-max animate-scroll-left gap-20 items-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <LogoSet1 />
                                <LogoSet1 /> 
                            </div>
                            <div className="flex w-max animate-scroll-right gap-20 items-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <LogoSet2 />
                                <LogoSet2 />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: CAREER TRACKS */}
                    <div className="col-span-1 md:col-span-2 row-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-10 flex flex-col hover:shadow-xl transition-all duration-500 group">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Fokus Karier</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Distribusi peran alumni 2024.</p>
                            </div>
                            <i className="fa-solid fa-chart-pie text-4xl text-slate-200 dark:text-slate-800 group-hover:text-brand-500 transition-colors"></i>
                        </div>
                        
                        <div className="space-y-6 flex-1">
                            <TrackItem role="Full Stack Dev" percent="45%" count="120+" color="brand" />
                            <TrackItem role="Data & AI" percent="25%" count="85+" color="purple" />
                            <TrackItem role="Mobile Engineer" percent="20%" count="60+" color="blue" />
                            <TrackItem role="Cloud / DevOps" percent="10%" count="30+" color="emerald" />
                        </div>
                    </div>

                    {/* CARD 3: TECH STACK */}
                    <div className="col-span-1 md:col-span-1 bg-slate-900 text-white rounded-[2rem] p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500 rounded-full blur-[60px] group-hover:blur-[40px] transition-all"></div>
                        <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                            <i className="fa-solid fa-code"></i> Live Stack
                        </h3>
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {['React', 'Laravel', 'Flutter', 'Go', 'Python', 'Docker', 'AWS', 'K8s'].map((tech) => (
                                <span key={tech} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-xs font-bold transition-all cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CARD 4: REMOTE STATS */}
                    <div className="col-span-1 md:col-span-1 bg-gradient-to-b from-brand-600 to-brand-700 text-white rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Global Reach</span>
                            </div>
                            <h3 className="text-xl font-bold leading-tight">Remote Workers</h3>
                        </div>
                        <div className="mt-8 relative z-10">
                            <span className="text-6xl font-black tracking-tighter">35%</span>
                            <p className="text-sm opacity-90 mt-2 font-medium">Alumni bekerja dari rumah untuk klien luar negeri.</p>
                        </div>
                    </div>

                    {/* CARD 5: QUOTE */}
                    <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8 hover:border-brand-500/20 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700">
                            <i className="fa-solid fa-quote-left text-2xl text-brand-500"></i>
                        </div>
                        <div>
                            <p className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed italic">
                                "Lulusan di sini beda. Mereka tidak perlu diajari cara 'belajar'. Mereka adaptif, paham git flow, dan logic-nya jalan."
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-px w-8 bg-slate-300"></div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    CTO @ Unicorn Startup Indonesia
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// --- SUB COMPONENTS ---
function LogoSet1() {
    return (
        <>
            <BrandItem name="Google" icon="fa-google" />
            <BrandItem name="Microsoft" icon="fa-microsoft" />
            <BrandItem name="Amazon" icon="fa-aws" />
            <BrandItem name="Spotify" icon="fa-spotify" />
            <BrandItem name="Apple" icon="fa-apple" />
            <BrandItem name="Meta" icon="fa-meta" />
        </>
    );
}

function LogoSet2() {
    return (
        <>
            <BrandItem name="Tokopedia" icon="fa-shop" />
            <BrandItem name="Gojek" icon="fa-motorcycle" />
            <BrandItem name="Traveloka" icon="fa-plane" />
            <BrandItem name="Discord" icon="fa-discord" />
            <BrandItem name="Github" icon="fa-github" />
            <BrandItem name="Linkedin" icon="fa-linkedin" />
        </>
    );
}

function BrandItem({ name, icon }) {
    return (
        <div className="flex items-center gap-4 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group">
            <i className={`fa-brands ${icon} text-5xl text-slate-300 dark:text-slate-700 group-hover:text-slate-800 dark:group-hover:text-white transition-colors`}></i>
            <span className="text-3xl font-black font-sans text-slate-300 dark:text-slate-700 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                {name}
            </span>
        </div>
    );
}

function TrackItem({ role, percent, count, color }) {
    const colors = {
        brand: 'bg-brand-500',
        purple: 'bg-purple-500',
        blue: 'bg-blue-500',
        emerald: 'bg-emerald-500'
    };
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-lg">{role}</span>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    {count} Alumni
                </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden relative border border-slate-100 dark:border-slate-800">
                <div 
                    className={`h-full rounded-full ${colors[color]} absolute top-0 left-0 transition-all duration-1000 ease-out w-0 group-hover:w-[var(--target-width)]`}
                    style={{ '--target-width': percent, width: percent }}
                ></div>
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-20"></div>
            </div>
        </div>
    );
}