"use client";
import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { FileUploadZone } from '../Inputs/FileUploadZone';
import { FinalResultView } from '../Outputs/FinalResultView';
import { ToolInput, ToolButton, ToolSelect, ToolCheckbox, toolButtonVariants, toolButtonSizes } from './ToolUi';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { calculateDimensions, formatFileSize, getFilterString } from '@/lib/tools/media';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ToolProps {
    toolId: string;
}

// Helper
const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// 1. Image Compressor
function ImageCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(0.7);
    const [res, setRes] = useState<string | null>(null);
    const [size, setSize] = useState<string>('');

    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d')?.drawImage(img, 0, 0);
            const newData = canvas.toDataURL('image/jpeg', quality);
            setRes(newData);
            const head = 'data:image/jpeg;base64,';
            const sizeBytes = Math.round((newData.length - head.length) * 3 / 4);
            setSize(formatFileSize(sizeBytes));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell
            description="ضغط الصور لتقليل حجمها مع الحفاظ على الجودة."
            results={res && (
                <div className="h-full flex flex-col justify-center">
                    <FinalResultView
                        resultData={res}
                        type="image"
                        title="تم ضغط الصورة بنجاح"
                        onDownload={() => {
                            const link = document.createElement('a');
                            link.href = res;
                            link.download = `compressed_${file?.name.split('.')[0]}.jpg`;
                            link.click();
                        }}
                    />
                    <div className="mt-4 text-center">
                        <span className="text-brand-secondary font-mono text-sm">{size}</span>
                        <p className="text-xs text-white/30 mt-1">New Size</p>
                    </div>
                </div>
            )}
        >
            <ToolInputRow label={`الجودة (${Math.round(quality * 100)}%)`}>
                <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={quality}
                    onChange={e => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    aria-label="Image Quality"
                />
            </ToolInputRow>

            <div className="mb-8">
                <FileUploadZone
                    onFileChange={setFile}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                />
            </div>

            <ToolButton onClick={process} className="w-full text-lg" disabled={!file}>ضغط الصورة</ToolButton>
        </ToolShell>
    );
}

// Helper for button classes on links
const btnClassResult = "flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none " + toolButtonVariants.primary + " " + toolButtonSizes.md;

// 2. Image Resizer
function ImageResizer() {
    const [file, setFile] = useState<File | null>(null);
    const [w, setW] = useState<string>('');
    const [h, setH] = useState<string>('');
    const [res, setRes] = useState<string | null>(null);

    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const { width, height } = calculateDimensions(img.width, img.height, parseInt(w), parseInt(h));
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
            setRes(canvas.toDataURL(file.type));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell
            description="تغيير أبعاد الصورة (بكسل)."
            results={res && (
                <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Resized result" className="max-w-full max-h-[400px] rounded-2xl shadow-2xl border border-white/10" />
                    <div className="mt-6 w-full">
                        <a href={res} download={`resized_${file?.name}`} className={btnClassResult}>
                            <span className="font-bold">تحميل الصورة</span>
                        </a>
                    </div>
                </div>
            )}
        >
            <div className="mb-6">
                <FileUploadZone
                    onFileChange={setFile}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
                <ToolInputRow label="العرض (px)">
                    <ToolInput type="number" value={w} onChange={e => setW(e.target.value)} className="font-bold text-center" aria-label="Width in pixels" placeholder="Auto" />
                </ToolInputRow>
                <ToolInputRow label="الارتفاع (px)">
                    <ToolInput type="number" value={h} onChange={e => setH(e.target.value)} className="font-bold text-center" aria-label="Height in pixels" placeholder="Auto" />
                </ToolInputRow>
            </div>
            <div className="text-xs text-brand-secondary/70 mb-8 font-medium">* اترك حقلاً فارغاً للحفاظ على الأبعاد.</div>

            <ToolButton onClick={process} className="w-full text-lg" disabled={!file}>تغيير الحجم</ToolButton>
        </ToolShell>
    );
}

