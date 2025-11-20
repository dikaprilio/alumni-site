import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

// PERBAIKAN 1: Default value allSkills=[]
export default function SetupWizard({ alumni, allSkills = [] }) {
    const [step, setStep] = useState(1);
    
    // PERBAIKAN 2: Deklarasi state strength yang sebelumnya hilang
    const [strength, setStrength] = useState(20);
    
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        step: 1, 
        phone_number: alumni?.phone_number || '',
        address: alumni?.address || '',
        linkedin_url: alumni?.linkedin_url || '',
        private_email: alumni?.private_email || false,
        private_phone: alumni?.private_phone || false,
        current_job: alumni?.current_job || '',
        company_name: alumni?.company_name || '',
        // PERBAIKAN 3: Safety check optional chaining (?.)
        skills: alumni?.skills?.map(s => s.id) || [],
    });

    // Hitung kekuatan profil (Gamifikasi)
    useEffect(() => {
        let score = 20;
        if (data.phone_number) score += 10;
        if (data.address) score += 10;
        if (data.linkedin_url) score += 10;
        if (data.current_job) score += 20;
        if (data.company_name) score += 10;
        if (data.skills.length > 0) score += 20;
        setStrength(Math.min(score, 100));
    }, [data]);

    // Update form data 'step' setiap kali state 'step' berubah
    useEffect(() => {
        setData('step', step);
    }, [step]);

    const handleNext = (e) => {
        e.preventDefault();
        clearErrors(); // Pastikan clearErrors ada di useForm destructur (opsional, jika error muncul hapus saja baris ini)

        // Logic untuk step terakhir (Finish)
        if (step === 3) {
            post(route('alumni.setup.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    // JANGAN setStep(step + 1) disini!
                    // Paksa pindah halaman manual jika backend gagal redirect
                    window.location.href = route('alumni.dashboard');
                },
                onError: (err) => {
                    console.error("Error saving setup:", err);
                    alert("Terdapat kesalahan pada input data. Silakan periksa kembali.");
                }
            });
            return;
        }

        // Logic untuk step 1 & 2 (Next)
        post(route('alumni.setup.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const nextStep = step + 1;
                setStep(nextStep);
            },
            onError: (errors) => {
                console.log("Validation Errors:", errors);
                const errorMessages = Object.values(errors).join('\n');
                alert(`Gagal melanjutkan. Mohon periksa inputan Anda:\n${errorMessages}`);
            }
        });
    };

    const handleSkip = () => {
        if (step === 3) {
            router.visit(route('alumni.dashboard'));
        }
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
        <div className="min-h-screen bg-[#F8F9FD] dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-500 font-sans">
            <Head title="Lengkapi Profil" />

            {/* --- SIDEBAR --- */}
            <div className="md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-800 p-8 md:p-12 flex flex-col justify-between border-r border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8 text-brand-600 dark:text-brand-400">
                        <i className="fa-solid fa-graduation-cap text-2xl"></i>
                        <span className="font-bold text-xl tracking-tight">Alumni<span className="text-slate-800 dark:text-white">Setup</span></span>
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4 leading-tight">
                        {step === 1 && "Ayo Mulai!"}
                        {step === 2 && "Karir Hebat!"}
                        {step === 3 && "Sentuhan Akhir"}
                    </h1>
                    
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        {step === 1 && "Data kontak membantu teman seangkatan menemukanmu kembali. Privasi kamu adalah prioritas kami."}
                        {step === 2 && "Beritahu kami pencapaianmu. Ini membantu membangun jaringan profesional yang kuat."}
                        {step === 3 && "Skill apa yang kamu kuasai? Ini kunci untuk rekomendasi karir yang lebih akurat."}
                    </p>

                    {/* Steps Indicator */}
                    <div className="space-y-6">
                        {[
                            { n: 1, label: 'Kontak & Privasi', icon: 'fa-id-card' },
                            { n: 2, label: 'Status Karir', icon: 'fa-briefcase' },
                            { n: 3, label: 'Skill & Keahlian', icon: 'fa-wand-magic-sparkles' }
                        ].map((s) => (
                            <div key={s.n} className={`flex items-center gap-4 transition-all duration-300 ${step === s.n ? 'opacity-100 translate-x-2' : 'opacity-50'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                    step > s.n ? 'bg-green-500 border-green-500 text-white' : 
                                    step === s.n ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30' : 
                                    'border-slate-300 dark:border-slate-600 text-slate-400'
                                }`}>
                                    {step > s.n ? <i className="fa-solid fa-check"></i> : <i className={`fa-solid ${s.icon} text-sm`}></i>}
                                </div>
                                <span className={`font-semibold ${step === s.n ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strength Meter */}
                <div className="relative z-10 mt-12 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-600">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Kekuatan Profil</span>
                        <span className="text-brand-600">{strength}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 h-2.5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-700 ease-out"
                            style={{ width: `${strength}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* --- FORM CONTENT --- */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                <form onSubmit={handleNext} className="w-full max-w-lg space-y-8 animate-fade-in-up">
                    
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-4">
                            <p className="font-bold flex items-center gap-2"><i className="fa-solid fa-triangle-exclamation"></i> Periksa kembali input Anda:</p>
                            <ul className="list-disc list-inside mt-1 ml-1">
                                {Object.entries(errors).map(([key, msg]) => (
                                    <li key={key}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* STEP 1: CONTACT */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <InputGroup 
                                label="Nomor WhatsApp" 
                                name="phone_number"
                                value={data.phone_number} 
                                onChange={e => setData('phone_number', e.target.value)}
                                error={errors.phone_number}
                                icon="fa-whatsapp"
                                placeholder="Contoh: 08123456789"
                                required
                                type="tel"
                            />
                            
                            <InputGroup 
                                label="Alamat Domisili" 
                                name="address"
                                value={data.address} 
                                onChange={e => setData('address', e.target.value)}
                                error={errors.address}
                                icon="fa-map-pin"
                                type="textarea"
                                placeholder="Nama Jalan, Kota, Provinsi"
                                required
                            />

                            <InputGroup 
                                label="LinkedIn URL (Opsional)" 
                                name="linkedin_url"
                                value={data.linkedin_url} 
                                onChange={e => setData('linkedin_url', e.target.value)}
                                error={errors.linkedin_url}
                                icon="fa-linkedin"
                                placeholder="https://linkedin.com/in/username"
                            />

                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-500/20">
                                <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-shield-halved"></i> Privasi Data
                                </h4>
                                <div className="space-y-3">
                                    <Toggle label="Sembunyikan Email dari publik" checked={data.private_email} onChange={e => setData('private_email', e.target.checked)} />
                                    <Toggle label="Sembunyikan No. HP dari publik" checked={data.private_phone} onChange={e => setData('private_phone', e.target.checked)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CAREER */}
                    {step === 2 && (
                        <div className="space-y-6">
                             <InputGroup 
                                label="Pekerjaan / Posisi Saat Ini" 
                                name="current_job"
                                value={data.current_job} 
                                onChange={e => setData('current_job', e.target.value)}
                                error={errors.current_job}
                                icon="fa-briefcase"
                                placeholder="Misal: Frontend Developer"
                                required
                            />
                             <InputGroup 
                                label="Nama Perusahaan / Instansi" 
                                name="company_name"
                                value={data.company_name} 
                                onChange={e => setData('company_name', e.target.value)}
                                error={errors.company_name}
                                icon="fa-building"
                                placeholder="Misal: Tokopedia, Pertamina, atau Freelance"
                                // required dihapus agar tidak memblokir jika kosong
                            />
                            
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm flex gap-3 items-start">
                                <i className="fa-solid fa-circle-info mt-1"></i>
                                <p>Jika Anda belum bekerja atau sedang mencari kerja, Anda bisa mengisi posisi dengan "Open to Work" atau "Job Seeker".</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: SKILLS */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                                    Pilih Keahlian (Opsional)
                                </label>
                                <span className="text-xs text-slate-400">{data.skills.length} dipilih</span>
                            </div>
                            
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1 max-h-80 overflow-y-auto custom-scrollbar">
                                <div className="p-4 flex flex-wrap gap-2">
                                    {/* PERBAIKAN 4: Safety check allSkills */}
                                    {allSkills && allSkills.length > 0 ? (
                                        allSkills.map((skill) => (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                onClick={() => handleSkillToggle(skill.id)}
                                                className={`
                                                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-2 group
                                                    ${data.skills.includes(skill.id)
                                                        ? 'bg-brand-50 text-brand-700 border-brand-200 shadow-sm dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700'
                                                        : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-700'
                                                    }
                                                `}
                                            >
                                                {skill.name}
                                                {data.skills.includes(skill.id) && <i className="fa-solid fa-check text-xs"></i>}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm p-2">Data skill belum tersedia.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NAVIGATION BUTTONS */}
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                        
                        {step > 1 ? (
                            <button 
                                type="button" 
                                onClick={() => setStep(step - 1)}
                                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <i className="fa-solid fa-arrow-left"></i> Kembali
                            </button>
                        ) : (
                            <span></span> 
                        )}

                        <div className="flex items-center gap-4">
                            {step === 3 && (
                                <button 
                                    type="button"
                                    onClick={handleSkip}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium transition-colors px-3 py-2"
                                >
                                    Lewati tahap ini
                                </button>
                            )}
                            
                            <button 
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 rounded-full bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-500 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch animate-spin"></i> Menyimpan...
                                    </>
                                ) : step === 3 ? (
                                    <>Selesai <i className="fa-solid fa-flag-checkered"></i></>
                                ) : (
                                    <>Lanjut <i className="fa-solid fa-arrow-right"></i></>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputGroup({ label, name, value, onChange, error, icon, type = 'text', placeholder, required }) {
    return (
        <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-wider">
                {label} {required && <span className="text-red-500" title="Wajib diisi">*</span>}
            </label>
            <div className="relative group">
                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors pointer-events-none">
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                {type === 'textarea' ? (
                    <textarea 
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        rows="3"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border outline-none transition-all dark:text-white resize-none
                            ${error 
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                            }
                        `}
                        placeholder={placeholder}
                    ></textarea>
                ) : (
                    <input 
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border outline-none transition-all dark:text-white
                            ${error 
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                            }
                        `}
                        placeholder={placeholder}
                    />
                )}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1.5 animate-pulse font-medium flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                </p>
            )}
        </div>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{label}</span>
            <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
            </div>
        </label>
    );
}