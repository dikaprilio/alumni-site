import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '../Layouts/PublicLayout';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Components/AboutSection';
import StatsSection from '../Components/StatsSection';
import DistributionSection from '../Components/DistributionSection';
import AlumniSection from '../Components/AlumniSection';
import FeaturedAlumniSection from '../Components/FeaturedAlumniSection';
import NewsSection from '../Components/NewsSection';
import CTASection from '../Components/CTASection';
import Reveal from '../Components/Reveal'; // Import the new component

function Welcome({ alumniList, alumniOfTheMonth, jobStats, totalAlumni, latestUpdates }) {
    return (
        <>
            <Head title="Home - Sekolah Vokasi IPB" />
            
            {/* Hero usually loads immediately, so we keep it static or use internal load animations */}
            <HeroSection />

            {/* Stats: Pop in with a bounce to emphasize numbers */}
            <div className="bg-gray-50 dark:bg-gray-900">
                    <StatsSection />
            </div>          

            {/* Featured Alumni: Elegant fade up scale to highlight the star alumni */}
            {alumniOfTheMonth && (
                <Reveal animation="animate-fade-in-up-scale" threshold={0.1}>
                    <FeaturedAlumniSection alumni={alumniOfTheMonth} />
                </Reveal>
            )}
            
            {/* About: Slide in from left for dynamic flow */}
            <Reveal animation="animate-slide-in-left" duration="duration-1000" threshold={0.15}>
                <AboutSection />
            </Reveal>

            {/* Distribution: Slide from right to balance the previous section */}
            <Reveal animation="animate-slide-in-right" threshold={0.15}>
                <DistributionSection jobStats={jobStats} totalAlumni={totalAlumni} />
            </Reveal>

            {/* Alumni List: Standard Fade Up for clean list reading */}
            <Reveal animation="animate-fade-in-up" delay="delay-200">
                <AlumniSection alumniList={alumniList} />
            </Reveal>

            {/* News: Fade up with scale, feels like "breaking news" popping up */}
            <Reveal animation="animate-fade-in-up-scale" threshold={0.1}>
                <NewsSection latestUpdates={latestUpdates} />
            </Reveal>

            {/* CTA: Strong Zoom In to catch attention at the end */}
            <Reveal animation="animate-zoom-in" delay="delay-100" threshold={0.5}>
                <CTASection />
            </Reveal>
        </>
    );
}

Welcome.layout = page => <PublicLayout children={page} />;

export default Welcome;