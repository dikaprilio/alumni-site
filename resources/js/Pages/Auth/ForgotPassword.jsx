import React, { useState, useEffect } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <Head title="Lupa Password" />

             {/* Background Layers */}
             <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/images/hero-bg.jpg" alt="Background" className={`w-full h-full object-cover opacity-20 dark:opacity-30 transition-all duration-1000 ease-out ${loaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'}`}/>
            </div>
            <div className="absolute inset-0 z-0 bg-grid-slate dark:bg-grid-white opacity-40 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:from-transparent dark:via-slate-900/80 dark:to-slate-900"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl p-8 animate-fade-in-up">
                    
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400 text-2xl shadow-inner">
                            <i className="fa-solid fa-key"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Lupa Password?</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 px-4">
                            Masukkan email Anda, kami akan mengirimkan link untuk mereset password Anda.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-200 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-wider">Email Terdaftar</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white"
                                placeholder="email@alumni.ipb.ac.id"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-500 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-slate-500 hover:text-brand-600 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <i className="fa-solid fa-arrow-left text-xs"></i> Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}