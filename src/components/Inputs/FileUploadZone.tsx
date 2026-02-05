"use client";
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, CheckCircle2 } from 'lucide-react';
import { FilePreview } from './FilePreview';
import { VoiceAnnotator } from './VoiceAnnotator';

interface FileUploadZoneProps {
    onFileChange?: (file: File | null) => void;
    onVoiceChange?: (blob: Blob | null) => void;
    accept?: Record<string, string[]>;
    maxSize?: number; // In bytes
    title?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    onFileChange,
    onVoiceChange,
    accept = { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxSize = 10 * 1024 * 1024, // 10MB Default
    title = "اسحب وأفلت الملف هنا"
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileSelection = (selectedFile: File | null) => {
        setFile(selectedFile);
        if (onFileChange) {
            onFileChange(selectedFile);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selected = acceptedFiles[0];
            handleFileSelection(selected);

            // Simulate upload process
            let p = 0;
            const interval = setInterval(() => {
                p += 10;
                setProgress(p);
                if (p >= 100) clearInterval(interval);
            }, 50); // Faster simulation
        }
    }, [onFileChange]); // eslint-disable-line

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept,
        maxSize
    });

    return (
        <div className="space-y-4 font-sans">
            <div
                {...getRootProps()}
                className={`
          relative min-h-[300px] rounded-[32px] border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center cursor-pointer overflow-hidden group
          ${isDragActive
                        ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_40px_rgba(139,92,246,0.3)]'
                        : 'border-white/10 bg-white/5 hover:border-brand-primary/50 hover:bg-white/10'}
        `}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="prompt"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center space-y-4 pointer-events-none"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                <CloudUpload className={`w-8 h-8 ${isDragActive ? 'text-brand-primary animate-bounce' : 'text-slate-500 group-hover:text-brand-primary transition-colors'}`} />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">{title}</p>
                                <p className="text-sm text-brand-secondary/70 mt-1">أو اضغط لاختيار ملف من جهازك</p>
                            </div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono pt-2">Max Size: {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file-info"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="w-full h-full p-6 flex flex-col justify-center gap-6 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* PREMIUM PREVIEW COMPONENT */}
                            <FilePreview
                                file={file}
                                onRemove={() => { handleFileSelection(null); setProgress(0); }}
                            />

                            {/* UPLOAD PROGRESS */}
                            <div className="w-full space-y-2 max-w-lg mx-auto">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>جاري المعالجة...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-brand-primary shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                                    />
                                </div>

                                {progress === 100 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center pt-2"
                                    >
                                        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                            <CheckCircle2 className="w-4 h-4" />
                                            جاهز التحويل
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* VOICE ANNOTATION - NESTED CORRECTLY */}
                            {onVoiceChange && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full max-w-lg mx-auto pt-4"
                                >
                                    <VoiceAnnotator onSave={onVoiceChange} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
