import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import Modal from '../../Components/Modal';
import MonthYearPicker from '../../Components/MonthYearPicker';
import ImageCropperModal from '../../Components/ImageCropperModal'; // Import Cropper

// --- HELPER: DATE FORMATTER ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

// --- COMPONENT: COMPLETENESS WIDGET ---
const CompletenessWidget = ({ completeness, missingFields }) => {
    const getBadge = (score) => {
        if (score === 100) return { label: 'Alumni Legend', color: 'text-purple-500', icon: 'fa-trophy' };
        if (score >= 80) return { label: 'Rising Star', color: 'text-amber-500', icon: 'fa-star' };
        if (score >= 50) return { label: 'Profile Starter', color: 'text-blue-500', icon: 'fa-medal' };
        return { label: 'Newcomer', color: 'text-slate-400', icon: 'fa-user' };
    };

    const badge = getBadge(completeness);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <i className={`fa-solid ${badge.icon} text-9xl`}></i>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * completeness) / 100} className={`transition-all duration-1000 ease-out ${completeness === 100 ? 'text-green-500' : 'text-brand-600'}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-xl font-black text-slate-900 dark:text-white">{completeness}%</span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Profile Strength</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${badge.color} border-current bg-opacity-10`}>
                            {badge.label}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 max-w-xl">
                        {completeness === 100
                            ? "Amazing! Your profile is fully complete. You are now eligible to be featured as Alumni of the Month!"
                            : "Complete your profile to unlock directory visibility and special badges."}
                    </p>

                    {/* Missing Fields Hint */}
                    {missingFields.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Next Steps:</span>
                            {missingFields.map((field, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase rounded hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors cursor-help" title={`Please add ${field}`}>
                                    + {field}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Edit({ alumni, user_name, allSkills = [] }) {

    // 1. MAIN FORM STATE (PROFILE)
    // REMOVED current_position and company_name from here as requested
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        avatar: null,
        name: user_name || '',
        phone_number: alumni.phone_number || '',
        address: alumni.address || '',
        graduation_year: alumni.graduation_year || new Date().getFullYear(),
        major: alumni.major || 'Teknik Komputer',
        linkedin_url: alumni.linkedin_url || '', // NEW FIELD
        bio: alumni.bio || '',
        skills: alumni.skills ? alumni.skills.map(s => s.id) : [],
    });

    // 2. JOB MODAL FORM STATE
    const jobForm = useForm({
        company_name: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        is_current: false,
    });

    const [avatarPreview, setAvatarPreview] = useState(alumni.avatar ? `/storage/${alumni.avatar}` : null);
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

    // --- CROPPER STATE ---
    const [imageSrc, setImageSrc] = useState(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);


    // Flash Message
    const { flash } = usePage().props;

    const completeness = alumni.profile_completeness; // AMBIL DARI PROP
    const missingFields = alumni.missing_fields;      // AMBIL DARI PROP
    // --- HANDLERS ---

    // 1. Triggered when user selects a file
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result); // Set source for cropper
                setIsCropperOpen(true);     // Open Modal
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    };

    // 2. Triggered when user clicks "Apply" in Cropper Modal
    const handleCropComplete = (croppedBlob) => {
        // Create a preview URL for UI
        const newPreviewUrl = URL.createObjectURL(croppedBlob);
        setAvatarPreview(newPreviewUrl);
        
        // Set the cropped blob to form data
        setData('avatar', croppedBlob);
        setIsCropperOpen(false);
    };

    const submitMain = (e) => {
        e.preventDefault();
        post(route('alumni.update'), {
            preserveScroll: true,
        });
    };

    // Skills Logic
    const addSkill = () => {
        if (selectedSkillId) {
            const id = parseInt(selectedSkillId);
            if (!data.skills.includes(id)) {
                setData('skills', [...data.skills, id]);
            }
            setSelectedSkillId('');
        }
    };

    const removeSkill = (id) => {
        setData('skills', data.skills.filter(sId => sId !== id));
    };

    const getSkillName = (id) => {
        const s = allSkills.find(x => x.id === id);
        return s ? s.name : 'Unknown';
    };

    // Job Modal Logic
    const openJobModal = () => {
        jobForm.reset();
        jobForm.clearErrors();
        setIsJobModalOpen(true);
    };

    const submitJob = (e) => {
        e.preventDefault();
        if (jobForm.data.is_current) {
            jobForm.setData('end_date', '');
        }

        jobForm.post(route('alumni.jobs.add'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsJobModalOpen(false);
                jobForm.reset();
            },
        });
    };

    const deleteJob = (id) => {
        if (confirm('Are you sure you want to remove this experience?')) {
            router.delete(route('alumni.jobs.delete', id), { preserveScroll: true });
        }
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
            <Head title="Edit Profile" />

            <div className="max-w-[800px] mx-auto px-6 md:px-12">

                {/* FLASH MESSAGE TOAST */}
                {flash.message && (
                    <div className="fixed top-24 right-6 z-50 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl shadow-2xl flex items-center gap-3 text-green-700 dark:text-green-300 animate-bounce">
                        <i className="fa-solid fa-circle-check text-xl"></i>
                        <span className="font-bold">{flash.message}</span>
                    </div>
                )}

                {/* COMPLETENESS WIDGET */}
                <CompletenessWidget completeness={completeness} missingFields={missingFields} />

                {/* HEADER */}
                <div className="mb-8">
                    <Link href="/alumni/dashboard" className="text-xs font-mono text-slate-500 hover:text-brand-600 mb-2 block">
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Edit Profile
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Update your professional information and keep your profile fresh.
                    </p>
                </div>

                <form onSubmit={submitMain} className="space-y-8">

                    {/* 1. AVATAR SECTION */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 rounded-2xl shadow-sm">
                        <div className="relative w-28 h-28 flex-shrink-0 group">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-950 shadow-lg">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                                        {data.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {/* Changed label to trigger new handleAvatarChange */}
                            <label htmlFor="avatar" className="absolute bottom-0 right-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-500 transition-colors shadow-lg transform group-hover:scale-110">
                                <i className="fa-solid fa-camera text-xs"></i>
                                <input type="file" id="avatar" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Profile Picture</h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                Upload a professional photo to increase your directory visibility. JPG/PNG, max 2MB.
                            </p>
                            {errors.avatar && <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>}
                        </div>
                    </div>

                    {/* 2. PERSONAL INFO */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                                <i className="fa-regular fa-id-card"></i>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
                                Personal Info
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Full Name" id="name" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                            <InputGroup label="WhatsApp / Phone" id="phone" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} error={errors.phone_number} placeholder="0812..." />

                            <div className="md:col-span-2">
                                <InputGroup label="LinkedIn URL (Public Profile)" id="linkedin" value={data.linkedin_url} onChange={e => setData('linkedin_url', e.target.value)} error={errors.linkedin_url} placeholder="https://linkedin.com/in/username" icon="fa-brands fa-linkedin" />
                            </div>

                            <div className="md:col-span-2">
                                <InputGroup label="Current Address" id="address" value={data.address} onChange={e => setData('address', e.target.value)} error={errors.address} placeholder="City, Country" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Bio / Summary</label>
                                <textarea
                                    value={data.bio}
                                    onChange={e => setData('bio', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-all min-h-[100px] resize-none rounded-xl"
                                    placeholder="Tell us a bit about yourself, your expertise, and what you are currently working on..."
                                ></textarea>
                                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                            </div>
                        </div>
                    </div>

                    {/* 3. PROFESSIONAL DATA - Updated: Removed manual Current Position inputs */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-graduation-cap"></i>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
                                Academic Info
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Graduation Year" id="year" type="number" value={data.graduation_year} onChange={e => setData('graduation_year', e.target.value)} error={errors.graduation_year} />
                            <InputGroup label="Major / Jurusan" id="major" value={data.major} onChange={e => setData('major', e.target.value)} error={errors.major} />
                        </div>
                    </div>

                    {/* 4. WORK EXPERIENCE (LIST) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
                                    Work History
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={openJobModal}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-600 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                            >
                                <i className="fa-solid fa-plus"></i> Add Job
                            </button>
                        </div>

                         {/* Note explaining normalization */}
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-lg flex items-start gap-2">
                            <i className="fa-solid fa-circle-info mt-0.5"></i>
                            <p>Your "Current Position" is determined automatically by the job marked as <strong>Present</strong> below.</p>
                        </div>

                        <div className="space-y-6 relative">
                            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800"></div>

                            {alumni.job_histories && alumni.job_histories.length > 0 ? (
                                alumni.job_histories.map((job) => (
                                    <div key={job.id} className="relative pl-8 group">
                                        <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 group-hover:bg-brand-500 transition-colors z-10"></div>

                                        <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-brand-200 dark:hover:border-brand-800 transition-colors relative">
                                            <button
                                                type="button"
                                                onClick={() => deleteJob(job.id)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>

                                            <h4 className="font-bold text-slate-900 dark:text-white">{job.position}</h4>
                                            <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{job.company_name}</div>

                                            {/* DATE FORMATTER APPLIED HERE */}
                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-3">
                                                <i className="fa-regular fa-calendar"></i>
                                                <span>
                                                    {formatDate(job.start_date)}
                                                    {' - '}
                                                    {job.end_date
                                                        ? formatDate(job.end_date)
                                                        : <span className="text-brand-600 font-bold">Present</span>
                                                    }
                                                </span>
                                            </div>

                                            {job.description && (
                                                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                                                    {job.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic pl-8">No work experience added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* 5. SKILLS */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
                                Skills & Expertise
                            </h3>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <select
                                    value={selectedSkillId}
                                    onChange={(e) => setSelectedSkillId(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none appearance-none transition-all rounded-xl"
                                >
                                    <option value="" disabled>Select a skill...</option>
                                    {allSkills.map((skill) => (
                                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addSkill}
                                disabled={!selectedSkillId}
                                className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                            {data.skills.length > 0 ? (
                                data.skills.map((skillId) => (
                                    <span key={skillId} className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-700 dark:text-slate-300 rounded-md shadow-sm group">
                                        {getSkillName(skillId)}
                                        <button type="button" onClick={() => removeSkill(skillId)} className="text-slate-400 hover:text-red-500 ml-1 transition-colors"><i className="fa-solid fa-xmark"></i></button>
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 text-xs italic">No skills selected.</span>
                            )}
                        </div>
                    </div>

                    {/* SUBMIT BUTTON - RESPONSIVE POSITIONING (Floating on Mobile, Docked on Desktop) */}
                    <div className="
                        fixed z-40 transition-all duration-300
                        bottom-24 left-4 right-4 md:bottom-0 md:left-0 md:right-0
                        md:p-4 md:px-12 
                        md:bg-white/90 md:dark:bg-slate-950/90 md:backdrop-blur-lg md:border-t md:border-slate-200 md:dark:border-slate-800 md:shadow-[0_-4px_20px_rgba(0,0,0,0.05)]
                        flex justify-end items-center
                        pointer-events-none md:pointer-events-auto
                    ">
                        <div className="max-w-[800px] w-full mx-auto flex justify-between md:justify-end items-center gap-4 pointer-events-auto">
                            <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:block italic">
                                Don't forget to save your changes &rarr;
                            </span>
                            <button
                                type="submit"
                                disabled={processing}
                                className="
                                    w-full md:w-auto px-6 py-3 bg-brand-600 text-white font-black uppercase tracking-widest 
                                    hover:bg-brand-700 transition-all 
                                    shadow-xl shadow-brand-600/20 md:shadow-lg md:hover:shadow-brand-600/30 
                                    disabled:opacity-70 rounded-xl flex items-center justify-center gap-3 transform hover:-translate-y-1
                                "
                            >
                                {processing && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            {/* SPACER FOR FIXED BOTTOM BAR (Increased for mobile safety) */}
            <div className="h-40 md:h-24"></div>

            {/* --- MODAL: ADD JOB --- */}
            {isJobModalOpen && (
                <Modal
                    title="Add Experience"
                    onClose={() => setIsJobModalOpen(false)}
                >
                    <form onSubmit={submitJob} className="space-y-5">
                        <InputGroup
                            label="Company Name"
                            id="modal_company"
                            value={jobForm.data.company_name}
                            onChange={e => jobForm.setData('company_name', e.target.value)}
                            error={jobForm.errors.company_name}
                            placeholder="e.g. Gojek"
                        />
                        <InputGroup
                            label="Job Position"
                            id="modal_position"
                            value={jobForm.data.position}
                            onChange={e => jobForm.setData('position', e.target.value)}
                            error={jobForm.errors.position}
                            placeholder="e.g. Senior Backend Dev"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <MonthYearPicker
                                label="Start Date"
                                value={jobForm.data.start_date}
                                onChange={(dateStr) => jobForm.setData('start_date', dateStr)}
                                error={jobForm.errors.start_date}
                            />

                            <div className={jobForm.data.is_current ? 'opacity-50 pointer-events-none' : ''}>
                                <MonthYearPicker
                                    label="End Date"
                                    value={jobForm.data.end_date}
                                    onChange={(dateStr) => jobForm.setData('end_date', dateStr)}
                                    error={jobForm.errors.end_date}
                                    disabled={jobForm.data.is_current}
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                                checked={jobForm.data.is_current}
                                onChange={e => jobForm.setData('is_current', e.target.checked)}
                            />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                I currently work here
                            </span>
                        </label>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                            <textarea
                                value={jobForm.data.description}
                                onChange={e => jobForm.setData('description', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 outline-none transition-all resize-none rounded-xl"
                                rows="3"
                                placeholder="Describe your responsibilities..."
                            ></textarea>
                            {jobForm.errors.description && <p className="text-red-500 text-xs mt-1">{jobForm.errors.description}</p>}
                        </div>

                        <div className="flex justify-end pt-4 gap-3">
                            <button
                                type="button"
                                onClick={() => setIsJobModalOpen(false)}
                                className="px-4 py-2 text-slate-500 font-bold text-xs uppercase hover:text-slate-700 dark:hover:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={jobForm.processing}
                                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-colors disabled:opacity-50"
                            >
                                {jobForm.processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* --- MODAL: CROPPER --- */}
            <ImageCropperModal
                show={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                imageSrc={imageSrc}
                onCropComplete={handleCropComplete}
            />

        </div>
    );
}

function InputGroup({ label, id, type = 'text', value, onChange, error, placeholder, icon }) {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className={icon}></i>
                    </div>
                )}
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-white focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-all rounded-xl ${icon ? 'pl-10' : ''}`}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

Edit.layout = page => <PublicLayout children={page} />;