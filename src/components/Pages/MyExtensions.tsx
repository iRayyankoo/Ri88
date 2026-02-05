"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Trash2, Settings, Power } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const MyExtensions = () => {
    const { setCurrentView } = useNavigation();

    // Mock installed extensions
    const [extensions, setExtensions] = useState([
        { id: 1, title: 'GPT-4 Turbo Engine', version: '2.1.0', active: true },
        { id: 3, title: 'Saudi VAT Calc', version: '1.0.5', active: true },
        { id: 5, title: 'Slack Connector', version: '0.9.beta', active: false },
    ]);

    const toggleExtension = (id: number) => {
        setExtensions(prev => prev.map(ext =>
            ext.id === id ? { ...ext, active: !ext.active } : ext
        ));
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div className="space-y-2 text-right">
                    <h2 className="text-3xl font-black text-white">إضافاتي</h2>
                    <p className="text-slate-500 font-medium">إدارة وتكوين الأدوات المثبتة لديك.</p>
                </div>
                <button
                    onClick={() => setCurrentView('store')}
                    className="btn-primary"
                >
                    تصفح المتجر
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {extensions.map((ext) => (
                    <motion.div
                        key={ext.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`stitch-glass p-6 flex items-center justify-between transition-all ${!ext.active ? 'opacity-60 grayscale' : ''}`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ext.active ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-slate-800 text-slate-500'}`}>
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{ext.title}</h3>
                                <p className="text-xs text-slate-500 font-mono">v{ext.version}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg">
                                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                                    <Settings className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10" />
                            <button
                                onClick={() => toggleExtension(ext.id)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${ext.active ? 'bg-brand-primary' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${ext.active ? 'left-1' : 'left-7'}`} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MyExtensions;