// 3. WebP Converter
function WebPConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);

    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d')?.drawImage(img, 0, 0);
            setRes(canvas.toDataURL('image/webp', 0.8));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell
            description="تحويل الصور إلى صيغة WebP الحديثة."
            results={res && (
                <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="WebP result" className="max-w-full max-h-[400px] rounded-2xl shadow-2xl border border-white/10" />
                    <div className="mt-6 w-full">
                        <a href={res} download={`${file?.name.split('.')[0]}.webp`} className={btnClassResult}>
                            <span className="font-bold">تحميل WebP</span>
                        </a>
                    </div>
                </div>
            )}
        >
            <div className="mb-8">
                <FileUploadZone
                    onFileChange={setFile}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                />
            </div>
            <ToolButton onClick={process} className="w-full text-lg" disabled={!file}>تحويل إلى WebP</ToolButton>
        </ToolShell>
    );
}

// 4. Photo Filters
function PhotoFilters() {
    const [file, setFile] = useState<File | null>(null);
    const [filter, setFilter] = useState('grayscale');
    const [res, setRes] = useState<string | null>(null);

    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.filter = getFilterString(filter);
            ctx.drawImage(img, 0, 0);
            setRes(canvas.toDataURL('image/jpeg'));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell
            description="تطبيق فلاتر احترافية على الصور."
            results={res && (
                <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Filtered result" className="max-w-full max-h-[400px] rounded-2xl shadow-2xl border border-white/10" />
                    <div className="mt-6 w-full">
                        <a href={res} download={`filtered_${file?.name}`} className={btnClassResult}>
                            <span className="font-bold">تحميل الصورة</span>
                        </a>
                    </div>
                </div>
            )}
        >
            <div className="mb-6">
                <FileUploadZone
                    onFileChange={setFile}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {['grayscale', 'sepia', 'invert', 'brightness', 'contrast', 'blur'].map(f => (
                    <ToolButton
                        key={f}
                        onClick={() => setFilter(f)}
                        variant={filter === f ? 'primary' : 'ghost'}
                        className={`text-sm font-bold ${filter !== f ? 'border border-white/10 bg-white/5' : ''}`}
                    >
                        {f}
                    </ToolButton>
                ))}
            </div>

            <ToolButton onClick={process} className="w-full text-lg" disabled={!file}>تطبيق الفلتر</ToolButton>
        </ToolShell>
    );
}

// 5. Audio Recorder
function AudioRecorder() {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const toggle = async () => {
        if (!recording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                chunksRef.current = [];
                mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunksRef.current, { 'type': 'audio/ogg; codecs=opus' });
                    setAudioUrl(URL.createObjectURL(blob));
                };
                mediaRecorderRef.current.start();
                setRecording(true);
            } catch { alert('Microphone access denied.'); }
        } else {
            mediaRecorderRef.current?.stop();
            setRecording(false);
        }
    };

    return (
        <ToolShell
            description="تسجيل الصوت مباشرة من المتصفح."
            results={audioUrl && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-full bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                        <audio controls src={audioUrl} className="w-full" />
                    </div>
                    <a href={audioUrl} download="recording.ogg" className={btnClassResult}>
                        <span className="font-bold">تحميل التسجيل</span>
                    </a>
                </div>
            )}
        >
            <div className="text-center py-12 flex flex-col items-center justify-center min-h-[300px]">
                <button
                    onClick={toggle}
                    className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${recording
                        ? 'bg-red-500 border-red-900 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse'
                        : 'bg-white/5 border-white/10 hover:bg-brand-primary hover:border-brand-primary hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                        }`}
                >
                    {recording ? <Square size={40} fill="white" className="text-white" /> : <Mic size={40} className="text-white" />}
                </button>
                <div className="mt-8">
                    <p className={`text-lg font-bold ${recording ? 'text-red-400' : 'text-slate-400'}`}>
                        {recording ? 'جاري التسجيل... (اضغط للإيقاف)' : 'اضغط الميكروفون لبدء التسجيل'}
                    </p>
                </div>
            </div>
        </ToolShell>
    );
}

