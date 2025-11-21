import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout'; // <--- Import Layout
// Hapus import Header & Footer
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import StatsSection from '../Components/StatsSection';
import DistributionSection from '../Components/DistributionSection';
import AlumniSection from '../Components/AlumniSection';
import NewsSection from '../Components/NewsSection';
import CTASection from '../Components/CTASection';

function Welcome({ alumniList, jobStats, totalAlumni, latestUpdates }) {
    return (
        <>
            <Head title="Home - Sekolah Vokasi IPB" />

            {/* Tidak perlu <div min-h-screen> atau <main> lagi.
                Langsung render komponen section-nya.
                Layout akan menangani sisanya.
            */}
            
            <HeroSection />
            <StatsSection />                
            <AboutSection />
            <DistributionSection jobStats={jobStats} totalAlumni={totalAlumni} />
            <AlumniSection alumniList={alumniList} />
            <NewsSection latestUpdates={latestUpdates} />
            <CTASection />
        </>
    );
}

// DEFINE PERSISTENT LAYOUT
Welcome.layout = page => <PublicLayout children={page} />;

export default Welcome;