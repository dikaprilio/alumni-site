import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputLabel from '../../../Components/InputLabel';
import InputText from '../../../Components/InputText';
import TextArea from '../../../Components/TextArea';
import ImageCropperModal from '../../../Components/ImageCropperModal';
import { useToast } from '../../../Components/ToastContext';

export default function CreateNews() {
    const { addToast } = useToast();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: 'General',
        content: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [cropperImageSrc, setCropperImageSrc] = useState(null);

    // 1. Handle File Selection -> Open Cropper
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setCropperImageSrc(reader.result); // Set source for cropper
                setShowCropper(true); // Show modal
            };
        }
        // Reset input value so same file can be selected again if needed
        e.target.value = null;
    };

    // 2. Handle Crop Complete -> Set Data & Preview
    const handleCropComplete = async (croppedBlob) => {
        // Convert Blob to File
        const file = new File([croppedBlob], "news_cover.jpg", { type: "image/jpeg" });

        setData('image', file);
        setImagePreview(URL.createObjectURL(croppedBlob));
        setShowCropper(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.news.store'), {
            onSuccess: () => addToast('Berita berhasil diterbitkan.', 'success'),
            onError: () => addToast('Gagal menerbitkan berita.', 'error'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Buat Berita Baru" />

            {/* --- CROPPER MODAL --- */}
            <ImageCropperModal
                show={showCropper}
                onClose={() => setShowCropper(false)}
                imageSrc={cropperImageSrc}
                onCropComplete={handleCropComplete}
                aspectRatio={16 / 9} // NEWS PAKE 16:9
            />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={route('admin.news.index')} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Tulis Artikel Baru</h1>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="Judul Artikel" />
                                <InputText
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul yang menarik..."
                                    className="mt-1 font-bold text-lg"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Isi Konten" />
                                <TextArea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows="15"
                                    className="mt-1 w-full font-normal leading-relaxed"
                                    placeholder="Tulis konten artikel Anda di sini..."
                                />
                                <p className="text-[10px] text-slate-400 mt-2 text-right">
                                    * Gunakan tag HTML dasar untuk format (p, b, i, ul, li) jika diperlukan.
                                </p>
                                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Settings */}
                    <div className="space-y-6">

                        {/* Publish Settings */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Pengaturan Publikasi
                            </h3>

                            <div>
                                <InputLabel htmlFor="category" value="Kategori" />
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full mt-1 border border-slate-300 dark:border-slate-600 rounded-xl py-2 px-3 text-sm focus:ring-brand-500 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none"
                                >
                                    <option value="General">General</option>
                                    <option value="Campus">Berita Kampus</option>
                                    <option value="Technology">Teknologi</option>
                                    <option value="Career">Karir & Tips</option>
                                    <option value="Event">Event (Manual)</option>
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Menerbitkan...' : 'Terbitkan Berita'}
                                </button>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <InputLabel value="Gambar Unggulan (Cover)" />

                            <div className="mt-2 relative group">
                                <div className={`w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center relative transition-all
                                    ${imagePreview ? 'border-transparent' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>

                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400 p-4">
                                            <i className="fa-solid fa-image text-3xl mb-2"></i>
                                            <p className="text-xs">Klik untuk upload gambar</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            <p className="text-[10px] text-slate-400 mt-2 text-center">Format: 16:9 (Landscape)</p>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}