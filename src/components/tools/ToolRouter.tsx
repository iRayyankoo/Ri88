"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Tool } from '@/data/tools';
import { Loader2 } from 'lucide-react';

// Loading Fallback
const ToolLoader = () => (
    <div className="flex flex-col items-center justify-center py-20 h-full w-full">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
        <p className="text-slate-400 font-cairo animate-pulse">جاري تحميل الأداة...</p>
    </div>
);

// Dynamic Imports for Code Splitting
const FinanceTools = dynamic(() => import('./FinanceTools'), { loading: () => <ToolLoader /> });
const TextTools = dynamic(() => import('./TextTools'), { loading: () => <ToolLoader /> });
const ProductivityTools = dynamic(() => import('./ProductivityTools'), { loading: () => <ToolLoader /> });
const TimeTools = dynamic(() => import('./TimeTools'), { loading: () => <ToolLoader /> });
const MediaTools = dynamic(() => import('./MediaTools'), { loading: () => <ToolLoader /> });
const PdfTools = dynamic(() => import('./PdfTools'), { loading: () => <ToolLoader /> });
const ContentTools = dynamic(() => import('./ContentTools'), { loading: () => <ToolLoader /> });
const HealthTools = dynamic(() => import('./HealthTools'), { loading: () => <ToolLoader /> });
const SaudiTools = dynamic(() => import('./SaudiTools'), { loading: () => <ToolLoader /> });
const DeveloperTools = dynamic(() => import('./DeveloperTools'), { loading: () => <ToolLoader /> });
const EducationTools = dynamic(() => import('./EducationTools'), { loading: () => <ToolLoader /> });
const DesignTools = dynamic(() => import('./DesignTools'), { loading: () => <ToolLoader /> });
const LanguagesTools = dynamic(() => import('./LanguagesTools'), { loading: () => <ToolLoader /> });
const AiTools = dynamic(() => import('./AiTools'), { loading: () => <ToolLoader /> });
const VideoTools = dynamic(() => import('./VideoTools'), { loading: () => <ToolLoader /> });
const SportsDashboard = dynamic(() => import('../sports/SportsDashboard'), { loading: () => <ToolLoader /> });

interface ToolRouterProps {
    tool: Tool;
}

export default function ToolRouter({ tool }: ToolRouterProps) {
    const cat = tool.cat;
    const id = tool.id;

    // Route based on Category
    switch (cat) {
        case 'finance':
            return <FinanceTools toolId={id} />;

        case 'text':
            return <TextTools toolId={id} />;

        case 'time':
            return <TimeTools toolId={id} />;

        case 'productivity':
            return <ProductivityTools toolId={id} />;

        case 'image':
            return <MediaTools toolId={id} />;

        case 'media':
            return <VideoTools toolId={id} />;

        case 'content':
            if (id === 'media-rec') return <MediaTools toolId={id} />;
            return <ContentTools toolId={id} />;

        case 'pdf':
            return <PdfTools toolId={id} />;

        case 'health':
            return <HealthTools toolId={id} />;

        case 'saudi':
            return <SaudiTools toolId={id} />;

        case 'developer':
            return <DeveloperTools toolId={id} />;

        case 'education':
            return <EducationTools toolId={id} />;

        case 'design':
            return <DesignTools toolId={id} />;

        case 'languages':
            return <LanguagesTools toolId={id} />;

        case 'ai-tools':
            return <AiTools toolId={id} />;

        case 'sports':
            // All sport tools route to the main dashboard for now, 
            // potentially pre-selecting a league based on ID could be added to SportsDashboard later
            return <SportsDashboard />;

        default:
            return (
                <div className="unknown-category">
                    <h3>🚧 Unknown Category</h3>
                    <p>Tool ID: {id} (Category: {cat})</p>
                    <style jsx>{`
                        .unknown-category { text-align: center; padding: 40px; color: #888; }
                    `}</style>
                </div>
            );
    }
}
