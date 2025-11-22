import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Settings() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
            <Head title="Account Security" />
            
            <div className="max-w-[600px] mx-auto px-6 md:px-12">
                
                {/* HEADER */}
                <div className="mb-10">
                    <Link href="/alumni/dashboard" className="text-xs font-mono text-slate-500 hover:text-brand-600 mb-2 block">
                        <i className="fa-solid fa-arrow-left mr-2"></i> BACK TO DASHBOARD
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                        Account <span className="text-slate-400 dark:text-slate-600">Security</span>
                    </h1>
                </div>

                <div className="space-y-8">
                    {/* UPDATE EMAIL FORM */}
                    <UpdateEmailForm />

                    {/* UPDATE PASSWORD FORM */}
                    <UpdatePasswordForm />
                </div>
            </div>
        </div>
    );
}

function UpdateEmailForm() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('alumni.update.email'), { preserveScroll: true });
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                Update Email
            </h3>
            <p className="text-xs text-slate-500 mb-6">
                Changing your email will require re-verification.
            </p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Email Address</label>
                    <input 
                        type="email" 
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="flex justify-between items-center pt-2">
                    {recentlySuccessful && <span className="text-green-500 text-xs font-bold">Saved!</span>}
                    <button type="submit" disabled={processing} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors ml-auto">
                        Update Email
                    </button>
                </div>
            </form>
        </div>
    );
}

function UpdatePasswordForm() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('alumni.update.password'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                Change Password
            </h3>
            <p className="text-xs text-slate-500 mb-6">
                Ensure your account is using a long, random password to stay secure.
            </p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Password</label>
                    <input 
                        type="password" 
                        value={data.current_password}
                        onChange={e => setData('current_password', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none"
                    />
                    {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Password</label>
                    <input 
                        type="password" 
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Confirm Password</label>
                    <input 
                        type="password" 
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none"
                    />
                </div>

                <div className="flex justify-between items-center pt-2">
                    {recentlySuccessful && <span className="text-green-500 text-xs font-bold">Password Changed!</span>}
                    <button type="submit" disabled={processing} className="px-6 py-3 bg-brand-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-700 transition-colors ml-auto">
                        Save Password
                    </button>
                </div>
            </form>
        </div>
    );
}

Settings.layout = page => <PublicLayout children={page} />;