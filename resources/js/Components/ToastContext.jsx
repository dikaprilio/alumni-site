import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-slide-in backdrop-blur-md min-w-[300px] transition-all duration-300 transform hover:scale-105 cursor-pointer
                            ${toast.type === 'success' 
                                ? 'bg-white/90 border-emerald-100 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-100' 
                                : toast.type === 'error'
                                ? 'bg-white/90 border-red-100 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100'
                                : 'bg-white/90 border-blue-100 text-blue-800 dark:bg-blue-900/90 dark:border-blue-800 dark:text-blue-100'
                            }`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                            ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-200' 
                            : toast.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'}`}>
                            <i className={`fa-solid ${
                                toast.type === 'success' ? 'fa-check' 
                                : toast.type === 'error' ? 'fa-triangle-exclamation' 
                                : 'fa-circle-info'} text-sm`}></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">
                                {toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Error' : 'Info'}
                            </p>
                            <p className="text-sm font-medium leading-tight">{toast.message}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }} className="ml-2 text-current opacity-40 hover:opacity-100 transition-opacity">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};