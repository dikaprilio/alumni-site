// resources/js/Components/HeroSection.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function HeroSection() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Layer 1: Dark Blue Base */}
            <div className="absolute inset-0 bg-slate-900"></div>
            
            {/* Background Layer 2: Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                 <img 
                    src="/images/hero-bg.jpg" // Ensure this file exists
                    alt="TPL IPB Students" 
                    className="w-full h-full object-cover opacity-40"
                />
                {/* Gradient: Dark at bottom, slightly lighter at top-left */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-brand-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                
                {/* Badge / Tagline */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-brand-100 text-xs md:text-sm font-medium mb-6 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                    Jaringan Resmi Alumni Sekolah Vokasi IPB
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up delay-100">
                    Teknologi Rekayasa <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-100">
                        Perangkat Lunak
                    </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light">
                    Wadah kolaborasi dan pengembangan karir bagi lulusan TPL. 
                    Temukan mentor, peluang kerja, dan bangun koneksi profesional Anda di sini.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
                    <Link
                        href="/register"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 text-white font-semibold text-base shadow-xl shadow-brand-600/30 hover:bg-brand-500 hover:shadow-brand-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        Gabung Alumni
                        <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    
                    <Link
                        href="/about"
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 backdrop-blur-sm font-medium text-base hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        Pelajari Lebih Lanjut
                    </Link>
                </div>

                {/* Stats / Social Proof (Optional) */}
                <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16 border-t border-white/10 pt-8 animate-fade-in-up delay-500">
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">2.5k+</p>
                        <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider mt-1">Total Alumni</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">95%</p>
                        <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider mt-1">Terserap Kerja</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
                        <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider mt-1">Mitra Industri</p>
                    </div>
                </div>
            </div>
        </div>
    );
}