import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

// Components
import SettingsModal from '@/Components/SettingsModal'; 
import Sidebar from '@/Components/Sidebar';
import MobileBottomNav from '@/Components/MobileBottomNav';
import Modal from '@/Components/Modal';
import TabButton from '@/Components/TabButton';
import InputLabel from '@/Components/InputLabel';
import InputText from '@/Components/InputText';
import TextArea from '@/Components/TextArea';

export default function Dashboard({ auth, alumni, completeness, badges, allSkills = [] }) {
    const [activeTab, setActiveTab] = useState('overview'); 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false); 

    // Modal States
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);

    // --- FORM HOOKS ---
    const { data: profileData, setData: setProfileData, post: postProfile, processing: profileProcessing } = useForm({
        bio: alumni.bio || '',
        current_job: alumni.current_job || '',
        company_name: alumni.company_name || '',
        linkedin_url: alumni.linkedin_url || '',
        phone_number: alumni.phone_number || '',
        address: alumni.address || '',
        private_email: alumni.private_email || false,
        private_phone: alumni.private_phone || false,
    });

    const { data: jobData, setData: setJobData, post: postJob, processing: jobProcessing, reset: resetJob } = useForm({
        position: '',
        company_name: '',
        start_year: new Date().getFullYear(),
        end_year: '',
        description: ''
    });

    // Manage Skills
    const [selectedSkills, setSelectedSkills] = useState(alumni.skills?.map(s => s.id) || []);

    // --- HANDLERS ---
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        postProfile(route('alumni.update.profile'), { onSuccess: () => setShowProfileModal(false) });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            router.post(route('alumni.update.avatar'), { _method: 'post', avatar: file }, { forceFormData: true });
        }
    };

    const handleJobSubmit = (e) => {
        e.preventDefault();
        postJob(route('alumni.jobs.add'), { onSuccess: () => { setShowJobModal(false); resetJob(); } });
    };

    const handleDeleteJob = (id) => {
        if(confirm('Hapus riwayat pekerjaan ini?')) router.delete(route('alumni.jobs.delete', id));
    };

    const handleSkillToggle = (id) => {
        if (selectedSkills.includes(id)) setSelectedSkills(selectedSkills.filter(s => s !== id));
        else setSelectedSkills([...selectedSkills, id]);
    };

    const handleSkillSubmit = () => {
        router.post(route('alumni.setup.store'), { step: 3, skills: selectedSkills }, { onSuccess: () => setShowSkillModal(false) });
    };

    return (
        // FIX 1: Removed 'flex' from here. Standard block layout handles fixed sidebar better.
        <div className="min-h-screen bg-[#F8F9FD] dark:bg-slate-900 font-sans transition-colors duration-300 overflow-x-hidden">
            <Head title={`${alumni.name} - Dashboard`} />

            <Sidebar 
                auth={auth} 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen}
                // Pass the function to open Settings Modal
                onOpenSettings={() => setShowSettingsModal(true)} 
            />
            
            <MobileBottomNav activeRoute="alumni.dashboard" onOpenSidebar={() => setSidebarOpen(true)} />

            {/* MAIN CONTENT */}
            {/* FIX 2: Removed 'w-full' and 'flex-1'. 
                'md:ml-72' pushes the content right on desktop. 
                Since it's a block element, it automatically fills the remaining width.
            */}
            <div className="md:ml-72 flex flex-col min-h-screen pb-24 md:pb-10 transition-all duration-300">
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-5xl mx-auto animate-fade-in-up space-y-6">
                        
                        {/* --- HERO PROFILE CARD --- */}
                        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-3xl overflow-hidden relative border border-slate-100 dark:border-slate-700">
                            <div className="h-40 md:h-56 bg-gradient-to-r from-brand-600 to-purple-600 relative">
                                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                 <div className="absolute inset-0 bg-black/10"></div>
                            </div>

                            <div className="px-6 pb-6 relative">
                                <div className="flex flex-col md:flex-row items-start gap-6">
                                    <div className="relative -mt-16 group shrink-0 mx-auto md:mx-0">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[5px] border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-lg relative bg-white">
                                            {alumni.avatar ? (
                                                <img src={`/storage/${alumni.avatar}`} alt={alumni.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400 bg-slate-100 dark:bg-slate-700">
                                                    {alumni.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white backdrop-blur-[2px]">
                                                <i className="fa-solid fa-camera text-2xl mb-1 drop-shadow-md"></i>
                                                <span className="text-[10px] font-bold uppercase tracking-wider drop-shadow-md">Ubah</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-2 md:pt-4 flex-1 w-full text-center md:text-left">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div className="w-full">
                                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
                                                    {alumni.name}
                                                    {badges.includes('Alumni Legend') && <i className="fa-solid fa-certificate text-blue-500 text-xl" title="Verified Legend"></i>}
                                                </h1>
                                                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium mt-1">
                                                    {alumni.current_job || 'Alumni'} 
                                                    {alumni.company_name && <span className="mx-2 text-slate-300">•</span>}
                                                    {alumni.company_name}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center md:justify-start gap-2">
                                                    <i className="fa-solid fa-location-dot text-brand-500"></i> {alumni.address}
                                                </p>
                                            </div>
                                            
                                            <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                                                <button 
                                                    onClick={() => setShowProfileModal(true)}
                                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white flex items-center gap-2"
                                                >
                                                    <i className="fa-solid fa-pen"></i> <span>Edit Profil</span>
                                                </button>
                                                {alumni.linkedin_url && (
                                                    <a href={alumni.linkedin_url} target="_blank" rel="noreferrer" className="bg-[#0077b5] text-white px-4 py-2.5 rounded-xl font-bold text-lg hover:bg-[#006097] transition-colors shadow-sm">
                                                        <i className="fa-brands fa-linkedin"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* LEFT COL */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-800 dark:text-white">Kelengkapan Profil</h3>
                                        <span className="text-brand-600 font-extrabold">{completeness}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-3">
                                        <div className="bg-gradient-to-r from-brand-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${completeness}%` }}></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {badges.map((badge, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-[10px] uppercase font-bold flex items-center gap-1.5 tracking-wide">
                                                <i className="fa-solid fa-medal text-yellow-500"></i> {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-5">Informasi Kontak</h3>
                                    <ul className="space-y-5 text-sm">
                                        <li className="flex items-start gap-4">
                                            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                <i className="fa-solid fa-envelope"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Email</p>
                                                <p className="text-slate-700 dark:text-slate-300 truncate font-medium">
                                                    {alumni.private_email ? <span className="italic text-slate-400">Disembunyikan</span> : auth.user.email}
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                <i className="fa-brands fa-whatsapp text-lg"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">WhatsApp</p>
                                                <p className="text-slate-700 dark:text-slate-300 truncate font-medium">
                                                    {alumni.private_phone ? <span className="italic text-slate-400">Disembunyikan</span> : alumni.phone_number}
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* RIGHT COL */}
                            <div className="md:col-span-2">
                                <div className="bg-white dark:bg-slate-800 rounded-t-2xl border-b border-slate-100 dark:border-slate-700 flex overflow-x-auto scrollbar-hide">
                                    <TabButton id="overview" label="Tentang" icon="fa-user" activeTab={activeTab} onClick={setActiveTab} />
                                    <TabButton id="experience" label="Pengalaman" icon="fa-briefcase" activeTab={activeTab} onClick={setActiveTab} />
                                    <TabButton id="skills" label="Keahlian" icon="fa-wand-magic-sparkles" activeTab={activeTab} onClick={setActiveTab} />
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-b-2xl p-6 md:p-8 shadow-sm min-h-[400px]">
                                    {/* OVERVIEW */}
                                    {activeTab === 'overview' && (
                                        <div className="animate-fade-in">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tentang Saya</h3>
                                                <button onClick={() => setShowProfileModal(true)} className="text-brand-600 text-sm font-bold hover:bg-brand-50 px-3 py-1 rounded-lg transition-colors">
                                                    <i className="fa-solid fa-pen mr-1"></i> Edit
                                                </button>
                                            </div>
                                            {alumni.bio ? (
                                                <div className="prose prose-slate prose-sm max-w-none dark:prose-invert">
                                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">{alumni.bio}</p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-600">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                                        <i className="fa-regular fa-file-lines text-slate-300 text-xl"></i>
                                                    </div>
                                                    <p className="text-slate-500 text-sm mb-3">Belum ada deskripsi diri.</p>
                                                    <button onClick={() => setShowProfileModal(true)} className="text-brand-600 font-bold text-sm hover:underline">Tulis Bio Sekarang</button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* EXPERIENCE */}
                                    {activeTab === 'experience' && (
                                        <div className="animate-fade-in">
                                            <div className="flex justify-between items-center mb-8">
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Riwayat Pekerjaan</h3>
                                                <button onClick={() => setShowJobModal(true)} className="flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors border border-brand-100">
                                                    <i className="fa-solid fa-plus"></i> Tambah
                                                </button>
                                            </div>

                                            {alumni.job_histories && alumni.job_histories.length > 0 ? (
                                                <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-10 pb-2">
                                                    {alumni.job_histories.map((job) => (
                                                        <div key={job.id} className="relative pl-8 group">
                                                            <div className="absolute -left-[9px] top-1.5 w-[18px] h-[18px] rounded-full bg-white border-[4px] border-brand-500 dark:border-brand-400 shadow-sm z-10"></div>
                                                            <button 
                                                                onClick={() => handleDeleteJob(job.id)}
                                                                className="absolute right-0 top-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                                title="Hapus"
                                                            >
                                                                <i className="fa-solid fa-trash text-xs"></i>
                                                            </button>

                                                            <div className="bg-white dark:bg-slate-800">
                                                                <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-brand-600 transition-colors">{job.position}</h4>
                                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{job.company_name}</p>
                                                                <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-3">
                                                                    {job.start_year} — {job.end_year || 'Sekarang'}
                                                                </span>
                                                                {job.description && (
                                                                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 leading-relaxed">
                                                                        {job.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
                                                    <i className="fa-solid fa-briefcase text-4xl text-slate-200 mb-3"></i>
                                                    <p className="text-slate-500 text-sm">Belum ada riwayat pekerjaan.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* SKILLS */}
                                    {activeTab === 'skills' && (
                                        <div className="animate-fade-in">
                                            <div className="flex justify-between items-center mb-8">
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Keahlian & Kompetensi</h3>
                                                <button onClick={() => setShowSkillModal(true)} className="flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors border border-brand-100">
                                                    <i className="fa-solid fa-pen-to-square"></i> Atur Skill
                                                </button>
                                            </div>
                                            
                                            {alumni.skills && alumni.skills.length > 0 ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {alumni.skills.map(skill => (
                                                        <div key={skill.id} className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-brand-300 hover:shadow-md transition-all group dark:bg-slate-700 dark:border-slate-600">
                                                            <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs group-hover:bg-green-500 group-hover:text-white transition-colors">
                                                                <i className="fa-solid fa-check"></i>
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{skill.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl">
                                                    <i className="fa-solid fa-wand-magic-sparkles text-4xl text-slate-200 mb-3"></i>
                                                    <p className="text-slate-500 text-sm">Belum ada skill ditambahkan.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODALS --- */}
            {showProfileModal && (
                <Modal title="Edit Data Profil" subtitle="Perbarui informasi pribadi dan kontak Anda." onClose={() => setShowProfileModal(false)}
                    footer={
                        <>
                            <button onClick={() => setShowProfileModal(false)} className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">Batal</button>
                            <button onClick={handleProfileSubmit} disabled={profileProcessing} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-sm shadow-lg shadow-brand-500/20">{profileProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                        </>
                    }>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-600 space-y-4">
                            <h4 className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Informasi Karir</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div><InputLabel required>Pekerjaan Saat Ini</InputLabel><InputText type="text" value={profileData.current_job} onChange={e => setProfileData('current_job', e.target.value)} placeholder="Contoh: Software Engineer" /></div>
                                <div><InputLabel>Perusahaan / Instansi</InputLabel><InputText type="text" value={profileData.company_name} onChange={e => setProfileData('company_name', e.target.value)} placeholder="Contoh: Google Indonesia" /></div>
                            </div>
                            <div><InputLabel>Bio / Ringkasan Diri</InputLabel><TextArea rows="3" value={profileData.bio} onChange={e => setProfileData('bio', e.target.value)} placeholder="Ceritakan pengalaman, keahlian, atau minat karir Anda..." /></div>
                        </div>
                        <div className="bg-white p-1 space-y-4">
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Kontak & Privasi</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div><InputLabel required>No. WhatsApp</InputLabel><InputText type="text" value={profileData.phone_number} onChange={e => setProfileData('phone_number', e.target.value)} /></div>
                                <div><InputLabel>LinkedIn URL</InputLabel><InputText type="url" value={profileData.linkedin_url} onChange={e => setProfileData('linkedin_url', e.target.value)} /></div>
                            </div>
                            <div><InputLabel required>Alamat Domisili</InputLabel><TextArea rows="2" value={profileData.address} onChange={e => setProfileData('address', e.target.value)} /></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"><span className="text-sm font-bold text-slate-600 dark:text-slate-300">Sembunyikan Email</span><input type="checkbox" checked={profileData.private_email} onChange={e => setProfileData('private_email', e.target.checked)} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300" /></label>
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"><span className="text-sm font-bold text-slate-600 dark:text-slate-300">Sembunyikan No. HP</span><input type="checkbox" checked={profileData.private_phone} onChange={e => setProfileData('private_phone', e.target.checked)} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300" /></label>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}

            {showJobModal && (
                <Modal title="Tambah Pengalaman" subtitle="Lengkapi rekam jejak karir profesional Anda." onClose={() => setShowJobModal(false)}
                    footer={
                        <>
                            <button onClick={() => setShowJobModal(false)} className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">Batal</button>
                            <button onClick={handleJobSubmit} disabled={jobProcessing} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-sm shadow-lg shadow-brand-500/20">Simpan Data</button>
                        </>
                    }>
                    <form onSubmit={handleJobSubmit} className="space-y-5">
                        <div><InputLabel required>Posisi / Jabatan</InputLabel><InputText type="text" value={jobData.position} onChange={e => setJobData('position', e.target.value)} placeholder="Contoh: Senior Marketing" /></div>
                        <div><InputLabel required>Nama Perusahaan</InputLabel><InputText type="text" value={jobData.company_name} onChange={e => setJobData('company_name', e.target.value)} placeholder="Contoh: PT. Maju Mundur" /></div>
                        <div className="grid grid-cols-2 gap-6">
                            <div><InputLabel required>Tahun Mulai</InputLabel><InputText type="number" value={jobData.start_year} onChange={e => setJobData('start_year', e.target.value)} /></div>
                            <div><InputLabel>Tahun Selesai</InputLabel><InputText type="number" value={jobData.end_year} onChange={e => setJobData('end_year', e.target.value)} placeholder="Kosongkan jika saat ini" /></div>
                        </div>
                        <div><InputLabel>Deskripsi Pekerjaan (Opsional)</InputLabel><TextArea rows="4" value={jobData.description} onChange={e => setJobData('description', e.target.value)} placeholder="Jelaskan tanggung jawab dan pencapaian utama Anda..." /></div>
                    </form>
                </Modal>
            )}

            {showSkillModal && (
                <Modal title="Kelola Keahlian" subtitle="Pilih skill yang relevan untuk meningkatkan visibilitas profil." onClose={() => setShowSkillModal(false)}
                    footer={
                        <>
                            <button onClick={() => setShowSkillModal(false)} className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">Batal</button>
                            <button onClick={handleSkillSubmit} className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors text-sm shadow-lg shadow-brand-500/20">Simpan ({selectedSkills.length})</button>
                        </>
                    }>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4 flex gap-3 items-start">
                        <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">Klik skill untuk memilih atau menghapus. Skill yang dipilih akan muncul di profil dan membantu rekruter menemukan Anda.</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {allSkills.map(skill => (
                            <button key={skill.id} onClick={() => handleSkillToggle(skill.id)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${selectedSkills.includes(skill.id) ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>
                                {skill.name} {selectedSkills.includes(skill.id) && <i className="fa-solid fa-check ml-1 text-[10px]"></i>}
                            </button>
                        ))}
                    </div>
                </Modal>
            )}

            {/* SETTINGS MODAL */}
            {showSettingsModal && (
                <SettingsModal onClose={() => setShowSettingsModal(false)} />
            )}
        </div>
    );
}