import React from 'react';
import Modal from './Modal';

export default function DeleteConfirmModal({ show, onClose, onConfirm, title, description, processing }) {
    // CRITICAL FIX: Force the component to unmount if show is false.
    // This prevents the modal from appearing on page load.
    if (!show) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-small">
                    <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                </div>
                
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {title || 'Hapus Data?'}
                </h2>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {description || 'Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan hilang permanen dari sistem.'}
                </p>

                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        {processing ? (
                            <><i className="fa-solid fa-circle-notch fa-spin"></i> Menghapus...</>
                        ) : (
                            <><i className="fa-solid fa-trash"></i> Ya, Hapus</>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}