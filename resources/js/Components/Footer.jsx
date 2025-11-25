import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { useToast } from './ToastContext';

export default function Footer() {
    const { addToast } = useToast();
    const { data, setData, post, processing } = useForm({
        email: '',
    });

    const handleNewsletter = (e) => {
        e.preventDefault();
        // For now, just show a toast. Can be connected to backend later
        addToast('Terima kasih! Anda telah berlangganan newsletter kami.', 'success');
        setData('email', '');
    };

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 font-sans transition-colors duration-500 relative overflow-hidden">
            
            {/* Decorative Background Blur */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    
                    {/* COLUMN 1: BRAND (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                                <i className="fa-solid fa-graduation-cap text-lg"></i>
                            </div>
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Alumni<span className="text-brand-600">Portal</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                            Platform resmi ikatan alumni Sekolah Vokasi IPB. Membangun koneksi, membuka peluang karir, dan mencetak profesional masa depan yang berdampak.
                        </p>
                        <div className="flex gap-3">
                            <SocialIcon 
                                icon="fa-instagram" 
                                href="https://instagram.com/sekolahvokasiipb" 
                                label="Instagram Sekolah Vokasi IPB"
                            />
                            <SocialIcon 
                                icon="fa-linkedin-in" 
                                href="https://linkedin.com/school/sekolah-vokasi-ipb" 
                                label="LinkedIn Sekolah Vokasi IPB"
                            />
                            <SocialIcon 
                                icon="fa-twitter" 
                                href="https://twitter.com/vokasiipb" 
                                label="Twitter Sekolah Vokasi IPB"
                            />
                            <SocialIcon 
                                icon="fa-youtube" 
                                href="https://youtube.com/@sekolahvokasiipb" 
                                label="YouTube Sekolah Vokasi IPB"
                            />
                        </div>
                    </div>

                    {/* COLUMN 2: TENTANG (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Tentang</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id/tentang/sejarah" external>
                                    Sejarah Prodi
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id/tentang/visi-misi" external>
                                    Visi & Misi
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id/tentang/dosen-staf" external>
                                    Dosen & Staf
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id/tentang/akreditasi" external>
                                    Akreditasi
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id/tentang/fasilitas" external>
                                    Fasilitas Lab
                                </FooterLink>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 3: ALUMNI & FITUR (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Fitur</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <FooterLink href={route('public.alumni')}>
                                    Cari Alumni
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href={route('public.news')}>
                                    Berita & Acara
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href={route('public.program')}>
                                    Program Studi
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id/kontak" external>
                                    Kontak Kami
                                </FooterLink>
                            </li>
                            <li>
                                <FooterLink href="https://sv.ipb.ac.id" external>
                                    Website Resmi
                                </FooterLink>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 4: NEWSLETTER (4 cols) */}
                    <div className="lg:col-span-4">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Tetap Terhubung</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Dapatkan info terbaru seputar kegiatan prodi, lowongan eksklusif, dan event alumni langsung di inbox Anda.
                        </p>
                        <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-4 top-3.5 text-slate-400"></i>
                                <input 
                                    type="email" 
                                    placeholder="Masukkan alamat email" 
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white placeholder-slate-400"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-paper-plane"></i>
                                        Langganan Newsletter
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                            Kami menghormati privasi Anda. Unsubscribe kapan saja.
                        </p>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                            &copy; {new Date().getFullYear()} Sekolah Vokasi IPB. All rights reserved.
                        </p>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
                        <p className="text-xs text-slate-400 dark:text-slate-600">
                            Dibangun dengan ❤️ untuk Alumni Sekolah Vokasi IPB
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <FooterLink href="/privacy-policy" small>
                            Privacy Policy
                        </FooterLink>
                        <FooterLink href="/terms-of-service" small>
                            Terms of Service
                        </FooterLink>
                        <FooterLink href="/cookie-policy" small>
                            Cookie Policy
                        </FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- SUB COMPONENTS ---

function SocialIcon({ icon, href, label }) {
    return (
        <a 
            href={href} 
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-600 dark:hover:text-white dark:hover:border-brand-600 transition-all duration-300 group"
        >
            <i className={`fa-brands ${icon} group-hover:scale-110 transition-transform`}></i>
        </a>
    );
}

function FooterLink({ href, children, external = false, small = false }) {
    const baseClasses = small 
        ? "hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        : "block hover:text-brand-600 dark:hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-flex items-center gap-1 group";
    
    if (external) {
        return (
            <a 
                href={href} 
                target="_blank"
                rel="noopener noreferrer"
                className={baseClasses}
            >
                {!small && (
                    <span className="w-0 group-hover:w-2 h-px bg-brand-600 dark:bg-brand-400 transition-all duration-300 mr-0 group-hover:mr-1"></span>
                )}
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={baseClasses}>
            {!small && (
                <span className="w-0 group-hover:w-2 h-px bg-brand-600 dark:bg-brand-400 transition-all duration-300 mr-0 group-hover:mr-1"></span>
            )}
            {children}
        </Link>
    );
}
