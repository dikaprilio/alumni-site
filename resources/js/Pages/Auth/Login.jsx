import React, { useState, useEffect } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

export default function Login() {
    // 1. Setup Form Handling
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // 2. Handle Submit
    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    // 3. Animation Load State
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <Head title="Masuk" />

            {/* --- BACKGROUND (Reused from Hero) --- */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                 <img 
                    src="/images/hero-bg.jpg" 
                    alt="Background" 
                    className={`w-full h-full object-cover opacity-20 dark:opacity-30 transition-all duration-1000 ease-out ${loaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'}`}
                />
            </div>
            <div className="absolute inset-0 z-0 bg-grid-slate dark:bg-grid-white opacity-40 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:from-transparent dark:via-slate-900/80 dark:to-slate-900"></div>

            {/* --- LOGIN CARD --- */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl p-8 animate-fade-in-up">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <i className="fa-solid fa-graduation-cap text-3xl text-brand-600 group-hover:scale-110 transition-transform"></i>
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Selamat Datang Kembali</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Masuk untuk mengakses jaringan alumni</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-wider">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white"
                                placeholder="email@alumni.ipb.ac.id"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-wider">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                />
                                <span className="text-slate-600 dark:text-slate-400">Ingat Saya</span>
                            </label>
                            <Link href="#" className="text-brand-600 hover:text-brand-500 font-medium">Lupa Password?</Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-500 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing && <i className="fa-solid fa-circle-notch animate-spin"></i>}
                            Masuk Akun
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-white/5">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-brand-600 font-bold hover:underline">
                                Daftar Alumni
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}