"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Zap,
    Cpu,
    Sparkles,
    Bot,
    User,
    Cloud,
    Mic,
    MicOff
} from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const FloatingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);

    // PERSISTENCE
    const [messages, setMessages] = useSession('ai_chat_history', [
        { id: 1, role: 'ai', text: 'أهلاً بك! أنا مساعد RI88 الذكي. كيف يمكنني مساعدتك في أدواتك اليوم؟' }
    ]);

    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // VOICE RECOGNITION HOOK
    const { isListening, startListening, stopListening } = useSpeechRecognition((text) => {
        setInputText(text);
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newMsg = { id: Date.now(), role: 'user', text: inputText };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: 'جاري تحليل طلبك... 🤖 (هذا رد تجريبي)'
            }]);
        }, 1200);
    };

    // Auto-save Indicator (Simulated logic)
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        if (messages.length > 1) {
            setSaved(true);
            const t = setTimeout(() => setSaved(false), 2000);
            return () => clearTimeout(t);
        }
    }, [messages]);

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-brand-primary rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center text-white z-[9999] border border-white/20"
            >
                <Cpu className="w-8 h-8 animate-pulse text-white" />
            </motion.button>

            {/* Chat Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-full md:w-[400px] bg-[#0D0D0F]/80 backdrop-blur-3xl border-l border-white/10 z-[99999] flex flex-col shadow-2xl"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center border border-brand-primary/20">
                                    <Zap className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">المساعد الذكي</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">متصل الآن</p>
                                        {saved && (
                                            <span className="flex items-center gap-1 text-[9px] text-slate-500 animate-pulse">
                                                <Cloud className="w-3 h-3" /> تم الحفظ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                            >
                                <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.map((msg: any) => (
                                <div key={msg.id} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`
                                        max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed
                                        ${msg.role === 'ai'
                                            ? 'bg-brand-primary/10 border border-brand-primary/20 text-slate-200 rounded-tr-none'
                                            : 'bg-brand-primary text-white border border-brand-primary rounded-tl-none'}
                                    `}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />

                            {/* Suggestions */}
                            <div className="pt-4 space-y-3 border-t border-white/5 mt-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-brand-secondary" />
                                    <p className="text-[10px] text-slate-500 uppercase font-black">اقتراحات ذكية</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['أتمتة ملفات PDF', 'حساب الضريبة', 'تحويل العملات'].map((action) => (
                                        <button
                                            key={action}
                                            onClick={() => setInputText(action)}
                                            className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-lg hover:border-brand-primary/50 hover:text-brand-primary transition-all text-slate-400"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Input Footer */}
                        <div className="p-6 border-t border-white/5 bg-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={isListening ? "جاري الاستماع..." : "اسأل الذكاء الاصطناعي..."}
                                    className={`w-full bg-[#0D0D0F] border rounded-2xl py-4 pr-12 pl-14 focus:outline-none focus:border-brand-primary transition-all text-xs text-white placeholder:text-slate-600
                                        ${isListening ? 'border-brand-primary shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse ring-1 ring-brand-primary' : 'border-white/10'}
                                    `}
                                />

                                {/* Mic Button */}
                                <button
                                    type="button"
                                    onClick={isListening ? stopListening : startListening}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
                                </button>

                                {/* Send Button */}
                                <button
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4 text-white rtl:rotate-180" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingAssistant;
