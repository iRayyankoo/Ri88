"use client";
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { tools } from '@/data/tools';
import { ArrowRight } from 'lucide-react';
import ToolRouter from '../tools/ToolRouter';

export const resolveActiveTool = (activeToolId: string | null, activeDbTool: Record<string, unknown> | null) => {
    const staticTool = tools.find(t => t.id === activeToolId);
    let routerId = activeToolId || tools[0].id;
    const dbStr = (key: string): string => (typeof activeDbTool?.[key] === 'string' ? activeDbTool[key] as string : '');
    const dbToolUrl = dbStr('url');
    if (dbToolUrl.startsWith('/tools/')) {
        routerId = dbToolUrl.replace('/tools/', '');
    }

    return {
        id: routerId,
        cat: activeDbTool ? (dbStr('category') || staticTool?.cat || tools[0].cat) : (staticTool?.cat || tools[0].cat),
        icon: dbStr('icon') || staticTool?.icon || tools[0].icon,
        status: staticTool?.status || 'existing',
        title: activeDbTool ? (dbStr('name') || tools[0].title) : (staticTool?.title || tools[0].title),
        titleAr: activeDbTool ? (dbStr('name') || tools[0].titleAr) : (staticTool?.titleAr || tools[0].titleAr),
        desc: activeDbTool ? (dbStr('description') || tools[0].desc) : (staticTool?.desc || tools[0].desc),
        descAr: activeDbTool ? (dbStr('description') || tools[0].descAr) : (staticTool?.descAr || tools[0].descAr),
    };
};

const ToolWorkspace = () => {
    const { activeToolId, activeDbTool, setCurrentView, showToolPopup } = useNavigation();
    const tool = resolveActiveTool(activeToolId, activeDbTool);

    return (
        <div className={`h-full flex flex-col w-full ${showToolPopup ? '' : 'px-4 lg:px-12 xl:px-20 pb-20'}`}>
            <main className="flex-1 flex flex-col overflow-hidden w-full max-w-7xl mx-auto">
                {/* STANDALONE PAGE HEADER (Only shown when NOT inside popup) */}
                {!showToolPopup && (
                    <header className="flex items-center justify-between py-6 mb-6 border-b border-border-subtle shrink-0">
                        <div className="flex items-center gap-4 lg:gap-6">
                            <button
                                onClick={() => setCurrentView('directory')}
                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-surface-raised hover:bg-surface-glass flex items-center justify-center text-text-primary transition-all border border-border-subtle shadow-sm"
                                aria-label="العودة للدليل"
                            >
                                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                            </button>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-xl lg:text-3xl font-black text-text-primary font-cairo tracking-tight">
                                        {tool.titleAr || tool.title}
                                    </h1>
                                    <div className="px-2.5 py-1 rounded-md bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-mono font-bold text-brand-primary uppercase tracking-wider">
                                        {tool.cat}
                                    </div>
                                </div>
                                <p className="text-xs lg:text-sm text-text-muted font-medium font-cairo max-w-2xl leading-relaxed">
                                    {tool.descAr || tool.desc}
                                </p>
                            </div>
                        </div>
                    </header>
                )}

                {/* TOOL CANVAS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="pb-6 pt-1">
                        <ToolRouter tool={tool} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ToolWorkspace;
