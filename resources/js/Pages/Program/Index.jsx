import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Index() {
    const sectionRef = useRef(null);
    const [progress, setProgress] = useState(0);

    // --- SCROLL LOGIC (Sama seperti referensi Anda) ---
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
    
    // Helper untuk mempermudah range animasi
    // start: kapan mulai muncul, end: kapan selesai menghilang, peak: titik paling jelas
    const getSceneStyle = (start, end, peak) => {
        if (progress < start || progress > end) return { opacity: 0, pointerEvents: 'none' };

        let opacity = 0;
        let transform = '';
        let filter = '';

        if (progress < peak) {
            // Fase Muncul (Fade In & Slide Up)
            const localP = (progress - start) / (peak - start);
            opacity = localP;
            transform = `translateY(${100 * (1 - localP)}px) scale(${0.9 + (0.1 * localP)})`;
            filter = `blur(${10 * (1 - localP)}px)`;
        } else {
            // Fase Hilang (Fade Out & Slide Up Lanjut/Zoom)
            const localP = (progress - peak) / (end - peak);
            opacity = 1 - localP;
            transform = `translateY(-${100 * localP}px) scale(${1 + (0.1 * localP)})`;
            filter = `blur(${10 * localP}px)`;
        }

        return { opacity, transform, filter };
    };

    // --- SCENES CONFIGURATION ---

    // SCENE 1: INTRO / HEADLINE (0.0 - 0.20)
    const scene1Style = getSceneStyle(0.0, 0.20, 0.10);

    // SCENE 2: THE SHIFT (History) (0.20 - 0.45)
    const scene2Style = getSceneStyle(0.20, 0.45, 0.32);

    // SCENE 3: COMPETENCIES (0.45 - 0.70)
    // Scene ini agak spesial karena itemnya muncul berurutan, jadi kita manual dikit
    const scene3ContainerStyle = (() => {
        const start = 0.45; const end = 0.70;
        if (progress < start || progress > end) return { opacity: 0, pointerEvents: 'none' };
        return { opacity: 1, pointerEvents: 'auto' };
    })();
    
    const getCompItemStyle = (index) => {
        const baseStart = 0.45;
        const stagger = 0.03;
        const itemStart = baseStart + (index * stagger);
        const itemPeak = itemStart + 0.08;
        const itemEnd = 0.70; // Semua hilang barengan

        if (progress < itemStart) return { opacity: 0, transform: 'translateY(50px)', filter: 'blur(10px)' };
        if (progress > itemEnd) return { opacity: 0, transform: 'translateY(-50px)', filter: 'blur(10px)' };

        if (progress < itemPeak) {
             const p = (progress - itemStart) / (itemPeak - itemStart);
             return { opacity: p, transform: `translateY(${50 * (1-p)}px)`, filter: `blur(${10 * (1-p)}px)` };
        }
        // Hold phase
        return { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' };
    };

    // SCENE 4: IPB CONTEXT (0.70 - 0.85)
    const scene4Style = getSceneStyle(0.70, 0.85, 0.77);

    // SCENE 5: OUTCOME / CTA (0.85 - 1.0)
    const scene5Style = (() => {
        const start = 0.85;
        if (progress < start) return { opacity: 0, transform: 'scale(0.8)', filter: 'blur(20px)' };
        
        // Final state (tidak menghilang di akhir)
        const p = Math.min(1, (progress - start) / 0.10);
        return { 
            opacity: p, 
            transform: `scale(${0.8 + (0.2 * p)})`, 
            filter: `blur(${20 * (1-p)}px)` 
        };
    })();


    return (
        <>
            <Head title="Program Studi - Sekolah Vokasi IPB" />

            {/* CONTAINER RAKSASA UNTUK SCROLL SPACE */}
            <div ref={sectionRef} className="relative h-[1200vh] bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500 selection:bg-brand-600 selection:text-white">
                
                {/* STICKY VIEWPORT (LAYAR TV KITA) */}
                <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

                    {/* --- BACKGROUND FX (Berubah dinamis sesuai progress) --- */}
                    <div className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-linear"
                        style={{
                            background: progress > 0.85 
                                ? 'linear-gradient(to bottom, #0f172a, #000000)' // Dark ending
                                : 'transparent'
                        }}
                    ></div>

                    {/* Moving blobs */}
                    <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] bg-brand-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                        style={{ transform: `translate(-50%, -50%) scale(${1 + Math.sin(progress * 5)}) rotate(${progress * 100}deg)` }}
                    ></div>
                    
                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-grid-slate dark:bg-grid-white opacity-[0.05] pointer-events-none"></div>


                    {/* =========================================================
                        SCENE 1: INTRO / HEADLINE
                       ========================================================= */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10" style={scene1Style}>
                        <div className="overflow-hidden mb-4">
                            <span className="block text-brand-600 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                                /// TRANSFORMASI PENDIDIKAN
                            </span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
                            EVOLUSI<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">VOKASI.</span>
                        </h1>
                        <p className="mt-8 text-xl text-slate-500 dark:text-slate-400 max-w-lg">
                            Scroll untuk melihat perjalanan transformasi kami.
                        </p>
                    </div>


                    {/* =========================================================
                        SCENE 2: THE SHIFT (HISTORY)
                       ========================================================= */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-20" style={scene2Style}>
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 relative">
                            
                            {/* OLD */}
                            <div className="text-center opacity-40 blur-[1px] scale-90">
                                <div className="text-6xl mb-4">💾</div>
                                <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-600 strike-through decoration-2">Manajemen Informatika (D3)</h3>
                                <p className="text-sm font-mono mt-2">LEGACY FOUNDATION</p>
                            </div>

                            {/* ARROW */}
                            <div className="text-4xl text-brand-500 animate-pulse">
                                <i className="fa-solid fa-arrow-right md:rotate-0 rotate-90"></i>
                            </div>

                            {/* NEW */}
                            <div className="text-center relative">
                                <div className="absolute -inset-10 bg-brand-500/20 blur-3xl rounded-full"></div>
                                <div className="relative">
                                    <div className="text-6xl mb-4">🚀</div>
                                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                        Teknologi Rekayasa<br/>Perangkat Lunak (D4)
                                    </h3>
                                    <div className="flex gap-3 justify-center mt-6">
                                        <Badge>8 Semester</Badge>
                                        <Badge>Sarjana Terapan</Badge>
                                        <Badge>End-to-End</Badge>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* =========================================================
                        SCENE 3: COMPETENCIES (3 PILLARS)
                       ========================================================= */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-30" style={scene3ContainerStyle}>
                        
                        <h2 className="text-4xl font-black mb-12 tracking-tight text-center text-slate-900 dark:text-white">
                            KURIKULUM <span className="text-brand-600">MODERN</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                            
                            {/* Card 1: ENGINEERING */}
                            <div style={getCompItemStyle(0)} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                                    <i className="fa-solid fa-laptop-code"></i>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Engineering</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    Fokus pada rekayasa perangkat lunak <em>end-to-end</em>. Arsitektur sistem, Clean Code, DevOps, dan Mobile/Web Development skala industri.
                                </p>
                            </div>

                            {/* Card 2: DATA */}
                            <div style={getCompItemStyle(1)} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                                    <i className="fa-solid fa-chart-network"></i>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Data & Logic</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    Bukan sekadar koding. Kami melatih kemampuan analisis data, algoritma kompleks, dan pemanfaatan Big Data untuk keputusan strategis.
                                </p>
                            </div>

                            {/* Card 3: SOCIO */}
                            <div style={getCompItemStyle(2)} className="bg-brand-600 text-white p-8 rounded-3xl shadow-xl shadow-brand-600/20">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                                    <i className="fa-solid fa-heart"></i>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Techno-Socio</h3>
                                <p className="text-brand-100 leading-relaxed text-sm">
                                    Teknologi harus berdampak. Mengintegrasikan kewirausahaan sosial dan empati untuk menciptakan solusi yang dibutuhkan masyarakat nyata.
                                </p>
                            </div>

                        </div>
                    </div>


                    {/* =========================================================
                        SCENE 4: IPB CONTEXT (AGRO MARITIM)
                       ========================================================= */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-40 text-center" style={scene4Style}>
                        <div className="relative">
                            {/* Orbit lines */}
                            <div className="absolute inset-0 border border-slate-300 dark:border-slate-700 rounded-full scale-150 opacity-30 animate-spin-slow-reverse"></div>
                            <div className="absolute inset-0 border border-dashed border-slate-400 dark:border-slate-600 rounded-full scale-[2] opacity-20 animate-spin-slow"></div>

                            <div className="relative z-10 bg-white dark:bg-slate-900 p-12 rounded-full border-2 border-brand-500 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                                <img src="/images/ipb-logo.png" alt="IPB" className="w-24 h-24 object-contain opacity-20" /> {/* Placeholder text if image missing */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">IPB</span>
                                </div>
                            </div>

                            {/* Orbiting Items */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold border border-slate-700">
                                🌱 SMART FARMING
                            </div>
                            <div className="absolute bottom-0 right-0 translate-x-[50%] translate-y-[100%] bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold border border-slate-700">
                                ⚓ MARITIME LOGISTICS
                            </div>
                            <div className="absolute bottom-0 left-0 -translate-x-[50%] translate-y-[100%] bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold border border-slate-700">
                                🧬 BIOSCIENCE DATA
                            </div>
                        </div>

                        <h2 className="mt-24 text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
                            Konteks <span className="text-emerald-500">Agro-Maritim</span> 4.0
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                            Mahasiswa TPL beradaptasi dengan domain pertanian dan kelautan, menciptakan sistem IoT dan analitik untuk sektor vital bangsa.
                        </p>
                    </div>


                    {/* =========================================================
                        SCENE 5: OUTCOME / CTA
                       ========================================================= */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-50 text-center pointer-events-auto" style={scene5Style}>
                        
                        <p className="font-mono text-brand-400 mb-4 tracking-widest text-sm uppercase">THE OUTCOME</p>
                        
                        <h2 className="text-[12vw] md:text-[10vw] font-black leading-none text-white mix-blend-difference select-none">
                            SARJANA
                        </h2>
                        <h2 className="text-[12vw] md:text-[10vw] font-black leading-none text-brand-500 -mt-2 md:-mt-6 select-none relative z-10">
                            TERAPAN
                        </h2>

                        <div className="mt-12 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex -space-x-4">
                                <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                                <div className="w-12 h-12 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                                <div className="w-12 h-12 rounded-full bg-slate-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">+500</div>
                            </div>
                            <p className="text-slate-400 text-sm">Alumni telah bekerja di Unicorn & BUMN</p>
                        </div>

                        <div className="mt-12">
                            <Link href="/register" className="inline-flex items-center gap-3 bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-500 hover:scale-105 transition-all shadow-lg shadow-brand-600/30">
                                Bergabung Sekarang
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>

                    </div>

                    {/* PROGRESS BAR INDICATOR (Bottom) */}
                    <div className="absolute bottom-0 left-0 h-2 bg-brand-600 transition-all duration-75 ease-out z-[100]" style={{ width: `${progress * 100}%` }}></div>

                </div>
            </div>
        </>
    );
}

// Helper Component untuk Badge kecil
function Badge({ children }) {
    return (
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            {children}
        </span>
    );
}

Index.layout = page => <PublicLayout children={page} />;