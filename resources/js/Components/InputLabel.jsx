import React from 'react';

export default function InputLabel({ children, required }) {
    return (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    );
}