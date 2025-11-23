import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal Component
 * Adds animation classes when the element scrolls into view.
 * * @param {string} animation - The animation class from your CSS (e.g., 'animate-fade-in-up')
 * @param {string} delay - Optional delay class (e.g., 'delay-200')
 * @param {number} threshold - How much of the item must be visible (0 to 1)
 * @param {string} className - Extra classes for the wrapper
 */
export default function Reveal({ 
    children, 
    animation = 'animate-fade-in-up', 
    delay = '', 
    threshold = 0.1, 
    className = '' 
}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger only once when it comes into view
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px', // Trigger slightly before bottom of screen
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    return (
        <div 
            ref={ref} 
            className={`${className} ${isVisible ? `${animation} ${delay}` : 'opacity-0'}`}
        >
            {children}
        </div>
    );
}