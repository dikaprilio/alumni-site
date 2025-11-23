import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import StatsSection from '../Components/StatsSection';
import DistributionSection from '../Components/DistributionSection';
import AlumniSection from '../Components/AlumniSection';
import FeaturedAlumniSection from '../Components/FeaturedAlumniSection'; // Import Component
import NewsSection from '../Components/NewsSection';
import CTASection from '../Components/CTASection';

function Welcome({ alumniList, alumniOfTheMonth, jobStats, totalAlumni, latestUpdates }) {
    return (
        <>
            <Head title="Home - Sekolah Vokasi IPB" />
            
            <HeroSection />
            <StatsSection />                
            
            {alumniOfTheMonth && <FeaturedAlumniSection alumni={alumniOfTheMonth} />}
            
            <AboutSection />
            <DistributionSection jobStats={jobStats} totalAlumni={totalAlumni} />
            <AlumniSection alumniList={alumniList} />
            <NewsSection latestUpdates={latestUpdates} />
            <CTASection />
        </>
    );
}

Welcome.layout = page => <PublicLayout children={page} />;

export default Welcome;