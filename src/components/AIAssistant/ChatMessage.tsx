"use client";
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { motion } from 'framer-motion';

interface ChatMessageProps {
    message: {
        id: number | string;
        role: 'ai' | 'user' | string;
        text: string;
    };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
    const { speak, stop, isSpeaking } = useTextToSpeech();
    const isAi = message.role === 'ai' || message.role === 'assistant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isAi ? 'justify-start' : 'justify-end'} group relative`}
        >
            <div className={`
        relative max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed
        ${isAi
                    ? 'bg-brand-primary/10 border border-brand-primary/20 text-slate-200 rounded-tr-none'
                    : 'bg-brand-primary text-white border border-brand-primary rounded-tl-none'}
      `}>
                {message.text}
            </div>

            {/* TTS Button (Only for AI) */}
            {isAi && (
                <button
                    onClick={() => isSpeaking ? stop() : speak(message.text)}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-primary/20 text-slate-400 hover:text-brand-primary"
                    title="قراءة النص"
                >
                    {isSpeaking ? (
                        <VolumeX size={16} className="animate-pulse text-brand-primary" />
                    ) : (
                        <Volume2 size={16} />
                    )}
                </button>
            )}
        </motion.div>
    );
};
