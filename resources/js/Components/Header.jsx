// resources/js/Components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react'; // 1. Import usePage

export default function Header() {
    const { url } = usePage(); // 2. Get the current URL from Inertia
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 w-full z-50 flex justify-center pointer-events-none pt-4 md:pt-6 px-4">
            <nav 
                className={`
                    navbar-transition pointer-events-auto flex items-center justify-between
                    ${isScrolled 
                        ? 'w-[90%] md:w-[85%] max-w-6xl rounded-full navbar-glass py-3 px-6 mt-2 text-slate-800' 
                        : 'w-full max-w-7xl bg-transparent py-4 px-4 md:px-8 text-white'
                    }
                `}
            >
                {/* Logo Section */}
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors ${isScrolled ? 'bg-brand-50 text-brand-600' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                            <i className="fa-solid fa-graduation-cap text-sm md:text-lg"></i>
                        </div>
                        <span className={`text-lg md:text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
                            Alumni<span className={isScrolled ? 'text-brand-600' : 'text-brand-200'}>TPL</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full backdrop-blur-[2px] border border-white/10" 
                     style={isScrolled ? { background: 'transparent', border: 'none', backdropFilter: 'none' } : {}}>
                    
                    {/* 3. FIX: Check URL string instead of using route() */}
                    <NavLink href="/" active={url === '/'} isScrolled={isScrolled}>Home</NavLink>
                    <NavLink href="/study" active={url.startsWith('/study')} isScrolled={isScrolled}>Program Studi</NavLink>
                    <NavLink href="/alumni" active={url.startsWith('/alumni')} isScrolled={isScrolled}>Alumni</NavLink>
                    <NavLink href="/news" active={url.startsWith('/news')} isScrolled={isScrolled}>Berita</NavLink>
                    <NavLink href="/about" active={url.startsWith('/about')} isScrolled={isScrolled}>Tentang</NavLink>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className={`
                            px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
                            ${isScrolled 
                                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/30' 
                                : 'bg-white text-brand-600 hover:bg-brand-50 shadow-black/10'
                            }
                        `}
                    >
                        Masuk
                    </Link>
                </div>
            </nav>
        </div>
    );
}

// Custom NavLink Component
function NavLink({ href, children, active = false, isScrolled }) {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200";
    
    const scrollColor = isScrolled ? "text-slate-600 hover:bg-slate-100 hover:text-brand-600" : "text-white/80 hover:text-white hover:bg-white/10";
    const activeColor = isScrolled ? "bg-brand-50 text-brand-600" : "bg-white/20 text-white shadow-inner";

    return (
        <Link
            href={href}
            className={`${baseClasses} ${active ? activeColor : scrollColor}`}
        >
            {children}
        </Link>
    );
}