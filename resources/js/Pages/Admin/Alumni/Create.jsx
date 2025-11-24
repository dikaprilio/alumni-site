import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputLabel from '../../../Components/InputLabel';
import InputText from '../../../Components/InputText';
import TextArea from '../../../Components/TextArea';
import { useToast } from '../../../Components/ToastContext';

export default function CreateAlumni() {
    const { addToast } = useToast();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nim: '',
        graduation_year: '',
        major: '',
        phone_number: '',
        email: '',
        bio: '',
        current_position: '',
        company_name: '',
    });

    // Inisial untuk avatar preview (Live typing)
    const avatarInitial = data.name ? data.name.charAt(0).toUpperCase() : '?';

    // Logic for willCreateAccount
    const willCreateAccount = data.email && data.email.length > 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.alumni.store'), {
            onSuccess: () => addToast('Data alumni berhasil ditambahkan.', 'success'),
            onError: () => addToast('Gagal menambahkan data alumni. Periksa inputan anda.', 'error'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Tambah Alumni Baru" />

            {/* HEADER */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Link href={route('admin.alumni.index')} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Tambah Data Alumni
                    </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">
                    Tambahkan data alumni baru secara manual ke dalam sistem database.
                </p>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* --- KOLOM KIRI: LIVE PREVIEW & STATUS --- */}
                <div className="xl:col-span-1 space-y-6">

                    {/* KARTU INDIKATOR AKUN */}
                    <div className={`border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors duration-300 
                            ${willCreateAccount
                            ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                            : 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
                        }`}>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-colors duration-300
                                    ${willCreateAccount ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                <i className={`fa-solid ${willCreateAccount ? 'fa-user-plus' : 'fa-database'}`}></i>
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg transition-colors duration-300
                                        ${willCreateAccount ? 'text-blue-800 dark:text-blue-300' : 'text-amber-800 dark:text-amber-300'}`}>
                                    {willCreateAccount ? 'Buat Akun Login' : 'Hanya Data Master'}
                                </h3>
                                <p className={`text-xs mt-1 leading-relaxed transition-colors duration-300
                                        ${willCreateAccount ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                    {willCreateAccount
                                        ? 'Email diisi. Sistem akan otomatis membuatkan User Login untuk alumni ini dengan password default "password".'
                                        : 'Email kosong. Alumni ini hanya akan disimpan sebagai data arsip dan tidak bisa login ke aplikasi.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KARTU LIVE PREVIEW */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center relative">
                        <div className="absolute top-3 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Preview
                        </div>
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg flex items-center justify-center transition-all duration-300">
                            <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">{avatarInitial}</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white min-h-[1.75rem]">
                            {data.name || <span className="text-slate-300 italic font-normal">Nama Alumni...</span>}
                        </h2>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-1 min-h-[1rem]">
                            {data.nim || 'NIM...'}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {data.graduation_year || 'Tahun Lulus'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- KOLOM KANAN: FORM INPUT --- */}
                <div className="xl:col-span-2 space-y-8">

                    {/* SECTION 1: DATA UTAMA (REQUIRED) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                                <i className="fa-solid fa-graduation-cap"></i>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Identitas Akademik</h3>
                                <p className="text-xs text-slate-500">Data wajib untuk arsip kampus.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="name" value="Nama Lengkap *" />
                                <InputText
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1"
                                    placeholder="Masukkan nama lengkap sesuai ijazah"
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
                                    className="mt-1 font-mono bg-slate-50"
                                    placeholder="Nomor Induk Mahasiswa"
                                    required
                                />
                                {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
                            </div>

                            <div>
                                <InputLabel htmlFor="graduation_year" value="Tahun Lulus *" />
                                <InputText
                                    id="graduation_year"
                                    type="number"
                                    value={data.graduation_year}
                                    onChange={(e) => setData('graduation_year', e.target.value)}
                                    className="mt-1"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    required
                                />
                                {errors.graduation_year && <p className="text-red-500 text-xs mt-1">{errors.graduation_year}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="major" value="Program Studi *" />
                                <select
                                    id="major"
                                    value={data.major}
                                    onChange={(e) => setData('major', e.target.value)}
                                    className="w-full border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all bg-white dark:bg-slate-700 dark:text-white mt-1 cursor-pointer"
                                    required
                                >
                                    <option value="">-- Pilih Jurusan --</option>
                                    <option value="Teknologi Rekayasa Perangkat Lunak">Teknologi Rekayasa Perangkat Lunak</option>
                                    <option value="Teknologi Rekayasa Komputer">Teknologi Rekayasa Komputer</option>
                                    <option value="Manajemen Informatika">Manajemen Informatika</option>
                                    <option value="Teknik Komputer">Teknik Komputer</option>
                                </select>
                                {errors.major && <p className="text-red-500 text-xs mt-1">{errors.major}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="phone_number" value="Nomor Telepon / WA (Opsional)" />
                                <InputText
                                    id="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    className="mt-1"
                                    placeholder="Contoh: 081234567890"
                                />
                                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: SETUP AKUN (OPSIONAL) */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                <i className="fa-solid fa-key"></i>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Akses Login</h3>
                                <p className="text-xs text-slate-500">Opsional: Isi email untuk langsung membuatkan akun.</p>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Akun" />
                            <InputText
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 bg-white"
                                placeholder="alumni@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                            {/* INFO BOX DYNAMIC */}
                            <div className={`mt-3 flex gap-2 text-[11px] p-3 rounded-lg border transition-colors duration-300
                                    ${willCreateAccount
                                    ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                                <i className="fa-solid fa-circle-info mt-0.5"></i>
                                <div>
                                    {willCreateAccount ? (
                                        <span>
                                            <strong>Akun Aktif:</strong> Alumni akan bisa login menggunakan email ini.
                                            Password default yang diset adalah <strong>'password'</strong>.
                                        </span>
                                    ) : (
                                        <span>
                                            Kosongkan jika alumni belum memerlukan akses login saat ini.
                                            Akun bisa dibuatkan (generate) nanti.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href={route('admin.alumni.index')}
                            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-brand-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-500/50 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing ? (
                                <><i className="fa-solid fa-circle-notch fa-spin"></i> Menyimpan...</>
                            ) : (
                                <>Simpan Data <i className="fa-solid fa-check"></i></>
                            )}
                        </button>
                    </div>

                </div>
            </form>
        </AdminLayout>
    );
}