import React, { useState } from 'react';

export default function AboutSection() {
    const [activeCard, setActiveCard] = useState(1);

    const cards = [
        {
            id: 0,
            title: "TRANSFORMASI",
            subtitle: "D3 MI ke D4 TRPL",
            desc: "Berevolusi dari Manajemen Informatika (D3) menjadi Teknologi Rekayasa Perangkat Lunak (D4). Masa studi 4 tahun untuk memperdalam rekayasa software end-to-end, web, mobile, dan multimedia.",
            img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
            color: "from-blue-600 to-cyan-500"
        },
        {
            id: 1,
            title: "KURIKULUM",
            subtitle: "Techno-Socio & Data",
            desc: "Menempatkan proyek nyata sebagai pusat pendidikan. Kami memperkuat aspek analisis data, kewirausahaan sosial (techno-socio), dan kolaborasi lintas disiplin agar mahasiswa siap kerja.",
            img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
            color: "from-purple-600 to-pink-500"
        },
        {
            id: 2,
            title: "IDENTITAS",
            subtitle: "Agro-Maritim & Biosains",
            desc: "Mencetak 'Sarjana Terapan' yang tidak hanya ahli koding, tapi mampu membangun sistem kompleks untuk sektor pertanian, kelautan, dan biosains tropika yang menjadi fokus IPB.",
            img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
            color: "from-emerald-600 to-teal-500"
        }
    ];

    return (
        <section className="relative py-20 md:py-32 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
            
            {/* --- BACKGROUND TEXTURE --- */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-noise mix-blend-overlay"></div>

            {/* --- DECORATIVE BLOBS --- */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-200/40 dark:bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-20 w-[300px] h-[300px] bg-purple-300/40 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* UPDATED CONTAINER: Consistent Breathing Room */}
            <div className="max-w-[1440px] mx-auto px-8 md:px-20 lg:px-32 relative z-10">
                
                {/* --- HEADER --- */}
                <div className="mb-16 md:mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left: Headline */}
                        <div className="lg:col-span-7 relative">
                            <div className="hidden lg:block absolute -left-8 top-4 w-1 h-32 bg-brand-600"></div>
                            
                            <h2 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] relative z-10">
                                <span className="block text-slate-500 dark:text-slate-500 transform -translate-x-1 lg:-translate-x-2">
                                    SARJANA
                                </span>
                                <span className="block text-slate-900 dark:text-white">
                                    TERAPAN<span className="text-brand-600">.</span>
                                </span>
                            </h2>
                        </div>

                        {/* Right: Description */}
                        <div className="lg:col-span-5 flex flex-col justify-center">
                            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border-l-4 border-brand-600 shadow-sm dark:shadow-none">
                                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    Program Studi <strong className="text-brand-600 dark:text-brand-400">Teknologi Rekayasa Perangkat Lunak (TPL)</strong> Sekolah Vokasi IPB.
                                </p>
                                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Mengadaptasi pondasi Manajemen Informatika, kami bertransformasi untuk menjawab strategi vokasi nasional. Memperluas jenjang pendidikan menjadi 8 semester untuk mencetak lulusan yang siap menghadapi kompleksitas industri 4.0.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CARDS --- */}
                <div className="flex flex-col lg:flex-row h-[800px] lg:h-[550px] gap-4 w-full select-none">
                    {cards.map((card, index) => (
                        <div 
                            key={card.id}
                            onClick={() => setActiveCard(index)}
                            onMouseEnter={() => setActiveCard(index)}
                            className={`
                                relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl
                                ${activeCard === index 
                                    ? 'lg:flex-[3.5] flex-[3] shadow-brand-900/20 ring-1 ring-white/20' 
                                    : 'lg:flex-[0.8] flex-[1] opacity-80 hover:opacity-100 grayscale hover:grayscale-0'
                                }
                            `}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img 
                                    src={card.img} 
                                    alt={card.title} 
                                    className={`w-full h-full object-cover transition-transform duration-1000 ${activeCard === index ? 'scale-100' : 'scale-110'}`}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent transition-opacity duration-500 ${activeCard === index ? 'opacity-90' : 'opacity-60'}`}></div>
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} mix-blend-overlay transition-opacity duration-500 ${activeCard === index ? 'opacity-80' : 'opacity-0'}`}></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end z-20">
                                <div className={`transition-all duration-500 transform ${activeCard === index ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-8 opacity-0'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-mono text-xs">
                                            0{index + 1}
                                        </span>
                                        <span className="text-brand-300 font-mono text-xs tracking-[0.2em] uppercase">
                                            {card.subtitle}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-none tracking-tight drop-shadow-lg">
                                        {card.title}
                                    </h3>
                                    <div className="relative pl-5">
                                        <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-brand-400 to-transparent rounded-full"></div>
                                        <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light max-w-lg">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:right-1/2 lg:translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 transition-all duration-500 ${activeCard === index ? 'opacity-0 scale-90' : 'opacity-100 scale-100 delay-200'}`}>
                                    <h3 className="text-2xl md:text-4xl font-black text-white/50 tracking-widest uppercase lg:rotate-90 whitespace-nowrap drop-shadow-md hover:text-white transition-colors">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* --- FOOTER DECORATION --- */}
                <div className="mt-16 flex justify-between items-end border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div className="hidden md:flex gap-1">
                         <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse"></div>
                         <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse delay-75"></div>
                         <div className="w-1.5 h-1.5 bg-brand-200 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <div className="text-right">
                         <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase mb-1">Sekolah Vokasi IPB</p>
                         <p className="text-xs font-mono text-slate-500 dark:text-slate-500">Vocational School of IPB University</p>
                    </div>
                </div>

            </div>
        </section>
    );
}