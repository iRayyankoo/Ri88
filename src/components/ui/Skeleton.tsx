"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'circle' | 'rect' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = 'rect' }) => {
    const baseClass = "skeletal-glow inline-block";
    const variantClasses = {
        circle: "rounded-full",
        rect: "rounded-[20px]",
        text: "rounded-md h-3 w-full"
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />
    );
};

export default Skeleton;
