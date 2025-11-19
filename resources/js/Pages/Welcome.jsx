// resources/js/Pages/Welcome.jsx
import React from 'react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
                <HeroSection />
                {/* Other sections will go here */}
                <div className="py-16 bg-white text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Content will follow here...</h2>
                    <p className="mt-4 text-gray-600">This is where the About, Statistics, Alumni, and News sections will be placed.</p>
                </div>
            </main>
        </div>
    );
}