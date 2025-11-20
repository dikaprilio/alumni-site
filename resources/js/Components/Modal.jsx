import React from 'react';

export default function Modal({ title, subtitle, onClose, children, footer }) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-end md:items-center justify-center md:p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 w-full md:max-w-2xl max-h-[90vh] md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col animate-fade-in-up overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10 shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} type="button" className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                        <i className="fa-solid fa-times"></i>
                    </button>
                </div>

                <div className="overflow-y-auto p-6 custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 shrink-0 flex justify-end gap-3 sticky bottom-0 pb-8 md:pb-5">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}