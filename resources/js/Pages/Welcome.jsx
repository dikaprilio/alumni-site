import React from 'react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import StatsSection from '../Components/StatsSection';
import DistributionSection from '../Components/DistributionSection';
import AlumniSection from '../Components/AlumniSection';
import NewsSection from '../Components/NewsSection';
import Footer from '../Components/Footer'; // <--- Import Baru

export default function Welcome({ alumniList, jobStats, totalAlumni, latestUpdates }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-brand-500 selection:text-white">
            <Header />
            
            <main>
                <HeroSection />
                <StatsSection />                
                <AboutSection />
                <DistributionSection jobStats={jobStats} totalAlumni={totalAlumni} />
                <AlumniSection alumniList={alumniList} />
                <NewsSection latestUpdates={latestUpdates} />
            </main>

            {/* Ganti div footer lama dengan Component Footer */}
            <Footer />
        </div>
    );
}