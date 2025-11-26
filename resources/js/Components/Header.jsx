import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header() {
    // 1. Ambil props 'auth' dari Inertia untuk cek status login
    const { url, props } = usePage();
    const { auth } = props;

    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            {/* --- 1. TOP HEADER --- */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
                <nav
                    className={`
                        pointer-events-auto flex items-center justify-between
                        transition-all duration-500 ease-in-out border
                        ${isScrolled
                            ? 'w-[95%] md:w-[85%] max-w-6xl py-3 px-6 rounded-full shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-white/20 dark:border-slate-700'
                            : 'w-full max-w-7xl py-4 px-4 bg-transparent border-transparent'
                        }
                    `}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                        <div
                            className={`
                                w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden
                                ${isScrolled
                                    ? `
                                        bg-white/80 text-slate-900
                                        dark:bg-white/10 dark:text-white backdrop-blur-md shadow-md
                                    `
                                    : `
                                        bg-transparent text-slate-900
                                        dark:bg-white/10 dark:text-white backdrop-blur-md
                                    `
                                }
                            `}
                        >
                            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        </div>

                        <span className={`
                            text-xl font-bold tracking-tight transition-colors duration-500
                            ${isScrolled
                                ? 'text-slate-800 dark:text-white'
                                : 'text-slate-800 dark:text-white'
                            }
                        `}>
                            Alumni<span className="text-brand-600">TPL</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex relative items-center justify-center">
                        <div className={`
                                    absolute inset-0 rounded-full transition-opacity duration-500 ease-in-out
                                    bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/10
                                    ${isScrolled ? 'opacity-0' : 'opacity-100'}
                                `}></div>

                        <div className="relative z-10 flex items-center gap-1 px-2 py-1.5">
                            <NavLink href="/" active={url === '/'} isScrolled={isScrolled} isDark={isDark}>Home</NavLink>
                            <a 
                                href="https://tracerstudy.ipb.ac.id/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    isScrolled
                                        ? 'text-slate-600 hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800'
                                        : 'text-slate-700 hover:bg-white/50 hover:text-brand-700 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
                                }`}
                            >
                                Tracer Study
                            </a>
                            <NavLink href="/directory" active={url.startsWith('/directory')} isScrolled={isScrolled} isDark={isDark}>Alumni</NavLink>
                            <NavLink href="/opportunities" active={url.startsWith('/opportunities')} isScrolled={isScrolled} isDark={isDark} id="nav-opportunities">Karir</NavLink>
                            <NavLink href="/news" active={url.startsWith('/news')} isScrolled={isScrolled} isDark={isDark}>Berita</NavLink>
                        </div>
                    </div>

                    {/* Actions: Toggle & Auth Status */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={`
                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border
                                ${isScrolled
                                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-yellow-400'
                                    : 'bg-white/50 border-white/20 text-slate-700 hover:bg-white dark:bg-white/10 dark:text-yellow-300 dark:border-white/10'
                                }
                            `}
                            aria-label="Toggle Dark Mode"
                        >
                            {isDark ? (
                                <i className="fa-solid fa-sun text-lg animate-spin-slow"></i>
                            ) : (
                                <i className="fa-solid fa-moon text-lg"></i>
                            )}
                        </button>

                        {/* KONDISIONAL AUTH BUTTON (Desktop) */}
                        {auth?.user ? (
                            <Link
                                href="/alumni"
                                className={`
                                    hidden md:flex items-center gap-3 px-2 py-1.5 pr-4 rounded-full transition-all duration-300 border group
                                    ${isScrolled
                                        ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700'
                                        : 'bg-white/50 border-white/20 backdrop-blur-md hover:bg-white/80 dark:bg-white/10 dark:border-white/10'
                                    }
                                `}
                            >
                                {/* AVATAR LOGIC: Cek jika ada avatar di data alumni */}
                                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-md group-hover:scale-110 transition-transform overflow-hidden">
                                    {auth.user.alumni && auth.user.alumni.avatar ? (
                                        <img
                                            src={`/storage/${auth.user.alumni.avatar}`}
                                            alt={auth.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getInitials(auth.user.name)
                                    )}
                                </div>
                                <span className={`text-sm font-semibold max-w-[100px] truncate ${isScrolled ? 'text-slate-700 dark:text-slate-200' : 'text-slate-800 dark:text-white'}`}>
                                    {auth.user.name.split(' ')[0]}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* --- 2. MOBILE BOTTOM NAVBAR --- */}
            <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <nav className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-2xl shadow-2xl shadow-black/10 flex items-center gap-1 p-2 w-full max-w-sm justify-between">

                    <MobileLink href="/" active={url === '/'} icon="fa-house">Home</MobileLink>
                    <MobileLink href="/directory" active={url.startsWith('/directory')} icon="fa-user-graduate">Alumni</MobileLink>
                    <MobileLink href="/opportunities" active={url.startsWith('/opportunities')} icon="fa-briefcase" id="mobile-nav-opportunities">Karir</MobileLink>
                    <MobileLink href="/news" active={url.startsWith('/news')} icon="fa-newspaper">Berita</MobileLink>

                    {/* KONDISIONAL AUTH BUTTON (Mobile) */}
                    {auth?.user ? (
                        <MobileLink
                            href="/alumni"
                            active={url.startsWith('/alumni')}
                            icon="fa-user-circle"
                            isProfile={true}
                            customClass="text-brand-600 dark:text-brand-400"
                        >
                            Akun
                        </MobileLink>
                    ) : (
                        <MobileLink
                            href="/login"
                            active={url.startsWith('/login')}
                            icon="fa-right-to-bracket"
                            isProfile={true}
                        >
                            Masuk
                        </MobileLink>
                    )}

                </nav>
            </div>
        </>
    );
}

function NavLink({ href, children, active, isScrolled, isDark, ...props }) {
    let classes = "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ";
    if (active) {
        classes += "bg-brand-600 text-white shadow-md shadow-brand-500/20";
    } else {
        if (isScrolled) {
            classes += "text-slate-600 hover:bg-slate-100 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800";
        } else {
            classes += "text-slate-700 hover:bg-white/50 hover:text-brand-700 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white";
        }
    }
    return <Link href={href} className={classes} {...props}>{children}</Link>;
}

function MobileLink({ href, icon, children, active, isProfile, customClass, ...props }) {
    return (
        <Link
            href={href}
            className={`
                flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all duration-300
                ${active
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300'
                }
                ${isProfile ? 'bg-slate-100 dark:bg-slate-800 ml-1' : ''}
                ${customClass || ''}
            `}
            {...props}
        >
            <i className={`fa-solid ${icon} text-xl mb-0.5 ${isProfile && !active ? 'text-slate-700 dark:text-slate-300' : ''}`}></i>
            <span className="text-[10px] font-medium">{children}</span>
        </Link>
    );
}