import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputLabel from '../../../Components/InputLabel';
import InputText from '../../../Components/InputText';
import TextArea from '../../../Components/TextArea';
import { useToast } from '../../../Components/ToastContext';

export default function EditAlumni({ alumni }) {
    const { addToast } = useToast();
    const { data, setData, put, processing, errors } = useForm({
        name: alumni.name || '',
        nim: alumni.nim || '',
        graduation_year: alumni.graduation_year || '',
        major: alumni.major || '',
        email: alumni.user ? alumni.user.email : '',
        current_position: alumni.current_position || '',
        company_name: alumni.company_name || '',
        phone_number: alumni.phone_number || '',
        address: alumni.address || '',
        bio: alumni.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.alumni.update', alumni.id), {
            onSuccess: () => addToast('Data alumni berhasil diperbarui.', 'success'),
            onError: () => addToast('Gagal memperbarui data alumni.', 'error'),
        });
    };

    // --- LOGIC DETEKSI STATUS AKUN (FIXED) ---
    // 1. Cek apakah alumni punya user di database (dari props)
    const hasExistingAccount = alumni.user !== null && alumni.user !== undefined;

    // 2. Cek apakah admin sedang menginput email baru untuk alumni yang belum punya akun
    const isCreatingAccount = !hasExistingAccount && data.email && data.email.length > 0;

    // Helper: Inisial nama untuk avatar placeholder
    const avatarInitial = alumni.name ? alumni.name.charAt(0).toUpperCase() : '?';

    return (
        <AdminLayout>
            <Head title={`Edit ${alumni.name}`} />

            {/* HEADER */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Link href={route('admin.alumni.index')} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Edit Data Alumni
                    </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">
                    Pastikan data yang dimasukkan valid sesuai ijazah atau data terbaru.
                </p>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* --- KOLOM KIRI: STATUS & FOTO --- */}
                <div className="xl:col-span-1 space-y-6">

                    {/* KARTU STATUS AKUN (IMPROVED UI LOGIC) */}
                    <div className={`border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors duration-300 
                            ${hasExistingAccount
                            ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                            : (isCreatingAccount
                                ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
                                : 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800')
                        }`}>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 
                                    ${hasExistingAccount
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : (isCreatingAccount ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600')
                                }`}>
                                <i className={`fa-solid 
                                        ${hasExistingAccount ? 'fa-user-check'
                                        : (isCreatingAccount ? 'fa-user-plus' : 'fa-user-clock')}
                                    `}></i>
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg 
                                        ${hasExistingAccount ? 'text-emerald-800 dark:text-emerald-300'
                                        : (isCreatingAccount ? 'text-blue-800 dark:text-blue-300' : 'text-amber-800 dark:text-amber-300')}
                                    `}>
                                    {hasExistingAccount ? 'Akun Aktif' : (isCreatingAccount ? 'Akan Dibuatkan Akun' : 'Belum Punya Akun')}
                                </h3>
                                <p className={`text-xs mt-1 leading-relaxed 
                                        ${hasExistingAccount ? 'text-emerald-700 dark:text-emerald-400'
                                        : (isCreatingAccount ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400')}
                                    `}>
                                    {hasExistingAccount
                                        ? `Login aktif: ${alumni.user?.email}`
                                        : (isCreatingAccount
                                            ? `Akun login akan dibuatkan otomatis dengan email: ${data.email}`
                                            : 'Alumni belum memiliki akses login aplikasi.')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KARTU PROFIL */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg flex items-center justify-center">
                            {alumni.avatar ? (
                                <img src={`/storage/${alumni.avatar}`} alt={alumni.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-slate-300 dark:text-slate-600">{avatarInitial}</span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{alumni.name || 'Nama Kosong'}</h2>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-1">{alumni.nim || '-'}</p>
                    </div>

                    {/* KONTAK CEPAT */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Info Kontak</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex gap-3">
                                <i className="fa-solid fa-phone mt-1 text-slate-400"></i>
                                <span>{data.phone_number || <span className="italic text-slate-400">Tidak ada no. HP</span>}</span>
                            </li>
                            <li className="flex gap-3">
                                <i className="fa-solid fa-location-dot mt-1 text-slate-400"></i>
                                <span>{data.address || <span className="italic text-slate-400">Alamat kosong</span>}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- KOLOM KANAN: FORM DATA --- */}
                <div className="xl:col-span-2 space-y-8">

                    {/* SECTION 1: DATA AKADEMIK (WAJIB) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                                <i className="fa-solid fa-graduation-cap"></i>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Akademik</h3>
                                <p className="text-xs text-slate-500">Informasi ini wajib diisi sesuai data kampus.</p>
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
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Nama lengkap sesuai ijazah tanpa gelar.</p>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <InputLabel htmlFor="nim" value="NIM (Nomor Induk) *" />
                                <InputText
                                    id="nim"
                                    value={data.nim}
                                    onChange={(e) => setData('nim', e.target.value)}
                                    className="mt-1 font-mono bg-slate-50"
                                    placeholder="Contoh: 2021001"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 mt-1">NIM unik sebagai identitas utama.</p>
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
                                    placeholder="YYYY"
                                    required
                                />
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
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="bio" value="Bio Singkat" />
                                <TextArea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    rows="3"
                                    className="mt-1"
                                    placeholder="Contoh: Alumni angkatan 2021 yang sekarang bekerja sebagai Fullstack Developer..."
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Opsional. Akan tampil di halaman profil publik.</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: DATA KARIR (OPSIONAL) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-briefcase"></i>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Karir Saat Ini</h3>
                                <p className="text-xs text-slate-500">Isi jika alumni sudah bekerja.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="current_position" value="Posisi / Jabatan" />
                                <InputText
                                    id="current_position"
                                    value={data.current_position}
                                    onChange={(e) => setData('current_position', e.target.value)}
                                    className="mt-1"
                                    placeholder="Contoh: Frontend Developer"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="company_name" value="Nama Perusahaan" />
                                <InputText
                                    id="company_name"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="mt-1"
                                    placeholder="Contoh: PT GoTo Gojek Tokopedia"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: PENGATURAN AKUN (PENTING) */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                <i className="fa-solid fa-key"></i>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Akses Login (Akun)</h3>
                                <p className="text-xs text-slate-500">Email ini digunakan alumni untuk masuk ke aplikasi.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="email" value="Email Akun" />
                                <InputText
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 bg-white"
                                    placeholder="masukkan_email@domain.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

                                {/* PANDUAN PENGISIAN DYNAMIC */}
                                <div className="mt-3 flex gap-2 text-[11px] text-slate-500 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                                    <div>
                                        {hasExistingAccount ? (
                                            <span><strong>Perhatian:</strong> Mengubah email di sini akan mengganti kredensial login alumni ini. Pastikan email aktif.</span>
                                        ) : (
                                            <span><strong>Buat Akun:</strong> {data.email ? 'Sistem akan membuatkan akun login otomatis menggunakan email di atas.' : 'Masukkan email untuk membuatkan akun login otomatis bagi alumni ini. Password default adalah "password".'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TOMBOL AKSI */}
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