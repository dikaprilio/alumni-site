import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import InputLabel from '../../Components/InputLabel';
import InputText from '../../Components/InputText';
import DeleteConfirmModal from '../../Components/DeleteConfirmModal';
import { useToast } from '../../Components/ToastContext'; // Import ToastContext

export default function Settings({ admins }) {
    const { auth } = usePage().props;
    const { addToast } = useToast(); // Hook Toast
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'team'

    // --- FORM: PROFILE UPDATE ---
    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route('admin.settings.profile'), {
            preserveScroll: true,
        });
    };

    // --- FORM: PASSWORD UPDATE ---
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.post(route('admin.settings.password'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    // --- FORM: CREATE NEW ADMIN ---
    const adminForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submitNewAdmin = (e) => {
        e.preventDefault();
        adminForm.post(route('admin.settings.store_admin'), {
            preserveScroll: true,
            onSuccess: () => adminForm.reset(),
        });
    };

    // --- DELETE LOGIC ---
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = (admin) => {
        setItemToDelete(admin);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (itemToDelete) {
            setIsDeleting(true);
            router.delete(route('admin.settings.delete_admin', itemToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setIsDeleting(false);
                    setItemToDelete(null);
                    addToast('Admin berhasil dihapus!', 'success'); // Tampilkan Toast
                },
                onError: () => {
                    setIsDeleting(false);
                    addToast('Gagal menghapus admin.', 'error');
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Pengaturan Admin" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Pengaturan
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Kelola profil akun Anda dan manajemen tim administrator.
                </p>
            </div>

            {/* TABS NAVIGATION */}
            <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-800 mb-8">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 text-sm font-bold transition-colors relative ${
                        activeTab === 'profile' 
                            ? 'text-brand-600 dark:text-brand-400' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    Profil Saya
                    {activeTab === 'profile' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`pb-3 text-sm font-bold transition-colors relative ${
                        activeTab === 'team' 
                            ? 'text-brand-600 dark:text-brand-400' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    Manajemen Admin
                    {activeTab === 'team' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-t-full"></div>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- TAB: PROFILE & PASSWORD --- */}
                {activeTab === 'profile' && (
                    <>
                        <div className="lg:col-span-2 space-y-8">
                            {/* Update Profile Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    Informasi Akun
                                </h3>
                                <form onSubmit={submitProfile} className="space-y-4">
                                    <div>
                                        <InputLabel value="Nama Lengkap" />
                                        <InputText
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className="mt-1"
                                            placeholder="Nama Lengkap Anda"
                                        />
                                        {profileForm.errors.name && <p className="text-red-500 text-xs mt-1">{profileForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <InputLabel value="Email" />
                                        <InputText
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="mt-1"
                                            placeholder="email@domain.com"
                                        />
                                        {profileForm.errors.email && <p className="text-red-500 text-xs mt-1">{profileForm.errors.email}</p>}
                                    </div>
                                    <div className="pt-2 text-right">
                                        <button 
                                            type="submit" 
                                            disabled={profileForm.processing}
                                            className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-500/30 transition-all"
                                        >
                                            {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Update Password Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    Ganti Password
                                </h3>
                                <form onSubmit={submitPassword} className="space-y-4">
                                    <div>
                                        <InputLabel value="Password Saat Ini" />
                                        <InputText
                                            type="password"
                                            value={passwordForm.data.current_password}
                                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                            className="mt-1"
                                            placeholder="••••••••"
                                        />
                                        {passwordForm.errors.current_password && <p className="text-red-500 text-xs mt-1">{passwordForm.errors.current_password}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel value="Password Baru" />
                                            <InputText
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className="mt-1"
                                                placeholder="••••••••"
                                            />
                                            {passwordForm.errors.password && <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password}</p>}
                                        </div>
                                        <div>
                                            <InputLabel value="Konfirmasi Password" />
                                            <InputText
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                className="mt-1"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2 text-right">
                                        <button 
                                            type="submit" 
                                            disabled={passwordForm.processing}
                                            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg transition-all dark:bg-slate-700 dark:hover:bg-slate-600"
                                        >
                                            {passwordForm.processing ? 'Menyimpan...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <i className="fa-solid fa-shield-halved text-blue-600 dark:text-blue-400 text-xl mt-1"></i>
                                    <div>
                                        <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Keamanan Akun</h4>
                                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                                            Pastikan menggunakan password yang kuat. Anda terdaftar sebagai Administrator, yang memiliki akses penuh ke data alumni dan konten website.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- TAB: TEAM MANAGEMENT --- */}
                {activeTab === 'team' && (
                    <>
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Daftar Administrator</h3>
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                        {admins.length} User
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {admins.map((admin) => (
                                        <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                                                    {admin.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                        {admin.name}
                                                        {admin.is_current_user && (
                                                            <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded border border-green-200">You</span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{admin.email}</p>
                                                </div>
                                            </div>
                                            
                                            {!admin.is_current_user && (
                                                <button 
                                                    onClick={() => confirmDelete(admin)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                    title="Hapus Admin"
                                                >
                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Create Admin Sidebar Form */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-user-plus text-brand-600"></i> Tambah Admin Baru
                                </h3>
                                <form onSubmit={submitNewAdmin} className="space-y-4">
                                    <div>
                                        <InputLabel value="Nama" />
                                        <InputText
                                            value={adminForm.data.name}
                                            onChange={(e) => adminForm.setData('name', e.target.value)}
                                            placeholder="Nama admin baru"
                                            className="mt-1"
                                        />
                                        {adminForm.errors.name && <p className="text-red-500 text-xs mt-1">{adminForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <InputLabel value="Email" />
                                        <InputText
                                            type="email"
                                            value={adminForm.data.email}
                                            onChange={(e) => adminForm.setData('email', e.target.value)}
                                            placeholder="email@contoh.com"
                                            className="mt-1"
                                        />
                                        {adminForm.errors.email && <p className="text-red-500 text-xs mt-1">{adminForm.errors.email}</p>}
                                    </div>
                                    <div>
                                        <InputLabel value="Password" />
                                        <InputText
                                            type="password"
                                            value={adminForm.data.password}
                                            onChange={(e) => adminForm.setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="mt-1"
                                        />
                                        {adminForm.errors.password && <p className="text-red-500 text-xs mt-1">{adminForm.errors.password}</p>}
                                    </div>
                                    <div>
                                        <InputLabel value="Konfirmasi Password" />
                                        <InputText
                                            type="password"
                                            value={adminForm.data.password_confirmation}
                                            onChange={(e) => adminForm.setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={adminForm.processing}
                                            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all"
                                        >
                                            {adminForm.processing ? 'Menambahkan...' : 'Tambah Admin'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <DeleteConfirmModal 
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                processing={isDeleting}
                title="Hapus Admin?"
                description={`Apakah Anda yakin ingin menghapus akses admin untuk "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </AdminLayout>
    );
}