import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputLabel from '../../../Components/InputLabel';
import InputText from '../../../Components/InputText';

export default function CreateAlumni() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nim: '',
        graduation_year: new Date().getFullYear(),
        major: '',
        email: '', // Optional: Create user account
        phone_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.alumni.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add New Alumni" />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href={route('admin.alumni.index')} className="inline-flex items-center text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider mb-2 transition-colors">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Directory
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Add New Alumni
                    </h1>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                        
                        {/* Personal Info Section */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name *" />
                                    <InputText
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <InputLabel htmlFor="nim" value="NIM *" />
                                    <InputText
                                        id="nim"
                                        value={data.nim}
                                        onChange={(e) => setData('nim', e.target.value)}
                                        className="mt-1 block w-full font-mono"
                                        placeholder="e.g. J0403..."
                                        required
                                    />
                                    {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 pt-2">
                                Academic Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="major" value="Major / Program Studi *" />
                                    <select
                                        id="major"
                                        value={data.major}
                                        onChange={(e) => setData('major', e.target.value)}
                                        className="mt-1 block w-full border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm text-sm"
                                        required
                                    >
                                        <option value="">Select Major...</option>
                                        <option value="Teknologi Rekayasa Perangkat Lunak">Teknologi Rekayasa Perangkat Lunak</option>
                                        <option value="Teknologi Rekayasa Komputer">Teknologi Rekayasa Komputer</option>
                                        <option value="Manajemen Informatika">Manajemen Informatika</option>
                                        <option value="Teknik Komputer">Teknik Komputer</option>
                                    </select>
                                    {errors.major && <p className="text-red-500 text-xs mt-1">{errors.major}</p>}
                                </div>
                                <div>
                                    <InputLabel htmlFor="graduation_year" value="Graduation Year *" />
                                    <InputText
                                        id="graduation_year"
                                        type="number"
                                        value={data.graduation_year}
                                        onChange={(e) => setData('graduation_year', e.target.value)}
                                        className="mt-1 block w-full"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
                                    />
                                    {errors.graduation_year && <p className="text-red-500 text-xs mt-1">{errors.graduation_year}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Account Info (Optional) */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 pt-2">
                                User Account (Optional)
                            </h3>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-4 border border-blue-100 dark:border-blue-800/30">
                                <p className="text-xs text-blue-700 dark:text-blue-300 flex gap-2">
                                    <i className="fa-solid fa-circle-info mt-0.5"></i>
                                    If you enter an email, a user account will be automatically created for this alumni with a default password ('password').
                                </p>
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" />
                                <InputText
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="alumni@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Link 
                                href={route('admin.alumni.index')}
                                className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 flex items-center gap-2"
                            >
                                {processing && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                Save Alumni
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}