// ... Additional tools (Remove BG, HEIC, etc.) kept mostly as-is due to specific browser logic dependency
// ... Implementing one more key refactoring for SocialPostPrep

// 10. Social Fit (Refactored Logic)
function SocialPostPrep() {
    const [file, setFile] = useState<File | null>(null);
    const [ratio, setRatio] = useState('1:1');
    const [bgMode, setBgMode] = useState<'blur' | 'white' | 'black'>('blur');
    const [res, setRes] = useState<string | null>(null);

    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            let targetW = img.width, targetH = img.height;
            const [rw, rh] = ratio.split(':').map(Number);
            const r = rw / rh;
            if (img.width / img.height > r) { targetW = img.width; targetH = img.width / r; }
            else { targetH = img.height; targetW = img.height * r; }

            const canvas = document.createElement('canvas');
            canvas.width = targetW; canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Logic partially extracted concept, but canvas implementation here is cleaner to keep
            if (bgMode === 'blur') {
                const scale = Math.max(targetW / img.width, targetH / img.height);
                ctx.filter = 'blur(20px)'; ctx.drawImage(img, (targetW - img.width * scale) / 2, (targetH - img.height * scale) / 2, img.width * scale, img.height * scale);
                ctx.filter = 'none'; ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, 0, targetW, targetH);
            } else {
                ctx.fillStyle = bgMode; ctx.fillRect(0, 0, targetW, targetH);
            }
            const scale = Math.min(targetW / img.width, targetH / img.height);
            ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 20;
            ctx.drawImage(img, (targetW - img.width * scale) / 2, (targetH - img.height * scale) / 2, img.width * scale, img.height * scale);
            setRes(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell
            description="تجهيز الصور للنشر في وسائل التواصل الاجتماعي."
            results={res && (
                <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Social post result" className="max-w-full max-h-[400px] rounded-2xl shadow-xl border border-white/10" />
                    <div className="mt-6 w-full">
                        <a href={res} download="social_post.jpg" className={btnClassResult}>
                            <span className="font-bold">تحميل الصورة</span>
                        </a>
                    </div>
                </div>
            )}
        >
            <div className="mb-6">
                <FileUploadZone
                    onFileChange={setFile}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <ToolInputRow label="Ratio" id="social-ratio">
                    <ToolSelect id="social-ratio" aria-label="Select Ratio" title="نسبة العرض (Aspect Ratio)" value={ratio} onChange={e => setRatio(e.target.value)} className="h-14 font-bold text-brand-secondary bg-white/5">
                        <option value="1:1">Square (1:1)</option>
                        <option value="4:5">Portrait (4:5)</option>
                        <option value="9:16">Story (9:16)</option>
                        <option value="16:9">Landscape</option>
                    </ToolSelect>
                </ToolInputRow>
                <ToolInputRow label="Background" id="social-bg">
                    <ToolSelect id="social-bg" aria-label="Select Background" title="الخلفية (Background)" value={bgMode} onChange={e => setBgMode(e.target.value as 'blur' | 'white' | 'black')} className="h-14 font-bold text-brand-secondary bg-white/5">
                        <option value="blur">Blur</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </ToolSelect>
                </ToolInputRow>
            </div>

            <ToolButton onClick={process} disabled={!file} className="w-full text-lg">Fit Image</ToolButton>
        </ToolShell>
    );
}

// ... Include other tools (RemoveBG, Heic, Meta, Frame, Crop) which are browser-heavy and left as components
// They are functional and clean enough.

