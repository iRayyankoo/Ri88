"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Tag, CheckCircle2 } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const SystemChangelog = () => {
    const { setCurrentView } = useNavigation();

    const updates = [
        {
            version: 'v2.1.0', date: '2025-05-15', title: 'Stitch Design System Upgrade', changes: [
                'Implemented Glassmorphism across all pages',
                'New Tool Workspace layout (2-column)',
                'Performance optimizations for page loads'
            ]
        },
        {
            version: 'v2.0.5', date: '2025-05-01', title: 'Developer Portal Beta', changes: [
                'Added Tool Submission form',
                'Released Public API v1',
                'Fixed authentication bugs in OAuth'
            ]
        },
        {
            version: 'v2.0.0', date: '2025-04-20', title: 'Major Platform Release', changes: [
                'Initial launch of RI88 PRO',
                'Added 50+ new AI tools',
                'Subscription system integration'
            ]
        },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-white">سجل التغييرات</h2>
                    <p className="text-slate-500 font-medium mt-1">تاريخ تحديثات وإصدارات النظام.</p>
                </div>
                <button
                    onClick={() => setCurrentView('admin')}
                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                    عودة للرئيسية
                </button>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {updates.map((update, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0D0D0F] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-brand-primary transition-colors">
                            <GitCommit className="w-5 h-5 text-slate-500 group-hover:text-brand-primary transition-colors" />
                        </div>

                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] stitch-glass p-6 hover:border-brand-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-white text-lg">{update.title}</span>
                                <span className="bg-brand-primary/20 text-brand-primary text-xs font-mono px-2 py-1 rounded">{update.version}</span>
                            </div>
                            <time className="block mb-4 text-xs font-medium text-slate-500">{update.date}</time>
                            <ul className="space-y-2">
                                {update.changes.map((change, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-green-500/50 mt-0.5 shrink-0" />
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SystemChangelog;
