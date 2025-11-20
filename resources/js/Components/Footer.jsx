import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 font-sans transition-colors duration-500 relative overflow-hidden">
            
            {/* Decorative Background Blur */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    
                    {/* COLUMN 1: BRAND (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                                <i className="fa-solid fa-graduation-cap text-lg"></i>
                            </div>
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Alumni<span className="text-brand-600">Portal</span>
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                            Platform resmi ikatan alumni Sekolah Vokasi IPB. Membangun koneksi, membuka peluang karir, dan mencetak profesional masa depan yang berdampak.
                        </p>
                        <div className="flex gap-3">
                            <SocialIcon icon="fa-instagram" href="#" />
                            <SocialIcon icon="fa-linkedin-in" href="#" />
                            <SocialIcon icon="fa-twitter" href="#" />
                            <SocialIcon icon="fa-youtube" href="#" />
                        </div>
                    </div>

                    {/* COLUMN 2: LINKS (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Tentang</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><FooterLink href="#">Sejarah Prodi</FooterLink></li>
                            <li><FooterLink href="#">Visi & Misi</FooterLink></li>
                            <li><FooterLink href="#">Dosen & Staf</FooterLink></li>
                            <li><FooterLink href="#">Akreditasi</FooterLink></li>
                            <li><FooterLink href="#">Fasilitas Lab</FooterLink></li>
                        </ul>
                    </div>

                    {/* COLUMN 3: LINKS (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Alumni</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><FooterLink href="#">Cari Alumni</FooterLink></li>
                            <li><FooterLink href="#">Lowongan Kerja</FooterLink></li>
                            <li><FooterLink href="#">Event & Reuni</FooterLink></li>
                            <li><FooterLink href="#">Donasi Kampus</FooterLink></li>
                            <li><FooterLink href="#">Merchandise</FooterLink></li>
                        </ul>
                    </div>

                    {/* COLUMN 4: NEWSLETTER (4 cols) */}
                    <div className="lg:col-span-4">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Tetap Terhubung</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Dapatkan info terbaru seputar kegiatan prodi, lowongan eksklusif, dan event alumni langsung di inbox Anda.
                        </p>
                        <form className="flex flex-col gap-3">
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-4 top-3.5 text-slate-400"></i>
                                <input 
                                    type="email" 
                                    placeholder="Masukkan alamat email" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white placeholder-slate-400"
                                />
                            </div>
                            <button className="px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                                Langganan Newsletter
                            </button>
                        </form>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} Sekolah Vokasi IPB. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- SUB COMPONENTS ---

function SocialIcon({ icon, href }) {
    return (
        <a 
            href={href} 
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-600 dark:hover:text-white dark:hover:border-brand-600 transition-all duration-300 group"
        >
            <i className={`fa-brands ${icon} group-hover:scale-110 transition-transform`}></i>
        </a>
    );
}

function FooterLink({ href, children }) {
    return (
        <a href={href} className="block hover:text-brand-600 dark:hover:text-brand-400 transition-colors hover:translate-x-1 transform duration-200 inline-flex items-center gap-1 group">
            <span className="w-0 group-hover:w-2 h-px bg-brand-600 dark:bg-brand-400 transition-all duration-300 mr-0 group-hover:mr-1"></span>
            {children}
        </a>
    );
}