// 6. Remove BG (Links)
function RemoveBackground() {
    return (
        <ToolShell description="أدوات مقترحة لإزالة الخلفية." results={<div className="h-full flex flex-col justify-center"><div className="bg-white/5 rounded-2xl p-6 border border-white/5"><h3 className="text-white font-bold mb-4">أدوات إزالة الخلفية</h3><div className="grid gap-3"><a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className={cn(toolButtonVariants.secondary, toolButtonSizes.md, "justify-between bg-[#3b3b42] hover:bg-[#484850] text-white")}><span>remove.bg</span><span className="opacity-50">↗</span></a><a href="https://pfpmaker.com" target="_blank" rel="noopener noreferrer" className={cn(toolButtonVariants.secondary, toolButtonSizes.md, "justify-between bg-gradient-to-r from-blue-600 to-cyan-500 text-white")}><span>PFPMaker</span><span className="opacity-50">↗</span></a><a href="https://www.adobe.com/express/feature/image/remove-background" target="_blank" rel="noopener noreferrer" className={cn(toolButtonVariants.secondary, toolButtonSizes.md, "justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white")}><span>Adobe Express</span><span className="opacity-50">↗</span></a></div></div></div>}><div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-50"><p>قم باختيار أداة من القائمة الجانبية لفتحها في نافذة جديدة.</p><p className="text-sm mt-2">ملاحظة: هذه أدوات خارجية موثوقة.</p></div></ToolShell>
    );
}

// 7. HEIC Converter
interface WindowWithHeic extends Window {
    heic2any?: (options: { blob: Blob; toType: string; quality: number }) => Promise<Blob>;
}
function HeicConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);
    const [converting, setConverting] = useState(false);
    const convert = async () => {
        if (!file) return; setConverting(true);
        try {
            if (!(window as unknown as WindowWithHeic).heic2any) {
                const script = document.createElement('script');
                script.src = "https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js";
                script.onload = () => runHeic();
                document.body.appendChild(script);
            } else runHeic();
        } catch { alert('Error loading converter'); setConverting(false); }
    };
    const runHeic = () => {
        const heic2any = (window as unknown as WindowWithHeic).heic2any;
        if (!heic2any || !file) return;
        heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 }).then((blob: Blob) => {
            setRes(URL.createObjectURL(blob)); setConverting(false);
        }).catch((e: unknown) => { alert('Error: ' + (e instanceof Error ? e.message : 'Unknown error')); setConverting(false); });
    }
    return <ToolShell description="تحويل صور iPhone (HEIC) إلى JPG." results={res && <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5"><img src={res} alt="Converted HEIC" className="max-w-full max-h-[400px] rounded-2xl shadow-2xl border border-white/10" /><div className="mt-6 w-full"><a href={res} download={`converted_${file?.name.split('.')[0]}.jpg`} className={btnClassResult}><span className="font-bold">تحميل الصورة (JPG)</span></a></div></div>}><div className="mb-8"><FileUploadZone onFileChange={setFile} accept={{ '.heic': [], '.heif': [] }} title="اسحب صورة HEIC هنا" /></div><ToolButton onClick={convert} disabled={!file || converting} className="w-full text-lg">{converting ? 'جاري التحويل...' : 'Convert to JPG'}</ToolButton></ToolShell>;
}

// 8. Remove Meta
function RemoveMetadata() {
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);
    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0);
            setRes(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = dataUrl;
    };
    return <ToolShell description="حذف بيانات الميتا (الموقع، الجهاز) من الصورة." results={res && <div className="h-full flex flex-col justify-center items-center p-8 bg-green-500/5 rounded-3xl border border-green-500/20"><div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6"><span className="text-3xl">🛡️</span></div><h3 className="text-xl font-bold text-green-400 mb-2">تم تنظيف الصورة</h3><p className="text-white/50 mb-8 text-center text-sm">تمت إزالة بيانات الموقع ونوع الكاميرا وتاريخ الالتقاط.</p><a href={res} download={`clean_${file?.name.split('.')[0]}.jpg`} className={cn(toolButtonVariants.primary, toolButtonSizes.md, "shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-green-600 border-green-500 hover:bg-green-500 w-full justify-center text-lg no-underline")}><span className="font-bold text-white">تحميل الصورة الآمنة</span></a></div>}><div className="mb-8"><FileUploadZone onFileChange={setFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} /></div><ToolButton onClick={process} disabled={!file} className="w-full text-lg">Clean Image</ToolButton></ToolShell>;
}

