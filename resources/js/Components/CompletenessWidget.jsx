import React from 'react';
import { Link } from '@inertiajs/react';

export default function CompletenessWidget({ completeness, missingFields }) {
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