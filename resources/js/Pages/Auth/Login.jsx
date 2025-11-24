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
        <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors duration-500">
            <Head title="Masuk" />

            {/* --- LEFT SIDE: IMAGE & WELCOME (Desktop Only) --- */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className={`absolute inset-0 z-0 transition-transform duration-[2000ms] ease-out ${loaded ? 'scale-105' : 'scale-100'}`}>
                    <img
                        src="/images/hero-bg.jpg"
                        alt="Campus Life"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>

                <div className="relative z-20 flex flex-col justify-end p-16 text-white h-full">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-600/30">
                            <i className="fa-solid fa-graduation-cap text-3xl"></i>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
                            Selamat Datang <br />
                            <span className="text-brand-400">Alumni</span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                            Terhubung kembali dengan almamater, temukan peluang karir, dan bangun jaringan profesional Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px]">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            ))}
                        </div>
                        <p>Bergabung dengan 1000+ Alumni lainnya</p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
                {/* Mobile Background (Subtle) */}
                <div className="absolute inset-0 lg:hidden z-0">
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f615,transparent)]"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Header Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 rounded-xl shadow-lg shadow-brand-600/30 mb-4">
                            <i className="fa-solid fa-graduation-cap text-2xl text-white"></i>
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Selamat Datang Kembali</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Masuk untuk mengakses akun Anda</p>
                    </div>

                    {/* Desktop Header Text */}
                    <div className="hidden lg:block mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Login Akun</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Masukan kredensial Anda untuk melanjutkan.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <i className="fa-regular fa-envelope"></i>
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white font-medium"
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <Link href="/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-500 hover:underline">
                                    Lupa Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i> {errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 transition-all checked:border-brand-500 checked:bg-brand-500 hover:border-brand-400"
                                    />
                                    <i className="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 text-xs pointer-events-none transition-opacity"></i>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Ingat Saya</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-600/20 hover:bg-brand-500 hover:shadow-brand-600/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Masuk Sekarang <i className="fa-solid fa-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400">
                            Belum memiliki akun?{' '}
                            <Link href="/register" className="text-brand-600 font-bold hover:text-brand-500 hover:underline transition-colors">
                                Daftar Alumni
                            </Link>
                        </p>
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-400">
                            &copy; {new Date().getFullYear()} Alumni TPL. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}