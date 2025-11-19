import React, { useState, useEffect } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    const logout = (e) => {
        e.preventDefault();
        post('/logout');
    };

    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <Head title="Verifikasi Email" />

             {/* Background Layers */}
             <div className="absolute inset-0 z-0 overflow-hidden">
                 <img src="/images/hero-bg.jpg" alt="Background" className={`w-full h-full object-cover opacity-20 dark:opacity-30 transition-all duration-1000 ease-out ${loaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'}`}/>
            </div>
            <div className="absolute inset-0 z-0 bg-grid-slate dark:bg-grid-white opacity-40 pointer-events-none"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:from-transparent dark:via-slate-900/80 dark:to-slate-900"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl rounded-3xl p-8 animate-fade-in-up text-center">
                    
                    {/* Icon */}
                    <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600 dark:text-brand-400 text-3xl shadow-inner animate-pulse">
                        <i className="fa-solid fa-envelope-open-text"></i>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Verifikasi Email Anda</h2>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                        Terima kasih telah mendaftar! Sebelum memulai, mohon verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan ke email Anda.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mb-6 text-sm font-medium text-green-600 bg-green-50 border border-green-200 p-4 rounded-xl animate-fade-in-up">
                            Link verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Resend Button */}
                        <form onSubmit={submit}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-500 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-paper-plane"></i>
                                )}
                                {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                            </button>
                        </form>

                        {/* Logout Link */}
                        <form onSubmit={logout}>
                            <button 
                                type="submit" 
                                className="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 text-sm font-medium transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-brand-300"
                            >
                                Keluar (Log Out)
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}