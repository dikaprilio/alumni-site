import React from 'react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
            <Header />
            <main>
                <HeroSection />
                <div className="py-16 bg-white dark:bg-slate-800 text-center transition-colors duration-300">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Bagian Konten Lainnya...</h2>
                    <p className="mt-4 text-gray-600 dark:text-slate-300">Di sini Anda bisa menambahkan bagian "Tentang Kami", "Berita Terbaru", dll.</p>
                </div>
            </main>
        </div>
    );
}