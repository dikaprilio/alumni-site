import React from 'react';

export default function TextArea(props) {
    return (
        <textarea 
            {...props}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all bg-white dark:bg-slate-700 dark:text-white resize-none placeholder-slate-400"
        ></textarea>
    );
}