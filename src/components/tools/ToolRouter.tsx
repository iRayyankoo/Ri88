"use client";
import React from 'react';
import FinanceTools from './FinanceTools';
import TextTools from './TextTools';
import ProductivityTools from './ProductivityTools';
import TimeTools from './TimeTools';
import MediaTools from './MediaTools';
import PdfTools from './PdfTools';
import HealthTools from './HealthTools';
import SaudiTools from './SaudiTools';
import DeveloperTools from './DeveloperTools';
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

        case 'pdf':
            return <PdfTools toolId={id} />;

        case 'health':
            return <HealthTools toolId={id} />;

        case 'saudi':
            return <SaudiTools toolId={id} />;

        case 'developer':
            return <DeveloperTools toolId={id} />;

        case 'education':
        case 'languages':
        case 'sports':
            // These are likely new categories that might not have a dedicated component yet
            // or should be handled by a generic one. For now, we'll show a "Maintenance" placeholder
            // unless we confirm they have components.
            // Checking logic: We don't have EducationTools.tsx etc yet.
            return (
                <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                    <h2 style={{ fontSize: '2em', marginBottom: '10px' }}>🚧</h2>
                    <h3>Under Construction</h3>
                    <p>The {cat} tools are being updated.</p>
                </div>
            );

        default:
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <h3>🚧 Unknown Category</h3>
                    <p>Tool ID: {id} (Category: {cat})</p>
                </div>
            );
    }
}
