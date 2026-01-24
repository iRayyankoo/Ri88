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

    // Route based on Category first (optimization) or just ID if unique enough
    // Our IDs are fairly unique strings.

    // Finance
    // Note: 'loan-calc', 'vat-calc', 'net-salary', 'zakat', 'savings', 'fin-discount', 'currency', 'fin-crypto'
    if (['loan-calc', 'vat-calc', 'net-salary', 'zakat', 'savings', 'fin-discount', 'currency', 'fin-crypto'].includes(id)) {
        return <FinanceTools toolId={id} />;
    }

    // Text
    // IDs: adobe-fix, cleaner, case, hashtag, utm, text-link, text-punc, text-dia, text-lorem
    if (['adobe-fix', 'cleaner', 'case', 'hashtag', 'utm', 'text-link', 'text-punc', 'text-dia', 'text-lorem'].includes(id)) {
        return <TextTools toolId={id} />;
    }

    // Time
    // IDs: hijri, diff, timer, timezone, time-add
    if (['hijri', 'diff', 'timer', 'timezone', 'time-add'].includes(id)) {
        return <TimeTools toolId={id} />;
    }

    // Productivity
    // IDs: qr, unit, password, speed, prod-iban, prod-inv, prod-pomodoro, life-bill, life-decision, life-tip, life-reaction
    if (['qr', 'unit', 'password', 'speed', 'prod-iban', 'prod-inv', 'prod-pomodoro', 'life-bill', 'life-decision', 'life-tip', 'life-reaction'].includes(id)) {
        return <ProductivityTools toolId={id} />;
    }

    // Media & Image
    // IDs: img-compress, img-resize, img-webp, img-filter, media-rec
    if (['img-compress', 'img-resize', 'img-webp', 'img-filter', 'media-rec'].includes(id)) {
        return <MediaTools toolId={id} />;
    }

    // PDF Tools
    // IDs: pdf-merge, pdf-split, pdf-protect, pdf-watermark
    if (['pdf-merge', 'pdf-split', 'pdf-protect', 'pdf-watermark'].includes(id)) {
        return <PdfTools toolId={id} />;
    }

    // Health
    if (['bmi', 'calories', 'water', 'sleep-calc', 'breathing'].includes(id)) {
        return <HealthTools toolId={id} />;
    }

    // Saudi
    if (id.startsWith('saudi-')) {
        return <SaudiTools toolId={id} />;
    }

    // Developer
    if (id.startsWith('dev-')) {
        return <DeveloperTools toolId={id} />;
    }

    return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <h3>🚧 Coming Soon</h3>
            <p>Tool ID: {id}</p>
            <p>This tool is not yet migrated to the new system.</p>
        </div>
    );
}
