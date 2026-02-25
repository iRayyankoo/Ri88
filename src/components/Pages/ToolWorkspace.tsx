"use client";
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { tools } from '@/data/tools';
import { ArrowRight } from 'lucide-react';
import ToolRouter from '../tools/ToolRouter';

const ToolWorkspace = () => {
    const { activeToolId, activeDbTool, setCurrentView, showToolPopup } = useNavigation();

    // 1. Find the static tool if it exists
    const staticTool = tools.find(t => t.id === activeToolId);

    // 2. Extract router ID if it's a DB tool with a valid internal URL component
    let routerId = activeToolId || tools[0].id;
    if (activeDbTool?.url?.startsWith('/tools/')) {
        routerId = activeDbTool.url.replace('/tools/', '');
    }

    // 3. Construct unified tool object, preferring DbTool properties when available
    const tool = {
        id: routerId,
        cat: activeDbTool ? activeDbTool.category : (staticTool?.cat || tools[0].cat),
        icon: activeDbTool?.icon || staticTool?.icon || tools[0].icon,
        status: staticTool?.status || 'existing',
        title: activeDbTool ? activeDbTool.name : (staticTool?.title || tools[0].title),
        titleAr: activeDbTool ? activeDbTool.name : (staticTool?.titleAr || tools[0].titleAr),
        desc: activeDbTool ? activeDbTool.description : (staticTool?.desc || tools[0].desc),
        descAr: activeDbTool ? activeDbTool.description : (staticTool?.descAr || tools[0].descAr),
    };


    return (
        <div className={`h-full flex flex-col lg:flex-row ${showToolPopup ? '' : 'px-6 lg:px-12 xl:px-20 pb-20'}`}>

            {/* LEFT COLUMN: ACTIVE TOOL */}
            <main className={`flex-1 flex flex-col overflow-hidden ${showToolPopup ? 'lg:pr-10' : 'w-full max-w-7xl mx-auto'}`}>
                {/* 1. CINEMATIC HEADER */}
                <header className="flex items-center justify-between py-4 lg:py-8 mb-2 lg:mb-4 border-b border-white/[0.04] shrink-0">
                    <div className="flex items-center gap-4 lg:gap-6">
                        {!showToolPopup && (
                            <button
                                onClick={() => setCurrentView('directory')}
                                className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-white transition-all border border-white/[0.05] hover:border-white/[0.1] shadow-xl"
                                aria-label="Back to directory"
                            >
                                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 rtl:rotate-180" />
                            </button>
                        )}

                        <div>
                            <div className="flex items-center gap-3 lg:gap-4 mb-1 lg:mb-2">
                                <h1 className="text-xl lg:text-4xl font-black text-white font-cairo tracking-tight drop-shadow-sm">
                                    {tool.titleAr || tool.title}
                                </h1>
                                <div className="px-2 py-1 lg:px-3 lg:py-1.5 rounded-md lg:rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-[8px] lg:text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                    {tool.cat}
                                </div>
                            </div>
                            <p className="text-xs lg:text-base text-slate-400 font-medium font-cairo opacity-80 max-w-2xl leading-relaxed line-clamp-1 lg:line-clamp-none">
                                {tool.descAr || tool.desc}
                            </p>
                        </div>
                    </div>
                </header>

                {/* 2. TOOL CANVAS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative pr-2 -mr-2">
                    <div className="pb-8 pt-2">
                        <ToolRouter tool={tool} />
                    </div>
                </div>
            </main>


        </div>
    );
};

export default ToolWorkspace;
