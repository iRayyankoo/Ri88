"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Cpu, Activity, Zap } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import GlassCard from '../ui/GlassCard';

/*
  ServerMonitoring:
  Visualizes system performance metrics.
*/

const ServerMonitoring = () => {
    const { setCurrentView } = useNavigation();

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-white">مراقبة السيرفر</h2>
                    <p className="text-slate-500 font-medium mt-1">Live Telemetry & Health Check</p>
                </div>
                <button
                    onClick={() => setCurrentView('admin')}
                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                    عودة للرئيسية
                </button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">System Uptime</p>
                        <h3 className="text-2xl font-black text-white mt-1">99.98%</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Requests / Sec</p>
                        <h3 className="text-2xl font-black text-white mt-1">4,285</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Avg Response</p>
                        <h3 className="text-2xl font-black text-white mt-1">124ms</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 text-brand-secondary flex items-center justify-center">
                        <Server className="w-6 h-6" />
                    </div>
                </GlassCard>
            </div>

            {/* Detailed Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* CPU Usage */}
                <GlassCard title="CPU Load" icon={Cpu}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "45%" }}
                                className="h-full bg-gradient-to-r from-blue-500 to-brand-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                        <span className="font-mono text-white font-bold">45%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(core => (
                            <div key={core} className="bg-white/5 p-2 rounded text-center">
                                <div className="h-16 w-2 bg-white/10 mx-auto rounded-full relative overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.random() * 80 + 20}%` }}
                                        className="absolute bottom-0 w-full bg-brand-secondary/50 rounded-full"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 block">Core {core}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Memory Usage */}
                <GlassCard title="Memory Usage" icon={Database}>
                    <div className="flex items-center justify-center py-8">
                        <div className="relative w-48 h-48">
                            {/* Pie Chart Mock */}
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
                                <motion.circle
                                    cx="50%" cy="50%" r="40%"
                                    fill="transparent"
                                    stroke="var(--color-brand-primary)"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                    strokeDasharray="251"
                                    strokeDashoffset="251"
                                    animate={{ strokeDashoffset: 251 - (251 * 0.65) }} // 65%
                                    transition={{ duration: 1.5 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-white">65%</span>
                                <span className="text-xs text-slate-500 font-bold">USED</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/5 pt-4">
                        <span className="text-slate-400">Total: <b className="text-white">16 GB</b></span>
                        <span className="text-brand-primary">Used: <b>10.4 GB</b></span>
                        <span className="text-green-400">Free: <b>5.6 GB</b></span>
                    </div>
                </GlassCard>

            </div>
        </div>
    );
};

export default ServerMonitoring;
