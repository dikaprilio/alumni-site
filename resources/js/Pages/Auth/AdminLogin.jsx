import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '../../Components/InputLabel';
import InputText from '../../Components/InputText';

export default function AdminLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.process'));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Head title="Admin Access" />

            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f615,transparent)]"></div>

            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <i className="fa-solid fa-shield-halved text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                        System Access
                    </h2>
                    <p className="text-slate-400 text-xs font-mono mt-2 uppercase tracking-widest">
                        Authorized Personnel Only
                    </p>
                </div>

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-500 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-slate-300" />
                        <InputText
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-slate-950 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20 placeholder-slate-600"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@example.com"
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-2 font-mono">{errors.email}</div>}
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-slate-300" />
                        <InputText
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-slate-950 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20 placeholder-slate-600"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-2 font-mono">{errors.password}</div>}
                    </div>

                    <div className="block">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded bg-slate-800 border-slate-700 text-blue-600 shadow-sm focus:ring-blue-500/20 focus:ring-offset-slate-900"
                            />
                            <span className="ms-2 text-xs text-slate-400 uppercase tracking-wider font-bold">Remember me</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
                        >
                            {processing && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                            {processing ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">
                        &larr; Return to Public Site
                    </Link>
                </div>
            </div>
        </div>
    );
}