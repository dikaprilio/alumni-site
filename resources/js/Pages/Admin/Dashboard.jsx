import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useCounter } from '../../Hooks/useCounter'; // Import Hook
import Skeleton from '../../Components/Skeleton';     // Import Skeleton

// --- UTILS ---
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
};

const downloadCardAsPng = async (elementId, title) => {
    const element = document.getElementById(elementId);
    if (!element) {
        alert("Elemen grafik tidak ditemukan.");
        return;
    }

    if (!window.htmlToImage) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
        script.onload = () => capture(element, title);
        script.onerror = () => alert("Gagal memuat library gambar. Periksa koneksi internet.");
        document.head.appendChild(script);
    } else {
        capture(element, title);
    }

    function capture(el, filename) {
        const isDark = document.documentElement.classList.contains('dark');
        const bgColor = isDark ? '#0f172a' : '#ffffff'; 

        window.htmlToImage.toPng(el, { 
            backgroundColor: bgColor,
            filter: (node) => !node.classList?.contains('download-btn'),
            pixelRatio: 2,
            cacheBust: true,
        }).then(dataUrl => {
            const link = document.createElement('a');
            link.download = `${filename}_${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
        }).catch(err => {
            console.error("Download error:", err);
            alert("Gagal menyimpan gambar.");
        });
    }
};

const CARD_THEMES = {
    blue: { 
        bg: 'bg-blue-50 dark:bg-blue-900/20', 
        text: 'text-blue-600 dark:text-blue-400', 
        decor: 'bg-blue-500',
        iconBg: 'bg-blue-100 dark:bg-blue-800',
        iconText: 'text-blue-600 dark:text-blue-300' 
    },
    purple: { 
        bg: 'bg-purple-50 dark:bg-purple-900/20', 
        text: 'text-purple-600 dark:text-purple-400', 
        decor: 'bg-purple-500',
        iconBg: 'bg-purple-100 dark:bg-purple-800',
        iconText: 'text-purple-600 dark:text-purple-300'
    },
    teal: { 
        bg: 'bg-teal-50 dark:bg-teal-900/20', 
        text: 'text-teal-600 dark:text-teal-400', 
        decor: 'bg-teal-500',
        iconBg: 'bg-teal-100 dark:bg-teal-800',
        iconText: 'text-teal-600 dark:text-teal-300'
    },
    rose: { 
        bg: 'bg-rose-50 dark:bg-rose-900/20', 
        text: 'text-rose-600 dark:text-rose-400', 
        decor: 'bg-rose-500',
        iconBg: 'bg-rose-100 dark:bg-rose-800',
        iconText: 'text-rose-600 dark:text-rose-300'
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        text: 'text-indigo-600 dark:text-indigo-400',
        decor: 'bg-indigo-500',
        iconBg: 'bg-indigo-100 dark:bg-indigo-800',
        iconText: 'text-indigo-600 dark:text-indigo-300'
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400',
        decor: 'bg-amber-500',
        iconBg: 'bg-amber-100 dark:bg-amber-800',
        iconText: 'text-amber-600 dark:text-amber-300'
    }
};

const DownloadButton = ({ targetId, fileName }) => (
    <button 
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadCardAsPng(targetId, fileName);
        }}
        className="download-btn absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm rounded-lg transition-all opacity-0 group-hover:opacity-100 z-50 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600 hover:scale-110 active:scale-95"
        title="Download PNG"
    >
        <i className="fa-solid fa-download text-[10px] pointer-events-none"></i>
    </button>
);

const NotificationDropdown = ({ notifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 ${isOpen ? 'ring-2 ring-pink-500/20' : ''}`}
            >
                <i className={`fa-regular fa-bell text-lg transition-transform ${isOpen ? 'rotate-12' : ''}`}></i>
                {notifications.length > 0 && (
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">Notifikasi</h4>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                            {notifications.length} Baru
                        </span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((notif, idx) => (
                                <div key={idx} className="p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-default group">
                                    <div className="flex gap-3">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125 ${
                                            notif.priority === 'high' ? 'bg-rose-500 shadow-sm shadow-rose-500/50' : 'bg-blue-500'
                                        }`}></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">{notif.title}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{notif.desc}</p>
                                            <p className="text-[9px] text-slate-400 mt-1.5 font-mono">{notif.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <i className="fa-regular fa-circle-check text-3xl text-slate-300 mb-2 block"></i>
                                <span className="text-xs text-slate-400">Tidak ada notifikasi baru</span>
                            </div>
                        )}
                    </div>
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button onClick={() => setIsOpen(false)} className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const StatCard = ({ id, title, value, subValue, icon, color = 'blue', trend, loading }) => {
    const theme = CARD_THEMES[color] || CARD_THEMES.blue;
    const animatedValue = useCounter(loading ? 0 : value, 1500);

    return (
        <div id={id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
            <DownloadButton targetId={id} fileName={title.replace(/\s+/g, '_')} />
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${theme.decor} opacity-5 dark:opacity-10 group-hover:scale-125 transition-transform duration-700 blur-2xl`}></div>
            <div className="relative z-10 flex justify-between items-start">
                <div className="pr-6">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{title}</p>
                    {loading ? (
                        <Skeleton height="2.25rem" width="60%" className="mb-3 rounded-lg" />
                    ) : (
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-3">
                            {animatedValue.toLocaleString()}
                        </h3>
                    )}
                    {loading ? (
                        <Skeleton height="1.25rem" width="40%" className="rounded-md" />
                    ) : subValue && (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 text-slate-500'}`}>
                            {trend === 'up' && <i className="fa-solid fa-arrow-trend-up animate-bounce-small"></i>}
                            <span>{subValue}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${theme.iconBg} ${theme.iconText} transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                    <i className={icon}></i>
                </div>
            </div>
        </div>
    );
};

const GrowthChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-80 flex items-center justify-center"><Skeleton width="100%" height="100%" className="rounded-xl" /></div>;
    }
    if (!data || data.length === 0) return <div className="h-80 flex items-center justify-center text-xs text-slate-400 italic">Belum ada data</div>;

    const maxVal = Math.max(...data.map(d => d.count)) || 10;
    const chartData = data.length === 1 ? [...data, ...data] : data; 
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - ((d.count / maxVal) * 80); 
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative h-80 w-full mt-4 animate-fade-in">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M0,100 ${points} 100,100`} fill="url(#chartGradient)" className="transition-all duration-1000 ease-out" />
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" strokeLinecap="round" className="transition-all duration-1000 ease-out chart-line-draw" />
                {chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 100;
                    const y = 100 - ((d.count / maxVal) * 80);
                    return (
                        <circle key={i} cx={x} cy={y} r="3" className="fill-white stroke-blue-600 stroke-2 hover:r-5 transition-all duration-300 cursor-pointer hover:fill-blue-50" />
                    );
                })}
            </svg>
            <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-mono uppercase">
                <span>{chartData[0]?.month_name}</span>
                <span>{chartData[chartData.length - 1]?.month_name}</span>
            </div>
        </div>
    );
};

const CareerStats = ({ id, stats, topPositions, loading }) => {
    const rate = useCounter(loading ? 0 : stats.rate || 0, 2000);
    const maxPosValue = topPositions.length > 0 ? Math.max(...topPositions.map(p => p.total)) : 1;

    return (
        <div id={id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative group">
            <DownloadButton targetId={id} fileName="Statistik_Karir" />
            <div className="flex justify-between items-center mb-6 pr-8">
                <h3 className="text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2">
                    <i className="fa-solid fa-briefcase text-emerald-500"></i> Insight Karir
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                    {loading ? (
                        <Skeleton variant="circle" width="7rem" height="7rem" />
                    ) : (
                        <div className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-inner animate-scale-in"
                             style={{ background: `conic-gradient(#3b82f6 ${rate}%, #f1f5f9 ${rate}% 100%)` }}>
                            <div className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 pointer-events-none"
                                 style={{ background: `conic-gradient(#3b82f6 ${rate}%, #1e293b ${rate}% 100%)` }}></div>
                            <div className="absolute inset-3 bg-white dark:bg-slate-900 rounded-full flex flex-col items-center justify-center z-10 shadow-sm">
                                <span className="text-xl font-black text-slate-800 dark:text-white">{rate}%</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Bekerja</span>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 mt-4 w-full justify-center">
                        <div className="text-center">
                            {loading ? <Skeleton width="2rem" height="1rem" className="mx-auto mb-1" /> : <p className="text-sm font-bold text-slate-800 dark:text-white">{stats.employed}</p>}
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider">Kerja</p>
                        </div>
                        <div className="w-px bg-slate-200 dark:bg-slate-800 h-6"></div>
                        <div className="text-center">
                            {loading ? <Skeleton width="2rem" height="1rem" className="mx-auto mb-1" /> : <p className="text-sm font-bold text-slate-400">{stats.unemployed}</p>}
                            <p className="text-[8px] text-slate-500 uppercase tracking-wider">Belum</p>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-8 space-y-3 w-full">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-800 pb-1 mb-2">
                        Top Profesi
                    </p>
                    {loading ? (
                        <>
                            <Skeleton width="100%" height="1.5rem" className="rounded-full" />
                            <Skeleton width="80%" height="1.5rem" className="rounded-full" />
                            <Skeleton width="60%" height="1.5rem" className="rounded-full" />
                        </>
                    ) : topPositions.length > 0 ? topPositions.map((pos, idx) => (
                        <div key={idx} className="group/item animate-fade-in-left" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-slate-700 dark:text-slate-300 font-medium truncate pr-2">{pos.current_position}</span>
                                <span className="text-slate-500 font-mono">{pos.total}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full group-hover/item:bg-emerald-400 transition-all duration-1000 ease-out"
                                    style={{ width: `${(pos.total / maxPosValue) * 100}%` }}></div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-2 text-slate-400 text-[10px] italic">Belum ada data.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard({ stats, chartData, careerStats, topPositions, monthlyGrowth, activityLog, notifications }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const graduationData = chartData || [];
    const maxGradValue = graduationData.length > 0 ? Math.max(...graduationData.map(d => d.total), 1) : 1;

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            {/* PAGE HEADER */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-down">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Dashboard <span className="text-pink-600">.</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pantau performa & statistik alumni secara real-time.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <NotificationDropdown notifications={notifications} />
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>
                    <Link href="/" className="bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 border border-pink-100 hover:border-pink-200 px-5 py-2.5 rounded-full font-bold shadow-sm transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 text-xs">
                        Website <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </Link>
                </div>
            </div>

            {/* 1. STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard id="stat-alumni" title="TOTAL ALUMNI" value={stats.alumni.total} subValue={stats.alumni.new > 0 ? `+${stats.alumni.new} Baru` : null} trend="up" icon="fa-solid fa-user-graduate" color="blue" loading={loading} />
                {/* OPPORTUNITIES CARD (Replaced Jobs) */}
                <StatCard id="stat-opps" title="PELUANG KARIR" value={stats.opportunities.total} subValue={stats.opportunities.new > 0 ? `+${stats.opportunities.new} Bulan Ini` : null} trend="up" icon="fa-solid fa-briefcase" color="purple" loading={loading} />
                <StatCard id="stat-events" title="AGENDA KEGIATAN" value={stats.events} icon="fa-solid fa-calendar-check" color="teal" loading={loading} />
                <StatCard id="stat-pending" title="USER PENDING" value={stats.pending} subValue={stats.pending > 0 ? "Butuh Verifikasi" : "Aman"} icon="fa-solid fa-user-clock" color="rose" loading={loading} />
            </div>

            {/* 2. MAIN LAYOUT GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN (Charts & Data) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="chart-graduation" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative group overflow-visible">
                            <DownloadButton targetId="chart-graduation" fileName="Distribusi_Tahun_Lulus" />
                            <div className="mb-6 flex justify-between items-start pr-8">
                                <div>
                                    <h3 className="text-slate-800 dark:text-white font-bold text-sm">Tahun Kelulusan</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sebaran Alumni</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <i className="fa-solid fa-chart-column"></i>
                                </div>
                            </div>
                            <div className="h-80 flex items-end gap-3">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} width="20%" height={`${Math.random() * 60 + 20}%`} className="rounded-t-md" />
                                    ))
                                ) : graduationData.length > 0 ? graduationData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end relative hover:z-20 animate-grow-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        <div className="w-full bg-indigo-200 dark:bg-indigo-600 hover:bg-indigo-500 dark:hover:bg-indigo-500 rounded-t-md transition-all relative duration-500" style={{ height: `${(data.total / maxGradValue) * 80}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10 pointer-events-none">
                                                {data.total} Lulusan
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                            </div>
                                        </div>
                                        <div className="text-[9px] font-mono text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {data.graduation_year}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs italic border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">Belum Ada Data</div>
                                )}
                            </div>
                        </div>

                        <div id="chart-growth" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative group">
                            <DownloadButton targetId="chart-growth" fileName="Tren_Pendaftaran_User" />
                            <div className="flex justify-between items-start mb-2 pr-8">
                                <div>
                                    <h3 className="text-slate-800 dark:text-white font-bold text-sm">Tren Pendaftaran</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">6 Bulan Terakhir</p>
                                </div>
                                <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1 animate-pulse-slow">
                                    <i className="fa-solid fa-arrow-trend-up"></i> Live
                                </div>
                            </div>
                            <GrowthChart data={monthlyGrowth} loading={loading} />
                        </div>
                    </div>
                    <CareerStats id="chart-career" stats={careerStats} topPositions={topPositions} loading={loading} />
                </div>

                {/* RIGHT COLUMN (Logs & Quick Access) */}
                <div className="space-y-6">

                    {/* QUICK SHORTCUTS - MODIFIED */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                        <h3 className="text-slate-700 dark:text-white font-bold text-sm mb-3">Jalan Pintas</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href={route('admin.news.create')} className="bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/50 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all group shadow-sm h-24 active:scale-95">
                                <i className="fa-solid fa-pen-nib text-amber-500 group-hover:scale-110 transition-transform text-lg group-hover:rotate-12"></i>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300">Tulis Berita</span>
                            </Link>

                            {/* REPLACED LINK: Manage Opportunities */}
                            <Link href={route('admin.opportunities.index')} className="bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500/50 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all group shadow-sm h-24 active:scale-95">
                                <i className="fa-solid fa-list-check text-purple-500 group-hover:scale-110 transition-transform text-lg"></i>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-300">Kelola Peluang</span>
                            </Link>
                            
                            <Link href={route('admin.alumni.create')} className="bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all group shadow-sm h-24 active:scale-95">
                                <i className="fa-solid fa-user-plus text-blue-500 group-hover:scale-110 transition-transform text-lg"></i>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">Input Alumni</span>
                            </Link>
                            <Link href={route('admin.alumni.export')} className="bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50 p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all group shadow-sm h-24 active:scale-95">
                                <i className="fa-solid fa-file-export text-emerald-500 group-hover:scale-110 transition-transform text-lg group-hover:translate-x-1"></i>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">Export Data</span>
                            </Link>
                        </div>
                    </div>

                    {/* ACTIVITY LOG - REAL DATA */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2">
                                <i className="fa-solid fa-clock-rotate-left text-amber-500"></i> Aktivitas Terbaru
                            </h3>
                            <Link href={route('admin.logs.index')} className="text-[10px] text-blue-500 hover:text-blue-600 font-bold hover:underline">Lihat Semua</Link>
                        </div>
                        
                        <div className="relative space-y-6 pl-2">
                            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800"></div>
                            {loading ? (
                                <p className="text-xs text-slate-400 pl-6">Memuat...</p>
                            ) : activityLog.length > 0 ? (
                                activityLog.map((log, idx) => (
                                    <div key={idx} className="relative pl-6 group animate-fade-in-left" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 z-10 flex items-center justify-center text-[8px] bg-slate-100 dark:bg-slate-800 shadow-sm`}>
                                            <i className={`fa-solid ${log.icon} ${log.color}`}></i>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-2">
                                                {log.message}
                                            </p>
                                            <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                                                {timeAgo(log.time)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-xs text-center pl-4 italic">Belum ada aktivitas.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}