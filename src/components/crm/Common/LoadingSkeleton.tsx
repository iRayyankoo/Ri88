"use client";

import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-white/5 rounded-md ${className}`} />
);

export const ClientSkeleton = () => (
    <div className="bg-surface-raised border border-border-strong rounded-xl p-4 mb-3">
        <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    </div>
);

export const PipelineSkeleton = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[320px] bg-black/20 rounded-2xl p-4">
                <Skeleton className="h-8 w-1/2 mb-6" />
                <div className="space-y-4">
                    {[1, 2].map((j) => (
                        <div key={j} className="bg-white/5 rounded-xl p-4 h-32">
                            <Skeleton className="h-5 w-3/4 mb-3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export const TaskSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4 ml-auto" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        ))}
    </div>
);
export const CRMSkeleton = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-surface-base p-6 rounded-3xl border border-border-subtle">
            <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32 rounded-[2rem]" />
            <Skeleton className="h-32 rounded-[2rem]" />
            <Skeleton className="h-32 rounded-[2rem]" />
            <Skeleton className="h-32 rounded-[2rem]" />
        </div>
        <PipelineSkeleton />
    </div>
);
