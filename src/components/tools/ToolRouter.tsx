"use client";
import React from 'react';
import FinanceTools from './FinanceTools';
import TextTools from './TextTools';
import ProductivityTools from './ProductivityTools';
import TimeTools from './TimeTools';
import MediaTools from './MediaTools';
import PdfTools from './PdfTools';
import ContentTools from './ContentTools';
import HealthTools from './HealthTools';
import SaudiTools from './SaudiTools';
import DeveloperTools from './DeveloperTools';
import EducationTools from './EducationTools';
import DesignTools from './DesignTools';
import LanguagesTools from './LanguagesTools';
import SportsDashboard from '../sports/SportsDashboard';
import { Tool } from '@/data/tools';

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
        case 'media':
            return <MediaTools toolId={id} />;

        case 'content':
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

        case 'sports':
            // All sport tools route to the main dashboard for now, 
            // potentially pre-selecting a league based on ID could be added to SportsDashboard later
            return <SportsDashboard />;

        default:
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <h3>🚧 Unknown Category</h3>
                    <p>Tool ID: {id} (Category: {cat})</p>
                </div>
            );
    }
}
