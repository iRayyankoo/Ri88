"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Trash2, Volume2 } from 'lucide-react';

interface VoiceAnnotatorProps {
    onSave: (blob: Blob | null) => void;
}

export const VoiceAnnotator = ({ onSave }: VoiceAnnotatorProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            chunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onSave(blob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (e) {
            console.error("Mic Error:", e);
            alert("لا يمكن الوصول للميكروفون.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const deleteRecording = () => {
        setAudioUrl(null);
        onSave(null);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 mt-4 w-full" dir="rtl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
                    <span className="text-xs font-bold text-slate-300">التعليق الصوتي (تعليمات)</span>
                </div>

                <div className="flex items-center gap-2">
                    {!audioUrl && !isRecording && (
                        <button
                            onClick={startRecording}
                            className="p-3 bg-brand-primary/10 hover:bg-brand-primary rounded-full text-brand-primary hover:text-white transition-all shadow-lg hover:shadow-brand-primary/40 border border-brand-primary/20"
                            title="بدء التسجيل"
                        >
                            <Mic size={18} />
                        </button>
                    )}

                    {isRecording && (
                        <button
                            onClick={stopRecording}
                            className="p-3 bg-red-500/10 hover:bg-red-500 rounded-full text-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/40 border border-red-500/20"
                            title="إيقاف التسجيل"
                        >
                            <Square size={18} className="fill-current" />
                        </button>
                    )}

                    {audioUrl && (
                        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-full border border-white/10">
                            <button
                                onClick={() => new Audio(audioUrl).play()}
                                className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-full transition-colors"
                                title="تشغيل"
                            >
                                <Play size={16} className="fill-current" />
                            </button>
                            <div className="w-px h-4 bg-white/10" />
                            <button
                                onClick={deleteRecording}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                                title="حذف"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Waveform Animation */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 h-8 flex items-center justify-center gap-1 overflow-hidden"
                    >
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, Math.random() * 24 + 4, 4] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                className="w-1 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
