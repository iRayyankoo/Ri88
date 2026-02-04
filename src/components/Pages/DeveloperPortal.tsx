"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Key,
    Cpu,
    Plus,
    BarChart,
    Terminal,
    Copy,
    RefreshCcw,
    Trash2,
    Rocket,
    Code2,
    CheckCircle2,
    Database
} from 'lucide-react';

const DeveloperPortal = () => {
    const [apiKeys, setApiKeys] = useState([
        { id: '1', name: 'خدمة التمويل', key: 'ri88_live_9823x...882', status: 'نشط', usage: 1240 },
        { id: '2', name: 'أداة النصوص', key: 'ri88_test_1234a...001', status: 'تجريبي', usage: 85 }
    ]);

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
            className="space-y-10"
        >
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="text-right space-y-1">
                    <h2 className="text-3xl font-black text-white">بوابة المطورين</h2>
                    <p className="text-slate-500 font-medium">إدارة الـ <span className="text-brand-primary">API</span> وتحليل أداء أدواتك البرمجية.</p>
                </div>
                <button
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-brand-primary/30 flex items-center gap-3 text-sm active:scale-95"
                >
                    <Rocket className="w-5 h-5" />
                    تقديم أداة جديدة
                </button>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'إجمالي الطلبات', value: '1.2M', icon: Database, color: 'text-brand-secondary' },
                    { label: 'وقت الاستجابة', value: '42ms', icon: Cpu, color: 'text-brand-primary' },
                    { label: 'نسبة النجاح', value: '99.9%', icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'الأدوات النشطة', value: '14', icon: Terminal, color: 'text-orange-500' },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="glass-card p-6 flex flex-col gap-4 border-white/5">
                        <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                            <h4 className="text-2xl font-black text-white mt-1">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* API KEYS MANAGEMENT */}
            <motion.div variants={itemVariants} className="glass-card overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between flex-row-reverse">
                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                        <Key className="w-6 h-6 text-brand-secondary" />
                        <h3 className="text-xl font-black text-white">مفاتيح الدخول (API Keys)</h3>
                    </div>
                    <button className="text-brand-secondary text-xs font-bold hover:underline">توليد مفتاح جديد</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">اسم المفتاح</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">المفتاح</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">الحالة</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">الاستخدام</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((key) => (
                                <tr key={key.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-6 font-bold text-white text-sm">{key.name}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 text-slate-500 font-mono text-xs">
                                            <span>{key.key}</span>
                                            <Copy className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${key.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'
                                            }`}>
                                            {key.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-400">{key.usage.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white"><RefreshCcw className="w-4 h-4" /></button>
                                            <button className="p-2 bg-white/5 rounded-lg text-red-500/20 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* DOCS & INTEGRATION PREVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <motion.div variants={itemVariants} className="lg:col-span-12 glass-card p-10 space-y-8">
                    <div className="flex items-center gap-4 flex-row-reverse">
                        <Code2 className="w-8 h-8 text-brand-primary" />
                        <div className="text-right">
                            <h3 className="text-xl font-black text-white">مثال على التكامل (cURL)</h3>
                            <p className="text-xs text-slate-500 font-medium">أرسل طلباتك برمجياً بكل سهولة.</p>
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-3xl p-8 border border-white/5 font-mono text-xs text-brand-secondary leading-relaxed relative overflow-hidden group">
                        <div className="absolute top-4 left-4">
                            <Copy className="w-4 h-4 text-slate-600 group-hover:text-white cursor-pointer transition-colors" />
                        </div>
                        <p className="text-slate-500 mb-2"># مثال طلب تحويل نصوص</p>
                        <p>curl -X POST "https://api.ri88.info/v1/tools/text-process" \</p>
                        <p className="pl-4">  -H "Authorization: Bearer <span className="text-brand-primary">YOUR_API_KEY</span>" \</p>
                        <p className="pl-4">  -H "Content-Type: application/json" \</p>
                        <p className="pl-4">  -d '{"{"} "input": "النص المراد معالجته", "action": "summarize" {"}"}'</p>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default DeveloperPortal;
