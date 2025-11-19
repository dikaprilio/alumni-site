import React, { useState, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function RegisterStep2({ nim, nama }) {
    const { data, setData, post, processing, errors } = useForm({
        nim: nim, // Hidden field logic
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <Head title="Lengkapi Data Alumni" />

             {/* Background */}
             <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/images/hero-bg.jpg" alt="Background" className={`w-full h-full object-cover opacity-20 dark:opacity-30 transition-all duration-1000 ease-out ${loaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'}`}/>
            </div>
            <div className="absolute inset-0 z-0 bg-grid-slate dark:bg-grid-white opacity-40 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:from-transparent dark:via-slate-900/80 dark:to-slate-900"></div>


            <div className="relative z-10 w-full max-w-md px-6 py-10">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl p-8 animate-fade-in-up">
                    
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Halo, {nama}!</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                            Langkah 2: Lengkapi email dan password untuk akun Anda.
                        </p>
                    </div>

                    {/* Progress Bar (Full) */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mb-6 overflow-hidden">
                        <div className="bg-brand-600 h-1.5 rounded-full w-full transition-all duration-500"></div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* Readonly Data Info */}
                        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-500 dark:text-slate-400">NIM</span>
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{nim}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Nama</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-right">{nama}</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wider">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white" placeholder="email@anda.com" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wider">Password</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white" placeholder="••••••••" />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                         {/* Confirm Password */}
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wider">Konfirmasi Password</label>
                            <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all dark:text-white" placeholder="••••••••" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-500 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 mt-2"
                        >
                            {processing ? 'Membuat Akun...' : 'Selesaikan Pendaftaran'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}