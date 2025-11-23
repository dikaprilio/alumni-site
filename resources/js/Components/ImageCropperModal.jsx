import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from './Modal'; 
import getCroppedImg from '../Utils/cropUtils';

export default function ImageCropperModal({ show, onClose, imageSrc, onCropComplete, aspectRatio = 1 }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
            onClose(); 
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Prevent rendering if not shown
    if (!show) return null;

    return (
        <Modal title="Sesuaikan Gambar" onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                {/* Cropper Container */}
                <div className="relative w-full h-80 bg-slate-900 rounded-2xl overflow-hidden mb-6 shadow-inner border border-slate-700">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio} // Dynamic Aspect Ratio
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        showGrid={true} // Show grid for better precision
                    />
                </div>

                {/* Controls */}
                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Zoom Level
                    </label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(e.target.value)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-brand-600"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-slate-500 font-bold text-xs uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all shadow-lg hover:shadow-brand-600/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                        {loading ? 'Memproses...' : 'Potong & Simpan'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}