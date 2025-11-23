import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function CreateModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'JOB', // JOB or MENTORING
        title: '',
        description: '',
        company_name: '',
        location: '',
        contact_info: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('opportunities.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* MODAL */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-content-enter">

                {/* HEADER */}
                <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
                        Post Opportunity
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* TYPE SELECTION */}
                    <div className="grid grid-cols-2 gap-4">
                        <TypeButton
                            active={data.type === 'JOB'}
                            onClick={() => setData('type', 'JOB')}
                            icon="fa-briefcase"
                            label="Job Referral"
                        />
                        <TypeButton
                            active={data.type === 'MENTORING'}
                            onClick={() => setData('type', 'MENTORING')}
                            icon="fa-handshake-angle"
                            label="Mentorship"
                        />
                    </div>

                    {/* TITLE */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title / Role</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500 text-slate-900 dark:text-white text-sm px-4 py-2"
                            placeholder={data.type === 'JOB' ? "e.g. Senior Frontend Dev" : "e.g. CV Review Session"}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* COMPANY & LOCATION (JOB ONLY) */}
                    {data.type === 'JOB' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500 text-slate-900 dark:text-white text-sm px-4 py-2"
                                    placeholder="e.g. GoTo"
                                />
                                {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500 text-slate-900 dark:text-white text-sm px-4 py-2"
                                    placeholder="e.g. Jakarta / Remote"
                                />
                            </div>
                        </div>
                    )}

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows="4"
                            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500 text-slate-900 dark:text-white text-sm px-4 py-2"
                            placeholder="Describe the role or what you can help with..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* CONTACT INFO */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Info (Visible to Public)</label>
                        <input
                            type="text"
                            value={data.contact_info}
                            onChange={e => setData('contact_info', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500 text-slate-900 dark:text-white text-sm px-4 py-2"
                            placeholder="Email, WhatsApp, or LinkedIn URL"
                        />
                        {errors.contact_info && <p className="text-red-500 text-xs mt-1">{errors.contact_info}</p>}
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-brand-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-700 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Posting...' : 'Post Now'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

function TypeButton({ active, onClick, icon, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center p-4 border transition-all
                ${active
                    ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-900/20 dark:border-brand-500 dark:text-brand-400'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }
            `}
        >
            <i className={`fa-solid ${icon} text-2xl mb-2`}></i>
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </button>
    );
}
