import React from 'react';

export default function TabButton({ id, label, icon, activeTab, onClick }) {
    return (
        <button 
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all border-b-[3px] whitespace-nowrap ${
                activeTab === id 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-800'
            }`}
        >
            <i className={`fa-solid ${icon}`}></i> {label}
        </button>
    );
}