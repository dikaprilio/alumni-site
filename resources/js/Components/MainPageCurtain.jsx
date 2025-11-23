import React, { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';

export default function MainPageCurtain() {
    // Ambil 'component' dari usePage untuk mendeteksi nama file page (misal: 'Error')
    const { url, component } = usePage(); 
    const [trigger, setTrigger] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [animClass, setAnimClass] = useState('animate-curtain-sequence'); // Default standard sequence
    
    const prevPath = useRef(null);

    useEffect(() => {
        const currentPath = url.split('?')[0];
        
        const mainPages = ['/', '/directory', '/opportunities', '/news', '/login', '/register', '/about', '/admin/login', '/error'];
        
        // 1. Cek apakah ini Main Page ATAU Halaman Error
        const isCurrentMain = mainPages.includes(currentPath) || component === 'Error';
        
        // 2. Trigger Curtain Logic
        // Kita trigger jika ini Main Page DAN path berubah
        if (isCurrentMain && prevPath.current !== currentPath) {
            
            // LOGIC BARU: Tentukan animasi berdasarkan apakah ini load pertama
            if (prevPath.current === null) {
                // First Load: Curtain sudah di bawah (covered), tinggal naik ke atas
                setAnimClass('animate-curtain-up');
            } else {
                // Navigasi: Curtain turun dulu, baru naik (Sequence)
                setAnimClass('animate-curtain-sequence');
            }

            setIsActive(true);
            setTrigger(t => t + 1); 

            const timer = setTimeout(() => setIsActive(false), 1500); // Sesuaikan timing dengan animasi terpanjang
            
            prevPath.current = currentPath;
            return () => clearTimeout(timer);
        } 
        
        prevPath.current = currentPath;
        setIsActive(false);
        
    }, [url, component]);

    if (!isActive) return null;

    return (
        <div 
            key={trigger} 
            className="fixed inset-0 z-50 pointer-events-none flex flex-col"
        >
            {/* Gunakan state animClass secara dinamis */}
            <div className={`absolute inset-0 bg-brand-600 dark:bg-brand-700 flex items-center justify-center ${animClass}`}>
                <div className="text-white opacity-0 animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '0.4s' }}>
                    {/* Ikon Warning untuk Error, Topi Wisuda untuk page lain */}
                    {component === 'Error' ? (
                        <i className="fa-solid fa-triangle-exclamation text-6xl drop-shadow-lg"></i>
                    ) : (
                        <i className="fa-solid fa-graduation-cap text-6xl drop-shadow-lg"></i>
                    )}
                </div>
            </div>
        </div>
    );
}