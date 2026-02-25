"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Rocket,
    Code2,
    Copy,
    RefreshCcw,
    Trash2,
    CheckCircle,
    AlertCircle,
    Terminal
} from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import Link from 'next/link';

const DeveloperPortal = () => {
    const { setCurrentView } = useNavigation();

    // Mock Data
    const [apiKeys, setApiKeys] = useState([
        { id: '1', name: 'خدمة التمويل', key: 'ri88_live_9823x...882', status: 'نشط', usage: 1240 },
        { id: '2', name: 'أداة النصوص', key: 'ri88_test_1234a...001', status: 'تجريبي', usage: 85 }
    ]);

    const stats = [
        { label: 'طلبات API', value: '1.2M', trend: '+12%', color: 'text-brand-primary' },
        { label: 'معدل النجاح', value: '99.9%', trend: 'Stable', color: 'text-green-500' },
        { label: 'زمن الاستجابة', value: '45ms', trend: '-10ms', color: 'text-brand-secondary' },
        { label: 'الأخطاء', value: '0.01%', trend: 'Low', color: 'text-orange-500' },
    ];

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10 pb-20"
        >
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-border-subtle">
                <div className="text-right space-y-1">
                    <h2 className="text-3xl font-black text-text-primary">بوابة المطورين</h2>
                    <p className="text-text-muted font-medium">إدارة الـ <span className="text-brand-primary">API</span> وتحليل أداء أدواتك البرمجية.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/pro/api-docs" className="text-sm font-bold text-text-muted hover:text-text-primary transition-colors flex items-center">Documentation</Link>
                    <button className="text-sm font-bold text-text-muted hover:text-text-primary transition-colors cursor-not-allowed opacity-50">Logs</button>
                    <Link
                        href="/pro/submit-tool"
                        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-6 py-3 rounded-xl transition-all shadow-xl shadow-brand-primary/30 flex items-center gap-2 text-sm active:scale-95"
                    >
                        <Rocket className="w-4 h-4" />
                        تقديم أداة
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="bg-surface-glass border border-border-subtle p-6 rounded-3xl group hover:border-brand-primary/30 transition-colors"
                    >
                        <p className="text-sm font-bold text-text-muted mb-2">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
                        <p className="text-[10px] text-text-muted mt-2 font-mono bg-surface-raised border border-border-subtle py-1 px-2 rounded w-fit uppercase">{stat.trend}</p>
                    </motion.div>
                ))}
            </div>

            {/* API Keys Table */}
            <motion.div variants={itemVariants} className="bg-surface-glass border border-border-subtle overflow-hidden rounded-3xl">
                <div className="px-8 py-6 border-b border-border-subtle flex items-center justify-between flex-row-reverse">
                    <div className="flex items-center gap-3 flex-row-reverse">
                        <Terminal className="w-5 h-5 text-brand-secondary" />
                        <h3 className="text-xl font-black text-text-primary">مفاتيح API</h3>
                    </div>
                </div>

                <table className="w-full text-right">
                    <thead className="bg-surface-raised text-text-muted text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-5">الاسم / المفتاح</th>
                            <th className="px-8 py-5">الحالة</th>
                            <th className="px-8 py-5">الاستخدام</th>
                            <th className="px-8 py-5">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {apiKeys.map((key) => (
                            <tr key={key.id} className="hover:bg-surface-raised transition-colors group">
                                <td className="px-8 py-6">
                                    <div>
                                        <div className="font-bold text-text-primary text-sm">{key.name}</div>
                                        <div className="text-[10px] text-text-muted font-mono mt-1 opacity-50 group-hover:opacity-100 transition-opacity">{key.key}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${key.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                        'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'
                                        }`}>
                                        {key.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-xs font-bold text-text-muted font-mono">
                                    {key.usage.toLocaleString()} req
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-surface-base border border-border-subtle rounded-lg text-text-muted hover:text-text-primary transition-colors">
                                            <RefreshCcw className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="p-2 bg-surface-base border border-border-subtle rounded-lg text-red-500/50 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Code Snippet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <motion.div variants={itemVariants} className="lg:col-span-12 bg-surface-glass border border-border-subtle rounded-3xl p-0 overflow-hidden">
                    <div className="px-8 py-6 border-b border-border-subtle flex items-center justify-between flex-row-reverse bg-surface-raised">
                        <div className="flex items-center gap-3 flex-row-reverse">
                            <Code2 className="w-5 h-5 text-brand-primary" />
                            <h3 className="text-lg font-black text-text-primary">مثال التكامل (cURL)</h3>
                        </div>
                    </div>
                    <div className="p-8 font-mono text-xs text-brand-secondary leading-loose relative group bg-surface-base border-t border-border-subtle direction-ltr text-left">
                        <div className="absolute top-4 right-4">
                            <Copy className="w-4 h-4 text-text-muted group-hover:text-text-primary cursor-pointer transition-colors" />
                        </div>
                        <p className="text-text-muted mb-2"># Example Request</p>
                        <p><span className="text-purple-400">curl</span> -X POST "https://api.ri88.info/v1/tools/process" \</p>
                        <p className="pl-4">  -H "Authorization: Bearer <span className="text-brand-primary">YOUR_API_KEY</span>" \</p>
                        <p className="pl-4">  -H "Content-Type: application/json" \</p>
                        <p className="pl-4">  -d '{"{"} "input": "data", "action": "run" {"}"}'</p>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default DeveloperPortal;
