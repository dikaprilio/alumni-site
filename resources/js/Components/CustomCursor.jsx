import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Sembunyikan saat awal load/keluar window

    // Refs untuk animasi smooth tanpa re-render berlebihan
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const onMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const onMouseLeave = () => setIsVisible(false);
        const onMouseEnter = () => setIsVisible(true);

        // Deteksi Hover pada elemen interaktif
        const onHoverStart = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            }
        };
        
        const onHoverEnd = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseout', onMouseLeave);
        window.addEventListener('mouseover', onMouseEnter);
        
        // Global hover listener
        document.addEventListener('mouseover', onHoverStart);
        document.addEventListener('mouseout', onHoverEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseout', onMouseLeave);
            window.removeEventListener('mouseover', onMouseEnter);
            document.removeEventListener('mouseover', onHoverStart);
            document.removeEventListener('mouseout', onHoverEnd);
        };
    }, [isVisible]);

    // Logic untuk Follower (Lingkaran besar) agar smooth delay
    // Kita update posisi via CSS transform langsung di elemen DOM
    // Agar performa 60fps
    useEffect(() => {
        let animationFrame;
        
        // Koordinat saat ini untuk follower (untuk efek lerp/delay)
        let followerX = 0;
        let followerY = 0;

        const animateFollower = () => {
            // Linear Interpolation (Lerp) untuk delay effect (0.1 adalah speed)
            followerX += (mousePos.x - followerX) * 0.15;
            followerY += (mousePos.y - followerY) * 0.15;

            if (followerRef.current) {
                followerRef.current.style.transform = `translate3d(${followerX - 16}px, ${followerY - 16}px, 0)`;
            }
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${mousePos.x - 4}px, ${mousePos.y - 4}px, 0)`;
            }

            animationFrame = requestAnimationFrame(animateFollower);
        };

        animateFollower();

        return () => cancelAnimationFrame(animationFrame);
    }, [mousePos]); // Dependensi mousePos agar target terupdate

    if (typeof window === 'undefined') return null; // SSR check

    return (
        <>
            {/* MAIN DOT (Instant) */}
            <div 
                ref={cursorRef}
                className={`fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* FOLLOWER RING (Delayed + Retro Crosshair Style) */}
            <div 
                ref={followerRef}
                className={`
                    fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out
                    border border-white rounded-full flex items-center justify-center
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                    ${isHovering ? 'w-16 h-16 bg-white/20 border-transparent' : 'w-8 h-8'}
                `}
            >
                {/* Crosshair lines (Muncul hanya saat TIDAK hover link) */}
                <div className={`absolute w-full h-[1px] bg-white transition-all duration-300 ${isHovering ? 'opacity-0 scale-0' : 'opacity-50 scale-100'}`}></div>
                <div className={`absolute h-full w-[1px] bg-white transition-all duration-300 ${isHovering ? 'opacity-0 scale-0' : 'opacity-50 scale-100'}`}></div>
            </div>
        </>
    );
}