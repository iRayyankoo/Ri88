"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Sparkles,
    Zap,
    BrainCircuit,
    Command
} from 'lucide-react';

const FloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'مرحباً رياّن! أنا مساعدك الذكي في RI88 PRO. كيف يمكنني مساعدتك في أتمتة مهامك اليوم؟' }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages([...messages, { role: 'user', content: inputText }]);
        setInputText('');

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'جاري تحليل طلبك.. هل تود ربط "محول العملات" بـ "حاسبة الضريبة" آلياً؟'
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-28 lg:bottom-12 left-10 lg:left-12 z-[60] w-16 h-16 bg-brand-primary text-white rounded-2xl shadow-2xl shadow-brand-primary/40 flex items-center justify-center border border-white/20"
            >
                <Sparkles className="w-8 h-8 fill-white/20" />
            </motion.button>

            {/* Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        className="fixed bottom-48 lg:bottom-32 left-10 lg:left-12 z-[60] w-[380px] h-[550px] glass-card flex flex-col overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] border-brand-primary/30"
                    >
                        {/* Header */}
                        <div className="p-6 bg-brand-primary/10 border-b border-white/5 flex items-center justify-between flex-row-reverse">
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div className="text-right">
                                    <h4 className="text-sm font-black text-white">المساعد الذكي</h4>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">متصل الآن</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.role === 'assistant'
                                            ? 'bg-white/5 text-slate-200 rounded-tr-none text-right'
                                            : 'bg-brand-primary text-white rounded-tl-none shadow-lg'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Suggestions */}
                        <div className="px-6 pb-4 flex flex-wrap gap-2 justify-end">
                            {['أين أدوات الـ PDF؟', 'كيف أربط الأدوات؟', 'تحليل الاستخدام'].map((s) => (
                                <button key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold hover:text-white hover:border-white/20 transition-all">
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 pt-2 border-t border-white/5 relative bg-brand-bg/50">
                            <div className="relative group">
                                <button
                                    onClick={handleSend}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                                >
                                    <Send className="w-4 h-4 -rotate-45" />
                                </button>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-xs text-white outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all text-right"
                                    placeholder="اسألني عن أي شيء..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <Command className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingAssistant;
