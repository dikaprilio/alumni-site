import React, { useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import MainPageCurtain from '../Components/MainPageCurtain';

export default function PublicLayout({ children }) {
    const { url } = usePage();
    const currentPath = url.split('?')[0];
    
    // Ref untuk melacak path sebelumnya agar sinkron dengan logika Curtain
    // Kita inisialisasi dengan currentPath agar render pertama dianggap "SAMA" (tidak delay)
    const prevPathRef = useRef(currentPath);

    // Logic Penentuan Animasi
    const mainPages = ['/', '/directory', '/news', '/login', '/register', '/about', '/admin/login', '/opportunities'];
    const isMainPage = mainPages.includes(currentPath);
    
    // Cek apakah path berubah (Bukan sekadar query string)
    const isPathChanged = prevPathRef.current !== currentPath;

    // Tentukan Class Animasi
    let animationClass = 'animate-content-enter'; // Default (Langsung muncul smooth)

    if (isMainPage && isPathChanged) {
        // HANYA jika pindah halaman utama (Path berubah), kita pakai DELAY
        // karena Curtain akan turun menutupi layar dulu.
        animationClass = 'animate-content-delayed';
    }

    // Update ref setelah render selesai untuk persiapan navigasi berikutnya
    useEffect(() => {
        prevPathRef.current = currentPath;
    }, [currentPath]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-500 flex flex-col">
            
            {/* GLOBAL CURTAIN (Menangani logika visual tirai) */}
            <MainPageCurtain />

            <Header />

            {/* MAIN CONTENT
                - key={url} memastikan konten di-unmount & remount setiap URL berubah (termasuk query)
                - animationClass dinamis: Delay hanya jika ganti path, Langsung jika cuma filter.
            */}
            <main 
                key={url} 
                className={`flex-1 ${animationClass}`}
            >
                {children}
            </main>

            <Footer />
        </div>
    );
}