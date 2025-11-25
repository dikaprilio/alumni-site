import React, { useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// MODIFICATION: Menerima 'badges' sebagai prop
export default function Dashboard({ completeness, badges }) {
    const { auth } = usePage().props;
    const alumni = auth.user.alumni;

    // --- TOUR LOGIC ---
    const isUnmounting = React.useRef(false);

    useEffect(() => {
        // Allow forcing tour via URL ?tour=true for testing
        const urlParams = new URLSearchParams(window.location.search);
        const forceTour = urlParams.get('tour') === 'true';

        if (!auth.user.has_seen_tour || forceTour) {
            const isMobile = window.innerWidth < 768;
            // Ensure we target a visible element. If mobile menu is hidden, this might need adjustment.
            // Assuming #mobile-nav-opportunities is accessible or we fallback to something else.
            const navElement = isMobile ? '#mobile-nav-opportunities' : '#nav-opportunities';

            const driverObj = driver({
                showProgress: true,
                animate: true,
                allowClose: false,
                doneBtnText: 'Selesai',
                nextBtnText: 'Lanjut',
                prevBtnText: 'Kembali',
                popoverClass: 'driver-theme-industrial', // Custom Theme Class
                steps: [
                    { 
                        element: '#card-identity', 
                        popover: { 
                            title: 'Selamat Datang!', 
                            description: 'Halo! Ini adalah dashboard pribadimu. Di sini kamu bisa melihat ringkasan profil dan status akunmu.' 
                        } 
                    },
                    { 
                        element: '#card-strength', 
                        popover: { 
                            title: 'Kekuatan Profil', 
                            description: 'Pantau kelengkapan datamu di sini. <br/><br/><strong>PENTING:</strong> Jika mencapai <strong>100%</strong>, kamu berkesempatan menjadi <strong>Alumni of the Month</strong> dan tampil eksklusif di halaman depan!' 
                        } 
                    },
                    { 
                        element: '#btn-edit-data', 
                        popover: { 
                            title: 'Lengkapi Data', 
                            description: 'Klik tombol ini untuk melengkapi data diri, pengalaman kerja, dan skill agar profilmu makin menarik.' 
                        } 
                    },
                    { 
                        element: '#card-privacy', 
                        popover: { 
                            title: 'Kendali Privasi', 
                            description: 'Jaga privasimu. Kamu bisa menyembunyikan email atau nomor HP dari publik di sini.' 
                        } 
                    },
                    { 
                        element: navElement, 
                        popover: { 
                            title: 'Peluang Karir & Mentoring', 
                            description: 'Cari lowongan kerja atau peluang mentoring di menu <strong>Opportunities</strong>. Jangan lupa cek secara berkala!' 
                        } 
                    },
                    { 
                        element: '#btn-preview', 
                        popover: { 
                            title: 'Lihat Profil Publik', 
                            description: 'Penasaran profilmu dilihat orang lain seperti apa? Cek di sini.' 
                        } 
                    },
                ],
                onDestroyed: () => {
                    // Only update status if NOT unmounting (i.e., user finished/closed it)
                    // And don't save if we are just forcing the tour for testing
                    if (!isUnmounting.current && !forceTour) {
                        router.post('/user/tour-completed', {}, { preserveScroll: true });
                    }
                }
            });

            // Small delay to ensure DOM is ready and previous cleanups are done
            const timer = setTimeout(() => {
                driverObj.drive();
            }, 100);

            // Cleanup function to destroy driver instance on unmount
            return () => {
                isUnmounting.current = true; // Flag as unmounting
                clearTimeout(timer);
                driverObj.destroy();
            };
        }
    }, []);

    // --- LOGIC FOR PROFILE STRENGTH CARD ---

    // 1. Logic for Circular Progress Bar (Radius 40, Circumference approx 251.2)
    const circumference = 251.2;
    const dashOffset = circumference * (1 - completeness / 100);
    const radius = 40;

    // 2. Logic for Badge Text (Mengambil badge tertinggi yang dicapai)
    const badgeText = badges.length > 0 ? badges[badges.length - 1] : 'No Badge';
    const badgeClass = completeness === 100 ? 'text-green-500' :
                        completeness >= 80 ? 'text-amber-500' :
                        completeness >= 50 ? 'text-blue-500' : 'text-slate-500';

    // --- REPLACED LOGIC FOR NEXT STEPS (Hanya Mapping dari Server Data) ---
    const getNextSteps = () => {
        const missingFields = alumni.missing_fields || []; // Ambil langsung dari server
        const steps = [];

        // Mapping Field Names ke Structure Link
        const stepMap = {
            'Phone': { label: '+ Phone', title: 'Tambahkan nomor telepon', link: '/alumni/edit' },
            'Address': { label: '+ Address', title: 'Tambahkan alamat', link: '/alumni/edit' },
            'LinkedIn': { label: '+ LinkedIn', title: 'Tambahkan URL LinkedIn', link: '/alumni/edit' },
            'Current Position': { label: '+ Current Job', title: 'Tambahkan pengalaman kerja terbaru', link: '/alumni/edit' },
            'Skills': { label: '+ Skills', title: 'Tambahkan keahlian Anda', link: '/alumni/edit' },
            'Bio': { label: '+ Bio', title: 'Tambahkan deskripsi diri (Bio) Anda', link: '/alumni/edit' },
            'Work History': { label: '+ Work History', title: 'Tambahkan riwayat pekerjaan', link: '/alumni/edit' },
        };

        // Tambahkan Avatar secara eksplisit jika missingFields ada dan avatar belum ada
        if (completeness < 100 && !alumni?.avatar) {
            steps.push({ label: '+ Avatar', link: '/alumni/edit', title: 'Upload foto profil terbaru' });
        }

        // Map missing fields dari server
        missingFields.forEach(field => {
            if (stepMap[field]) {
                steps.push(stepMap[field]);
            }
        });

        return steps.slice(0, 3); // Tampilkan maksimal 3 langkah
    };

    const nextSteps = getNextSteps();

    // Handle Toggle Privacy
    const togglePrivacy = (type, currentValue) => {
        router.post('/alumni/privacy', {
            type: type,
            value: !currentValue,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Reload semua props untuk memastikan data ter-update di frontend
                // Karena auth adalah shared prop, perlu reload semua untuk memastikan ter-update
                router.reload({
                    only: ['auth', 'completeness', 'badges'],
                });
            },
        });
    };

    // Helper Avatar
    const avatarUrl = alumni?.avatar ? `/storage/${alumni.avatar}` : null;
    const initials = auth.user.name.substring(0, 2).toUpperCase();

    return (
        <>
            <Head title="My Account" />

            <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">

                {/* CONTAINER */}
                <div className="max-w-[1000px] mx-auto px-6 md:px-12">

                    {/* --- HEADER --- */}
                    <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <span className="font-mono text-xs tracking-[0.3em] uppercase text-brand-600 dark:text-brand-400 block mb-3">
                                /// SYSTEM ACCESS
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                                My <span className="text-slate-400 dark:text-slate-600">Account</span>
                            </h1>
                        </div>

                        {/* Logout Button (Visible & Accessible) */}
                        <button
                            onClick={() => router.post('/logout')}
                            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                        >
                            Sign Out
                            <i className="fa-solid fa-right-from-bracket transform group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>

                    {/* --- MAIN GRID --- */}
                    {/* Perubahan: Urutan Card ditukar di sini */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* 1. IDENTITY CARD (Sekarang di posisi Kiri/Atas) */}
                        <div id="card-identity" className="col-span-1 md:col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 relative overflow-hidden group rounded-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <i className="fa-solid fa-id-card text-8xl"></i>
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-black text-slate-300">{initials}</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {auth.user.name}
                                    </h2>
                                    <p className="text-brand-600 dark:text-brand-400 font-mono text-sm mb-1">
                                        {alumni?.current_position || 'Job Title Not Set'}
                                    </p>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider">
                                        {auth.user.email}
                                    </p>
                                </div>

                                {/* Action */}
                                <Link
                                    id="btn-edit-data"
                                    href="/alumni/edit"
                                    className="w-full mt-4 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-brand-600 dark:hover:bg-brand-400 hover:text-white transition-all shadow-lg rounded-xl"
                                >
                                    Edit Data
                                </Link>
                            </div>
                        </div>

                        {/* 2. PROFILE STRENGTH CARD (Perbaikan: p-4 sudah diterapkan, fokus pada internal spacing) */}
                        <div id="card-strength" className="col-span-1 md:col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-center">                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <i className="fa-solid fa-star text-9xl"></i>
                            </div>
                            
                            {/* KUNCI PERBAIKAN: Menggunakan 'items-center' agar vertikal seimbang, dan mengurangi gap */}
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-center h-full"> 
                                
                                {/* Circular Progress Bar (Scaled Up to w-32) */}
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    {/* Added viewBox to allow scaling */}
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                                        <circle 
                                            cx={radius + 8} cy={radius + 8} r={radius} 
                                            stroke="currentColor" strokeWidth="8" fill="transparent" 
                                            className="text-slate-100 dark:text-slate-800"
                                        ></circle>
                                        <circle 
                                            cx={radius + 8} cy={radius + 8} r={radius} 
                                            stroke="currentColor" strokeWidth="8" fill="transparent" 
                                            strokeDasharray={circumference} strokeDashoffset={dashOffset} 
                                            className={`transition-all duration-1000 ease-out ${badgeClass}`}
                                            style={{ transitionProperty: 'stroke-dashoffset' }}
                                        ></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">{completeness}%</span>
                                    </div>
                                </div>

                                {/* Info & Next Steps */}
                                <div className="flex-1 text-left"> 
                                    
                                    {/* Judul & Badge */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Profile Strength</h3>
                                        {badgeText !== 'No Badge' && (
                                            <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest border border-current bg-opacity-10 ${badgeClass}`}>
                                                {badgeText}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Deskripsi */}
                                    <p className="text-base text-slate-500 dark:text-slate-400 mb-4 leading-relaxed"> 
                                        Lengkapi profil Anda untuk mengaktifkan visibilitas di direktori alumni dan membuka *badge* spesial.
                                    </p>
                                    
                                    {/* Langkah Berikut */}
                                    {nextSteps.length > 0 && (
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Langkah Berikut:</span>
                                            {nextSteps.map(step => (
                                                <Link 
                                                    key={step.label}
                                                    href={step.link}
                                                    title={step.title}
                                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase rounded hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors cursor-help"
                                                >
                                                    {step.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* 3. PRIVACY SETTINGS (Tidak berubah) */}
                        <div id="card-privacy" className="col-span-1 md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <i className="fa-solid fa-shield-halved"></i>
                                <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Privacy Controls</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Toggle Email */}
                                <PrivacyToggle
                                    label="Hide Email Address"
                                    desc="Sembunyikan email dari publik di halaman direktori."
                                    checked={alumni?.private_email}
                                    onChange={() => togglePrivacy('email', alumni?.private_email)}
                                />

                                {/* Toggle Phone */}
                                <PrivacyToggle
                                    label="Hide Phone Number"
                                    desc="Sembunyikan tombol WhatsApp dari publik."
                                    checked={alumni?.private_phone}
                                    onChange={() => togglePrivacy('phone', alumni?.private_phone)}
                                />
                            </div>
                        </div>

                        {/* 4. QUICK SHORTCUTS (Tidak berubah) */}
                        <div className="col-span-1 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Preview Button */}
                            <Link
                                id="btn-preview"
                                href={`/directory/${alumni?.id}`}
                                className="group flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all rounded-2xl"
                            >
                                <i className="fa-solid fa-eye text-2xl text-slate-400 group-hover:text-brand-500 mb-4 transition-colors"></i>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Public Preview</h4>
                                    <p className="text-xs text-slate-500 mt-1">Lihat profil sebagai tamu.</p>
                                </div>
                            </Link>

                            {/* Security Button */}
                            <Link
                                href="/alumni/settings"
                                className="group flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all rounded-2xl"
                            >
                                <i className="fa-solid fa-lock text-2xl text-slate-400 group-hover:text-brand-500 mb-4 transition-colors"></i>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Security</h4>
                                    <p className="text-xs text-slate-500 mt-1">Ganti Password / Email.</p>
                                </div>
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

// --- SUB COMPONENT: TOGGLE SWITCH (Tidak berubah) ---
function PrivacyToggle({ label, desc, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{label}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[250px]">{desc}</p>
            </div>

            <button
                onClick={onChange}
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0
                    ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}
                `}
            >
                <div className={`
                    absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}></div>
            </button>
        </div>
    );
}

// GUNAKAN PUBLIC LAYOUT
Dashboard.layout = page => <PublicLayout children={page} />;