import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal'; // Pastikan path ini benar sesuai file Modal Anda
import InputLabel from '@/Components/InputLabel';
import InputText from '@/Components/InputText';

export default function SettingsModal({ onClose }) {
    const [activeTab, setActiveTab] = useState('password');

    // Form Password
    const { data: passData, setData: setPassData, post: postPass, processing: passProcessing, errors: passErrors, reset: resetPass } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Form Email
    const { data: emailData, setData: setEmailData, post: postEmail, processing: emailProcessing, errors: emailErrors, reset: resetEmail } = useForm({
        email: '',
        password_confirmation: '', // Butuh password saat ini untuk konfirmasi
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        postPass(route('alumni.settings.password'), {
            onSuccess: () => {
                resetPass();
                alert('Password berhasil diubah!');
                onClose();
            },
        });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        postEmail(route('alumni.settings.email'), {
            onSuccess: () => {
                resetEmail();
                alert('Email berhasil diubah!');
                onClose();
            },
        });
    };

    return (
        <Modal
            title="Pengaturan Akun"
            subtitle="Kelola keamanan dan preferensi login Anda."
            onClose={onClose}
            footer={null} // Kita custom footer di dalam tab
        >
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-6">
                <button
                    onClick={() => setActiveTab('password')}
                    className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'password' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Ganti Password
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'email' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Ganti Email
                </button>
            </div>

            {/* Content: Password */}
            {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <InputLabel required>Password Saat Ini</InputLabel>
                        <InputText type="password" value={passData.current_password} onChange={e => setPassData('current_password', e.target.value)} placeholder="Masukkan password lama" />
                        {passErrors.current_password && <p className="text-red-500 text-xs mt-1">{passErrors.current_password}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel required>Password Baru</InputLabel>
                            <InputText type="password" value={passData.password} onChange={e => setPassData('password', e.target.value)} placeholder="Minimal 8 karakter" />
                            {passErrors.password && <p className="text-red-500 text-xs mt-1">{passErrors.password}</p>}
                        </div>
                        <div>
                            <InputLabel required>Konfirmasi Password Baru</InputLabel>
                            <InputText type="password" value={passData.password_confirmation} onChange={e => setPassData('password_confirmation', e.target.value)} placeholder="Ulangi password baru" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={passProcessing} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-sm shadow-lg shadow-brand-500/20">
                            {passProcessing ? 'Menyimpan...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            )}

            {/* Content: Email */}
            {activeTab === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-yellow-800 text-xs mb-4">
                        <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                        Mengganti email mungkin mengharuskan Anda untuk memverifikasi ulang akun Anda.
                    </div>
                    <div>
                        <InputLabel required>Email Baru</InputLabel>
                        <InputText type="email" value={emailData.email} onChange={e => setEmailData('email', e.target.value)} placeholder="contoh@email.com" />
                        {emailErrors.email && <p className="text-red-500 text-xs mt-1">{emailErrors.email}</p>}
                    </div>
                    <div>
                        <InputLabel required>Password Saat Ini (Verifikasi)</InputLabel>
                        <InputText type="password" value={emailData.password_confirmation} onChange={e => setEmailData('password_confirmation', e.target.value)} placeholder="Konfirmasi identitas Anda" />
                        {emailErrors.password_confirmation && <p className="text-red-500 text-xs mt-1">{emailErrors.password_confirmation}</p>}
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={emailProcessing} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-sm shadow-lg shadow-brand-500/20">
                            {emailProcessing ? 'Menyimpan...' : 'Update Email'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}