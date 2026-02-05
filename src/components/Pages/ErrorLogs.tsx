"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Filter, Archive, RefreshCw } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const ErrorLogs = () => {
    const { setCurrentView } = useNavigation();

    const logs = [
        { id: 1, type: 'error', code: 500, msg: 'Internal Server Error: Timeout exceeded', time: '10:42:05', tool: 'Image Resizer' },
        { id: 2, type: 'warn', code: 429, msg: 'Rate Limit Warning: 450/500 reqs', time: '10:40:12', tool: 'Translator API' },
        { id: 3, type: 'error', code: 401, msg: 'Authentication Failed: Invalid Token', time: '09:15:00', tool: 'Secure Vault' },
        { id: 4, type: 'info', code: 200, msg: 'Webhook delivery successful', time: '08:50:33', tool: 'System' },
    ];

    return (
        <div className="space-y-6 pb-20 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white">سجل الأخطاء</h2>
                    <p className="text-slate-500 font-medium">مراقبة حية لأداء أدواتك البرمجية.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                        <Archive className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['All Levels', 'Critical', 'Warnings', 'Info'].map((filter, i) => (
                    <button key={i} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${i === 0 ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' : 'bg-white/5 border-white/5 text-slate-500'
                        }`}>
                        {filter}
                    </button>
                ))}
            </div>

            {/* Terminal View */}
            <div className="flex-1 stitch-glass bg-black/40 font-mono text-sm overflow-hidden flex flex-col rounded-2xl border-white/10">
                <div className="bg-white/5 p-3 flex items-center gap-2 border-b border-white/5 text-xs text-slate-500">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="ml-4">ri88-system-logs.log</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start hover:bg-white/5 p-2 rounded-lg transition-colors group">
                            <span className="text-slate-600 shrink-0 select-none">{log.time}</span>
                            <span className={`font-bold shrink-0 w-16 text-center rounded px-1 py-0.5 text-[10px] uppercase ${log.type === 'error' ? 'bg-red-500/20 text-red-400' :
                                    log.type === 'warn' ? 'bg-brand-secondary/20 text-brand-secondary' :
                                        'bg-brand-primary/20 text-brand-primary'
                                }`}>
                                {log.type}
                            </span>
                            <span className="text-slate-400 shrink-0 w-32 border-r border-white/5 pr-4 truncate" dir="ltr">[{log.tool}]</span>
                            <span className={`flex-1 break-all ${log.type === 'error' ? 'text-red-300' : 'text-slate-300'}`} dir="ltr">
                                {log.msg}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 text-xs text-brand-primary cursor-pointer hover:underline">View Trace</span>
                        </div>
                    ))}
                    <div className="animate-pulse text-brand-primary/50 text-xs pt-4">
                        _ Waiting for incoming logs...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorLogs;
