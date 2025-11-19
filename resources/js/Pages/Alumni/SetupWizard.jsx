import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

export default function SetupWizard({ alumni, allSkills }) {
    const [step, setStep] = useState(1);
    
    // Initialize form with existing data or defaults
    const { data, setData, post, processing, errors } = useForm({
        step: 1, // To tell the backend which validation to run
        // Step 1: Personal & Privacy
        phone_number: alumni?.phone_number || '',
        address: alumni?.address || '',
        linkedin_url: alumni?.linkedin_url || '',
        private_email: alumni?.private_email || false,
        private_phone: alumni?.private_phone || false,
        // Step 2: Career
        current_job: alumni?.current_job || '',
        company_name: alumni?.company_name || '',
        // Step 3: Skills (IDs)
        skills: alumni?.skills?.map(s => s.id) || [],
    });

    // Handle Next Step
    const handleNext = (e) => {
        e.preventDefault();
        
        // If it's the last step, we submit everything for finalization
        if (step === 3) {
            post(route('alumni.setup.store'), {
                onSuccess: () => router.visit(route('alumni.dashboard')) // Force redirect to dashboard
            });
            return;
        }

        // For intermediate steps, we can save progress or just move UI forward
        // Here we save progress to backend to ensure validation passes before moving on
        post(route('alumni.setup.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setStep(step + 1);
                setData('step', step + 1); // Update step for next request
            }
        });
    };

    const handleSkillToggle = (skillId) => {
        const currentSkills = [...data.skills];
        if (currentSkills.includes(skillId)) {
            setData('skills', currentSkills.filter(id => id !== skillId));
        } else {
            setData('skills', [...currentSkills, skillId]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
            <Head title="Setup Profile" />

            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                
                {/* Progress Header */}
                <div className="bg-brand-600 p-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang, {alumni.name}!</h1>
                        <p className="text-brand-100">Lengkapi profil Anda untuk mendapatkan badge "Alumni Starter".</p>
                    </div>
                    {/* Stepper Indicators */}
                    <div className="flex justify-center gap-4 mt-6 relative z-10">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                                ${step >= num ? 'bg-white text-brand-600 scale-110 shadow-lg' : 'bg-brand-700 text-brand-300 border border-brand-500'}
                            `}>
                                {step > num ? <i className="fa-solid fa-check"></i> : num}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleNext} className="p-8">
                    
                    {/* --- STEP 1: CONTACT & PRIVACY --- */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-right">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-700">
                                Informasi Kontak
                            </h3>
                            
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Nomor WhatsApp</label>
                                    <input 
                                        type="text" 
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="0812..."
                                    />
                                    {errors.phone_number && <span className="text-red-500 text-sm">{errors.phone_number}</span>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Alamat Domisili</label>
                                    <textarea 
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        rows="2"
                                    ></textarea>
                                    {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">LinkedIn URL (Opsional)</label>
                                    <input 
                                        type="url" 
                                        value={data.linkedin_url}
                                        onChange={e => setData('linkedin_url', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                {/* Privacy Toggles */}
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
                                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-lock"></i> Pengaturan Privasi
                                    </h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm">Sembunyikan Email dari Alumni lain</span>
                                            <input 
                                                type="checkbox" 
                                                checked={data.private_email}
                                                onChange={e => setData('private_email', e.target.checked)}
                                                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" 
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm">Sembunyikan No. HP dari Alumni lain</span>
                                            <input 
                                                type="checkbox" 
                                                checked={data.private_phone}
                                                onChange={e => setData('private_phone', e.target.checked)}
                                                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-gray-600" 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 2: CAREER --- */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-right">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-700">
                                Status Pekerjaan Saat Ini
                            </h3>
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Pekerjaan / Posisi</label>
                                    <input 
                                        type="text" 
                                        value={data.current_job}
                                        onChange={e => setData('current_job', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="Contoh: Software Engineer, Freelancer, Mencari Kerja"
                                    />
                                    {errors.current_job && <span className="text-red-500 text-sm">{errors.current_job}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Nama Perusahaan / Instansi</label>
                                    <input 
                                        type="text" 
                                        value={data.company_name}
                                        onChange={e => setData('company_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="Contoh: Google Indonesia"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 3: SKILLS --- */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-right">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-700">
                                Pilih Skill Anda
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Pilih skill yang Anda kuasai untuk membantu kami merekomendasikan lowongan kerja yang sesuai.
                            </p>
                            
                            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border rounded-xl dark:border-slate-700">
                                {allSkills.map((skill) => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill.id)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                            ${data.skills.includes(skill.id)
                                                ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                                                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-400'
                                            }
                                        `}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- NAVIGATION BUTTONS --- */}
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                        {step > 1 ? (
                            <button 
                                type="button" 
                                onClick={() => { setStep(step - 1); setData('step', step - 1); }}
                                className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                            >
                                <i className="fa-solid fa-arrow-left mr-2"></i> Kembali
                            </button>
                        ) : (
                            <div></div> // Spacer
                        )}

                        <button 
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 rounded-xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-500 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center gap-2"
                        >
                            {processing ? (
                                <i className="fa-solid fa-circle-notch animate-spin"></i>
                            ) : step === 3 ? (
                                <>Selesai & Masuk Dashboard <i className="fa-solid fa-flag-checkered ml-1"></i></>
                            ) : (
                                <>Lanjut <i className="fa-solid fa-arrow-right ml-1"></i></>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}