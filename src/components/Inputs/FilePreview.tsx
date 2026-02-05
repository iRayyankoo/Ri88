"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, X, Maximize2, RotateCw, FileText } from 'lucide-react';

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const isImage = file.type.startsWith('image/');

    useEffect(() => {
        if (isImage) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file, isImage]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-4 shadow-2xl overflow-hidden"
        >
            {/* Container for Preview */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-[#0D0D0F]/50 flex items-center justify-center border border-white/5">
                {isImage && previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                ) : (
                    <div className="flex flex-col items-center space-y-3">
                        <FileText className="w-16 h-16 text-brand-primary/50" />
                        <span className="text-xs text-slate-500">{file.name.split('.').pop()?.toUpperCase()} Document</span>
                    </div>
                )}

                {/* Floating Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-3 gap-3 backdrop-blur-sm">
                    <button className="p-3 bg-white/10 hover:bg-brand-primary rounded-full transition-all text-white shadow-lg border border-white/10 hover:border-brand-primary">
                        <Maximize2 className="w-5 h-5" />
                    </button>
                    {isImage && (
                        <button className="p-3 bg-white/10 hover:bg-brand-primary rounded-full transition-all text-white shadow-lg border border-white/10 hover:border-brand-primary">
                            <RotateCw className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-3 bg-red-500/20 hover:bg-red-500 rounded-full transition-all text-red-400 hover:text-white shadow-lg border border-white/10 hover:border-red-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Meta Info */}
            <div className="mt-4 px-2 flex justify-between items-center" dir="rtl">
                <div className="text-right">
                    <p className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-brand-secondary font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                        <span className="text-[10px] text-slate-500">•</span>
                        <p className="text-[10px] text-slate-500 uppercase">{file.type.split('/')[1]}</p>
                    </div>
                </div>
                <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/50" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/20" />
                </div>
            </div>
        </motion.div>
    );
};
