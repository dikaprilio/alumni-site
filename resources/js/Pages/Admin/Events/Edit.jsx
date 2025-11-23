import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import InputLabel from '../../../Components/InputLabel';
import InputText from '../../../Components/InputText';
import TextArea from '../../../Components/TextArea';

export default function EditEvent({ event }) {
    const { data, setData, processing, errors } = useForm({
        title: event.title || '',
        category: event.category || 'Webinar',
        event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '', // Format to YYYY-MM-DDTHH:mm for input
        location: event.location || '',
        description: event.description || '',
        image: null,
        _method: 'PUT' // Critical for file upload on update
    });

    const [imagePreview, setImagePreview] = useState(event.image ? `/storage/${event.image}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        router.post(route('admin.events.update', event.id), data);
    };

    return (
        <AdminLayout>
            <Head title="Edit Event" />
            
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={route('admin.events.index')} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Edit Agenda Event</h1>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="title" value="Nama Event" />
                                <InputText 
                                    id="title" 
                                    value={data.title} 
                                    onChange={(e) => setData('title', e.target.value)} 
                                    className="mt-1 font-bold text-lg"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

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
                                        className="mt-1"
                                    />
                                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi Lengkap" />
                                <TextArea 
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="12"
                                    className="mt-1 w-full"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar Settings */}
                    <div className="space-y-6">
                        
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
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
                                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <InputLabel value="Banner / Poster Event" />
                            
                            <div className="mt-2 relative group">
                                <div className={`w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center relative transition-all ${imagePreview ? 'border-transparent' : 'border-slate-300 bg-slate-50 dark:bg-slate-800'}`}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400 p-4">
                                            <i className="fa-solid fa-image text-3xl mb-2"></i>
                                            <p className="text-xs">Klik untuk ganti banner</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}