"use client";

import React from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function StitchDemoPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-purple/30 overflow-x-hidden">
            <div className="flex h-screen overflow-hidden" dir="ltr">
                {/* Sidebar */}
                <aside className="w-72 hidden lg:flex flex-col border-e border-brand-border bg-black/40 backdrop-blur-2xl shrink-0">
                    <div className="p-8">
                        <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-brand-purple to-brand-cyan bg-clip-text text-transparent italic">
                            RI88
                        </h2>
                        <p className="text-[10px] uppercase tracking-widest text-brand-purple/60 font-bold mt-1">Universal Tools</p>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        {[
                            { name: 'Dashboard', active: true },
                            { name: 'Tools Library', active: false },
                            { name: 'Workspaces', active: false },
                            { name: 'Analytics', active: false },
                            { name: 'System Settings', active: false }
                        ].map((item) => (
                            <div
                                key={item.name}
                                className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group cursor-pointer
                  ${item.active ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                `}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-white' : 'bg-transparent group-hover:bg-brand-purple'} transition-colors`} />
                                <span className="font-bold text-sm">{item.name}</span>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#0E0E12] to-[#0A0A0C]">
                    {/* Header */}
                    <header className="h-20 border-b border-brand-border flex items-center justify-between px-10 bg-black/20 backdrop-blur-md shrink-0 z-50">
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-full border border-brand-border group focus-within:border-brand-purple/40 transition-all w-full max-w-md">
                            <span className="text-gray-500 text-sm font-medium group-focus-within:text-gray-300">Search 100+ digital tools...</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">System Status</span>
                                <span className="text-sm text-brand-cyan font-mono font-bold">READY_V3</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan p-[1px] shadow-lg shadow-brand-purple/20 group cursor-pointer hover:rotate-6 transition-transform">
                                <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
                                    <span className="text-xs font-black text-white">R</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-10 space-y-10 scroll-smooth">
                        <div className="max-w-[1400px] mx-auto space-y-10 pb-10">
                            {/* Hero Section */}
                            <section>
                                <GlassCard className="!p-0 border-none overflow-hidden group">
                                    <div className="relative p-10 lg:p-14 flex flex-col items-start justify-center min-h-[350px] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-purple/15 via-transparent to-brand-cyan/5">
                                        <div className="relative z-20 max-w-3xl">
                                            <div className="inline-flex items-center gap-2 bg-brand-purple/20 text-brand-purple text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8 border border-brand-purple/30 group-hover:scale-105 transition-transform duration-500">
                                                Universal Dashboard v3.0
                                            </div>
                                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-[1.15] tracking-tight">
                                                Experience the next generation <br />
                                                <span className="bg-gradient-to-r from-white via-white/80 to-gray-500 bg-clip-text text-transparent">Power Workspace.</span>
                                            </h1>
                                            <p className="text-lg lg:text-xl text-gray-400 mb-10 leading-relaxed font-medium max-w-xl">
                                                Seamlessly chain 100+ digital tools with advanced automation and intuitive multi-window orchestration.
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <button className="bg-white text-black hover:bg-brand-cyan px-10 py-4 rounded-full font-black transition-all shadow-xl shadow-white/5 active:scale-95 text-lg">
                                                    Get Started ↗
                                                </button>
                                                <button className="hidden sm:block bg-white/5 hover:bg-white/10 px-10 py-4 rounded-full font-black transition-all border border-white/5 text-lg">
                                                    View Tools
                                                </button>
                                            </div>
                                        </div>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                                            <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/20 blur-[150px] rounded-full group-hover:bg-brand-purple/30 transition-colors duration-1000" />
                                            <div className="absolute -bottom-20 right-40 w-80 h-80 bg-brand-cyan/15 blur-[120px] rounded-full group-hover:bg-brand-cyan/25 transition-colors duration-1000" />
                                        </div>
                                    </div>
                                </GlassCard>
                            </section>

                            {/* Grid of Widgets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                                <GlassCard title="Top Performing Tools">
                                    <div className="space-y-4">
                                        {[
                                            { name: 'VAT Intelligence', icon: 'V', color: 'text-brand-purple' },
                                            { name: 'Neural PDF Engine', icon: 'P', color: 'text-brand-cyan' },
                                            { name: 'AI Core Summarizer', icon: 'A', color: 'text-brand-purple' },
                                            { name: 'UHD Image Scaler', icon: 'I', color: 'text-brand-cyan' }
                                        ].map((tool) => (
                                            <div key={tool.name} className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-white/5 hover:border-brand-purple/30 hover:bg-white/5 cursor-pointer transition-all group overflow-hidden relative">
                                                <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/[0.02] transition-colors" />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black ${tool.color} group-hover:scale-110 transition-transform`}>
                                                        {tool.icon}
                                                    </div>
                                                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{tool.name}</span>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-150 transition-all duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard title="Active Workspaces">
                                    <div className="space-y-8">
                                        <div className="p-6 border border-brand-purple/30 rounded-3xl bg-brand-purple/10 flex items-center justify-between group cursor-pointer hover:bg-brand-purple/15 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 flex items-center justify-center relative overflow-hidden">
                                                    <div className="w-4 h-4 rounded-full bg-brand-purple animate-ping absolute inset-auto" />
                                                    <div className="w-3 h-3 rounded-full bg-brand-purple relative z-10 shadow-[0_0_10px_brand-purple]" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-xl text-white">Flow v1</p>
                                                    <p className="text-[10px] text-brand-purple font-black uppercase tracking-widest mt-1">2 Tools Active</p>
                                                </div>
                                            </div>
                                            <span className="text-brand-purple font-black text-xs mr-2 group-hover:translate-x-1 transition-transform">↗</span>
                                        </div>

                                        <button className="w-full py-6 border-2 border-dashed border-white/10 rounded-3xl text-gray-500 font-black hover:text-white hover:border-white/40 hover:bg-white/5 transition-all group relative overflow-hidden">
                                            <span className="relative z-10 transition-transform group-hover:scale-105 inline-block">+ Create New Node</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        </button>
                                    </div>
                                </GlassCard>

                                <GlassCard title="Core performance">
                                    <div className="space-y-10 pt-4">
                                        {[
                                            { label: 'Neural CPU', val: '24%', bar: 'bg-brand-purple', shadow: 'shadow-brand-purple/40', w: 'w-[24%]' },
                                            { label: 'Cluster RAM', val: '68%', bar: 'bg-brand-cyan', shadow: 'shadow-brand-cyan/40', w: 'w-[68%]' },
                                            { label: 'Global Latency', val: '12ms', valColor: 'text-green-400', bar: 'bg-green-400', shadow: 'shadow-green-400/40', w: 'w-[15%]' }
                                        ].map((stat) => (
                                            <div key={stat.label}>
                                                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                                                    <span className="text-gray-500">{stat.label}</span>
                                                    <span className={stat.valColor || 'text-white'}>{stat.val}</span>
                                                </div>
                                                <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                                                    <div className={`h-full ${stat.bar} ${stat.w} rounded-full shadow-[0_0_15px_-2px_rgba(0,0,0,0.5)] ${stat.shadow} transition-all duration-1000 ease-out`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
