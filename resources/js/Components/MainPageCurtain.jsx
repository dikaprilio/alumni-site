import React, { useEffect, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';

export default function MainPageCurtain() {
    // Ambil 'component' dari usePage untuk mendeteksi nama file page (misal: 'Error')
    const { url, component } = usePage(); 
    const [trigger, setTrigger] = useState(0);
    const [isActive, setIsActive] = useState(false);
    
    const prevPath = useRef(null);

    useEffect(() => {
        const currentPath = url.split('?')[0];
        
        const mainPages = ['/', '/directory', '/news', '/login', '/register', '/about', '/admin/login', '/error'];
        
        // 1. Cek apakah ini Main Page ATAU Halaman Error
        const isCurrentMain = mainPages.includes(currentPath) || component === 'Error';
        
        // Cek history sebelumnya (agar transisi berjalan mulus antar menu)
        // Kita asumsikan null (first load) sebagai valid agar error page di awal tetap dapat curtain jika diinginkan
        // atau bisa kita buat lebih strict.
        const isPrevMain = prevPath.current ? (mainPages.includes(prevPath.current) || prevPath.current === currentPath) : true;

        // 2. Trigger Curtain
        if (isCurrentMain && prevPath.current !== currentPath) {
            setIsActive(true);
            setTrigger(t => t + 1); 

            const timer = setTimeout(() => setIsActive(false), 1200);
            
            prevPath.current = currentPath;
            return () => clearTimeout(timer);
        } 
        
        prevPath.current = currentPath;
        setIsActive(false);
        
    }, [url, component]); // Tambahkan component ke dependency

    if (!isActive) return null;

    return (
        <div 
            key={trigger} 
            className="fixed inset-0 z-40 pointer-events-none flex flex-col"
        >
            <div className="absolute inset-0 bg-brand-600 dark:bg-brand-700 animate-curtain-sequence flex items-center justify-center">
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