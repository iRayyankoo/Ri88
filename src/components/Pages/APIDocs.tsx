"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Play, Terminal, ChevronDown } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

const APIDocs = () => {
    const { setCurrentView } = useNavigation();
    const [activeEndpoint, setActiveEndpoint] = useState('auth');

    const endpoints = [
        { id: 'auth', method: 'POST', path: '/v1/auth/token', title: 'Generate Token' },
        { id: 'tools', method: 'GET', path: '/v1/tools', title: 'List Tools' },
        { id: 'run', method: 'POST', path: '/v1/tools/:id/run', title: 'Execute Tool' },
        { id: 'user', method: 'GET', path: '/v1/user/profile', title: 'Get Profile' },
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 overflow-hidden">

            {/* Sidebar List */}
            <div className="w-full lg:w-1/4 h-full flex flex-col gap-4">
                <GlassCard className="h-full overflow-y-auto p-4 space-y-2">
                    <h3 className="text-xl font-black text-white mb-6 px-2">API Reference</h3>
                    {endpoints.map((ep) => (
                        <button
                            key={ep.id}
                            onClick={() => setActiveEndpoint(ep.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all border ${activeEndpoint === ep.id
                                    ? 'bg-brand-primary/10 border-brand-primary/30'
                                    : 'bg-transparent border-transparent hover:bg-white/5'
                                }`}
                        >
                            <span className="text-sm font-bold text-slate-300">{ep.title}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                }`}>{ep.method}</span>
                        </button>
                    ))}
                </GlassCard>
            </div>

            {/* Main Content Area */}
            <GlassCard className="flex-1 h-full overflow-hidden flex flex-col p-0">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-3">
                        <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-md text-sm">POST</span>
                        <h2 className="text-xl font-mono text-white">/v1/tools/:id/run</h2>
                    </div>
                </div>

                {/* Split View: Docs vs Playground */}
                <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">

                    {/* Docs */}
                    <div className="flex-1 p-8 overflow-y-auto border-l border-white/5 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Description</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Execute a specific tool by its ID. Requires a valid API token with 'execute' scope. The input payload must match the tool's schema.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Parameters</h3>
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-right text-sm">
                                    <thead className="bg-white/5 text-slate-300">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Required</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-400">
                                        <tr>
                                            <td className="p-4 font-mono text-brand-secondary">id</td>
                                            <td className="p-4">string</td>
                                            <td className="p-4 text-red-400">Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-mono text-brand-secondary">input</td>
                                            <td className="p-4">object</td>
                                            <td className="p-4 text-red-400">Yes</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Playground */}
                    <div className="w-full lg:w-1/2 bg-black/40 flex flex-col h-full font-mono text-sm">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between text-slate-500">
                            <span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Request Body</span>
                            <button className="text-xs hover:text-white transition-colors">Reset</button>
                        </div>
                        <div className="flex-1 p-4 relative">
                            <textarea
                                className="w-full h-full bg-transparent resize-none outline-none text-green-400/90 font-mono leading-relaxed"
                                defaultValue={`{
  "tool_id": "translator_pro",
  "input": {
    "text": "Hello World",
    "target_lang": "ar"
  }
}`}
                            />
                        </div>
                        <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                            <button className="bg-brand-primary hover:bg-brand-primary/80 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
                                <Play className="w-4 h-4 fill-current" />
                                Test Request
                            </button>
                        </div>
                    </div>

                </div>
            </GlassCard>

        </div>
    );
};

export default APIDocs;
