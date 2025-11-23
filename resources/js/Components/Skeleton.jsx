import React from 'react';

export default function Skeleton({ className = "", width, height, variant = "text" }) {
    const baseClasses = "animate-shimmer bg-slate-200 dark:bg-slate-800";
    const variants = {
        text: "rounded-md",
        circle: "rounded-full",
        rect: "rounded-xl",
    };

    return (
        <div 
            className={`${baseClasses} ${variants[variant]} ${className}`} 
            style={{ width, height }}
        />
    );
}