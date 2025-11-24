import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputLabel from '../../../Components/InputLabel';
import InputText from '../../../Components/InputText';
import TextArea from '../../../Components/TextArea';
import ImageCropperModal from '../../../Components/ImageCropperModal';
import { useToast } from '../../../Components/ToastContext';

export default function CreateEvent() {
    const { addToast } = useToast();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: 'Webinar',
        event_date: '',
        location: '',
        description: '',
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
                setCropperImageSrc(reader.result);
                setShowCropper(true);
            };
        }
        e.target.value = null;
    };

    // 2. Handle Crop Complete
    const handleCropComplete = async (croppedBlob) => {
        const file = new File([croppedBlob], "event_banner.jpg", { type: "image/jpeg" });

        setData('image', file);
        setImagePreview(URL.createObjectURL(croppedBlob));
        setShowCropper(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.events.store'), {
            onSuccess: () => addToast('Event berhasil dibuat.', 'success'),
            onError: () => addToast('Gagal membuat event.', 'error'),
        });
    };

    return (
        <AdminLayout>
            <Head title="Buat Event Baru" />

            {/* --- CROPPER MODAL --- */}
            <ImageCropperModal
                show={showCropper}
                onClose={() => setShowCropper(false)}
                imageSrc={cropperImageSrc}
                onCropComplete={handleCropComplete}
                aspectRatio={16 / 9} // Banner Event (Landscape)
            />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={route('admin.events.index')} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Buat Agenda Event</h1>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">

                            {/* Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Nama Event" />
                                <InputText
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Contoh: Webinar Teknologi 2025"
                                    className="mt-1 font-bold text-lg"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            {/* Date & Location Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="event_date" value="Tanggal & Waktu" />
                                    <input
                                        type="datetime-local"
                                        id="event_date"
                                        value={data.event_date}
                                        onChange={(e) => setData('event_date', e.target.value)}
                                        className="w-full mt-1 border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 px-4 text-sm focus:ring-brand-500 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none"
                                    />
                                    {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>}
                                </div>
                                <div>
                                    <InputLabel htmlFor="location" value="Lokasi / Link Meeting" />
                                    <InputText
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Gedung A / Zoom Link..."
                                        className="mt-1"
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi Lengkap" />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="12"
                                    className="mt-1 w-full"
                                    placeholder="Jelaskan detail acara, narasumber, dan rundown..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Settings */}
                    <div className="space-y-6">

                        {/* Category & Publish */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                Detail Publikasi
                            </h3>

                            <div>
                                <InputLabel htmlFor="category" value="Kategori Event" />
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full mt-1 border border-slate-300 dark:border-slate-600 rounded-xl py-2 px-3 text-sm focus:ring-brand-500 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none"
                                >
                                    <option value="Webinar">Webinar</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Reuni">Reuni Alumni</option>
                                    <option value="Lowongan">Job Fair / Recruitment</option>
                                    <option value="General">Umum</option>
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan & Terbitkan'}
                                </button>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <InputLabel value="Banner / Poster Event" />

                            <div className="mt-2 relative group">
                                <div className={`w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center relative transition-all
                                    ${imagePreview ? 'border-transparent' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>

                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400 p-4">
                                            <i className="fa-solid fa-image text-3xl mb-2"></i>
                                            <p className="text-xs">Upload Banner (Max 2MB)</p>
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