// 9. Add Frame
function AddFrame() {
    const [file, setFile] = useState<File | null>(null);
    const [padding, setPadding] = useState(20);
    const [color, setColor] = useState('#ffffff');
    const [shadow, setShadow] = useState(true);
    const [res, setRes] = useState<string | null>(null);
    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const p = padding; const canvas = document.createElement('canvas');
            canvas.width = img.width + (p * 2); canvas.height = img.height + (p * 2);
            const ctx = canvas.getContext('2d'); if (!ctx) return;
            ctx.fillStyle = color; ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (shadow) { ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 15; ctx.shadowOffsetY = 5; }
            ctx.drawImage(img, p, p);
            setRes(canvas.toDataURL('image/png'));
        };
        img.src = dataUrl;
    };
    return <ToolShell description="إضافة إطار وظل للصورة." results={res && <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5"><img src={res} alt="Framed result" className="max-w-full max-h-[400px] rounded shadow-sm border border-white/5 checkerboard" /><div className="mt-6 w-full"><a href={res} download="framed.png" className={btnClassResult}><span className="font-bold">تحميل</span></a></div></div>}><div className="mb-6"><FileUploadZone onFileChange={setFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} /></div><div className="grid grid-cols-2 gap-4 mb-4"><ToolInputRow label="Margin"><ToolInput type="number" value={padding} onChange={e => setPadding(parseInt(e.target.value))} className="text-lg font-bold h-14" aria-label="Margin width" /></ToolInputRow><ToolInputRow label="Color"><ToolInput type="color" value={color} onChange={e => setColor(e.target.value)} className="h-14 w-full p-1 cursor-pointer" aria-label="Frame color" /></ToolInputRow></div><div className="mb-8"><ToolCheckbox label="Add Shadow" checked={shadow} onChange={setShadow} /></div><ToolButton onClick={process} disabled={!file} className="w-full text-lg">Generate</ToolButton></ToolShell>;
}

// 11. Cropper
function ImageCropper() {
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);
    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const dim = Math.min(img.width, img.height);
            canvas.width = dim; canvas.height = dim;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, (img.width - dim) / 2, (img.height - dim) / 2, dim, dim, 0, 0, dim, dim);
            setRes(canvas.toDataURL('image/jpeg'));
        };
        img.src = dataUrl;
    };
    return <ToolShell description="قص الصور (مربع تلقائي)." results={res && <div className="h-full flex flex-col justify-center items-center p-6 bg-white/5 rounded-3xl border border-white/5"><img src={res} alt="Cropped result" className="max-w-full max-h-[400px] rounded-2xl shadow-xl border border-white/10" /><div className="mt-6 w-full"><a href={res} download="cropped.jpg" className={btnClassResult}><span className="font-bold">تحميل الصورة</span></a></div></div>}><div className="mb-8"><FileUploadZone onFileChange={setFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} /></div><ToolButton onClick={process} disabled={!file} className="w-full text-lg">Crop Square</ToolButton></ToolShell>;
}

export default function MediaTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'img-compress': return <ImageCompressor />;
        case 'img-resize': return <ImageResizer />;
        case 'img-webp': return <WebPConverter />;
        case 'img-filter': return <PhotoFilters />;
        case 'media-rec': return <AudioRecorder />;
        case 'img-bg': return <RemoveBackground />;
        case 'img-heic': return <HeicConverter />;
        case 'img-meta': return <RemoveMetadata />;
        case 'img-border': return <AddFrame />;
        case 'img-social': return <SocialPostPrep />;
        case 'img-crop': return <ImageCropper />;
        case 'img-meme': return <div className="text-center py-12 text-gray-400 font-bold">مولد الميمز — قريباً</div>;
        case 'image-palette': return <div className="text-center py-12 text-gray-400 font-bold">استخراج لوحة الألوان — قريباً</div>;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
