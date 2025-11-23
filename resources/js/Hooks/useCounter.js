import { useState, useEffect } from 'react';

export const useCounter = (end, duration = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const start = 0;
        
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function: easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration]);

    return count;
};