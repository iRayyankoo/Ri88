"use client";
import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { FileUploadZone } from '../Inputs/FileUploadZone';
import { FinalResultView } from '../Outputs/FinalResultView';

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
            setSize((sizeBytes / 1024).toFixed(1) + ' KB');
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell description="ضغط الصور لتقليل حجمها مع الحفاظ على الجودة.">
            <ToolInputRow label={`الجودة (${quality})`}>
                <input type="range" min="0.1" max="1.0" step="0.1" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="ui-input p-0" aria-label="Image Quality" />
            </ToolInputRow>

            {/* NEW DRAG & DROP ZONE */}
            <div className="mb-8">
                <FileUploadZone
                    onFileChange={setFile}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                />
            </div>

            <button onClick={process} className="ui-btn primary ui-w-full" disabled={!file}>ضغط الصورة</button>

            {res && (
                <div className="mt-8">
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
                </div>
            )}
        </ToolShell>
    );
}

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
            let width = parseInt(w);
            let height = parseInt(h);
            if (!width && !height) { width = img.width; height = img.height; }
            else if (!width) width = (height / img.height) * img.width;
            else if (!height) height = (width / img.width) * img.height;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
            setRes(canvas.toDataURL(file.type));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell description="تغيير أبعاد الصورة (بكسل).">
            <div className="ui-grid-2">
                <ToolInputRow label="العرض (px)"><input type="number" value={w} onChange={e => setW(e.target.value)} className="ui-input" aria-label="Width in pixels" /></ToolInputRow>
                <ToolInputRow label="الارتفاع (px)"><input type="number" value={h} onChange={e => setH(e.target.value)} className="ui-input" aria-label="Height in pixels" /></ToolInputRow>
            </div>
            <div className="text-xs text-gray-400 mb-4">* اترك حقلاً فارغاً للحفاظ على الأبعاد.</div>
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} className="ui-btn primary ui-w-full" disabled={!file}>تغيير الحجم</button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Resized result" className="max-w-full max-h-[300px] rounded-lg" />
                    <a href={res} download={`resized_${file?.name}`} className="ui-btn primary ui-w-full mt-4 block no-underline">تحميل</a>
                </div>
            )}
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
        <ToolShell description="تحويل الصور إلى صيغة WebP الحديثة.">
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} className="ui-btn primary ui-w-full" disabled={!file}>تحويل إلى WebP</button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="WebP result" className="max-w-full max-h-[300px] rounded-lg" />
                    <a href={res} download={`${file?.name.split('.')[0]}.webp`} className="ui-btn primary ui-w-full mt-4 block no-underline">تحميل WebP</a>
                </div>
            )}
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
            if (filter === 'grayscale') ctx.filter = 'grayscale(100%)';
            if (filter === 'sepia') ctx.filter = 'sepia(100%)';
            if (filter === 'invert') ctx.filter = 'invert(100%)';
            if (filter === 'brightness') ctx.filter = 'brightness(150%)';
            if (filter === 'contrast') ctx.filter = 'contrast(200%)';
            if (filter === 'blur') ctx.filter = 'blur(5px)';
            ctx.drawImage(img, 0, 0);
            setRes(canvas.toDataURL('image/jpeg'));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell description="تطبيق فلاتر احترافية على الصور.">
            <div className="ui-grid-3 mb-4">
                {['grayscale', 'sepia', 'invert', 'brightness', 'contrast', 'blur'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`ui-btn ghost text-[12px] ${filter === f ? 'bg-white/10 text-white' : ''}`} aria-label={`Apply ${f} filter`}>{f}</button>
                ))}
            </div>
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} className="ui-btn primary ui-w-full" disabled={!file}>تطبيق الفلتر</button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Filtered result" className="max-w-full max-h-[300px] rounded-lg" />
                    <a href={res} download={`filtered_${file?.name}`} className="ui-btn primary ui-w-full mt-4 block no-underline">تحميل</a>
                </div>
            )}
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
        <ToolShell description="تسجيل الصوت مباشرة من المتصفح.">
            <div className="text-center py-8">
                <button onClick={toggle} className={`ui-btn w-[100px] h-[100px] rounded-full flex items-center justify-center border-2 border-white/20 ${recording ? 'bg-[#e74c3c]' : 'bg-white/10'}`}>
                    {recording ? <Square size={32} fill="white" /> : <Mic size={32} />}
                </button>
                <div className="mt-4 text-gray-400">{recording ? 'جاري التسجيل...' : 'اضغط للتسجيل'}</div>
            </div>
            {audioUrl && (
                <div className="ui-output text-center">
                    <audio controls src={audioUrl} className="w-full" />
                    <a href={audioUrl} download="recording.ogg" className="ui-btn primary ui-w-full mt-4 block no-underline">تحميل التسجيل</a>
                </div>
            )}
        </ToolShell>
    );
}

// 6. Remove BG (Links)
function RemoveBackground() {
    return (
        <ToolShell description="أدوات مقترحة لإزالة الخلفية.">
            <div className="ui-output text-center">
                <p className="mb-4">للحصول على أفضل جودة، نوصي بهذه الأدوات المجانية:</p>
                <div className="ui-grid-3">
                    <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className="ui-btn primary no-underline">remove.bg</a>
                    <a href="https://pfpmaker.com" target="_blank" rel="noopener noreferrer" className="ui-btn primary no-underline bg-[#3498db]">PFPMaker</a>
                    <a href="https://www.adobe.com/express/feature/image/remove-background" target="_blank" rel="noopener noreferrer" className="ui-btn primary no-underline bg-[#e74c3c]">Adobe</a>
                </div>
            </div>
        </ToolShell>
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

    return (
        <ToolShell description="تحويل صور iPhone (HEIC) إلى JPG.">
            <input aria-label="Upload HEIC Image" type="file" accept=".heic, .heif" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={convert} disabled={!file || converting} className="ui-btn primary ui-w-full">
                {converting ? 'جاري التحويل...' : 'Convert to JPG'}
            </button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Converted HEIC" className="max-w-full rounded-lg" />
                    <a href={res} download={`converted_${file?.name.split('.')[0]}.jpg`} className="ui-btn primary ui-w-full mt-4 block no-underline">Download</a>
                </div>
            )}
        </ToolShell>
    );
}

// 8. Remove Metadata
function RemoveMetadata() {
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);
    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0);
            setRes(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = dataUrl;
    };
    return (
        <ToolShell description="حذف بيانات الميتا (الموقع، الجهاز) من الصورة.">
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} disabled={!file} className="ui-btn primary ui-w-full">Clean Image</button>
            {res && (
                <div className="ui-output text-center">
                    <a href={res} download={`clean_${file?.name.split('.')[0]}.jpg`} className="ui-btn primary ui-w-full block no-underline">Download Clean Image</a>
                </div>
            )}
        </ToolShell>
    );
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
            const p = padding;
            const canvas = document.createElement('canvas');
            canvas.width = img.width + (p * 2); canvas.height = img.height + (p * 2);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.fillStyle = color; ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (shadow) { ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 15; ctx.shadowOffsetY = 5; }
            ctx.drawImage(img, p, p);
            setRes(canvas.toDataURL('image/png'));
        };
        img.src = dataUrl;
    };

    return (
        <ToolShell description="إضافة إطار وظل للصورة.">
            <div className="ui-grid-2">
                <ToolInputRow label="Margin"><input type="number" value={padding} onChange={e => setPadding(parseInt(e.target.value))} className="ui-input" aria-label="Margin width" /></ToolInputRow>
                <ToolInputRow label="Color"><input type="color" value={color} onChange={e => setColor(e.target.value)} className="ui-input h-12 p-0" aria-label="Frame color" /></ToolInputRow>
            </div>
            <label className="ui-checkbox mb-4 block"><input type="checkbox" checked={shadow} onChange={e => setShadow(e.target.checked)} /> Add Shadow</label>
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} disabled={!file} className="ui-btn primary ui-w-full">Generate</button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Framed result" className="max-w-full max-h-[300px]" />
                    <a href={res} download="framed.png" className="ui-btn primary ui-w-full mt-4 block no-underline">Download</a>
                </div>
            )}
        </ToolShell>
    );
}

// 10. Social Fit
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
        <ToolShell description="تجهيز الصور للنشر في وسائل التواصل الاجتماعي.">
            <div className="ui-grid-2">
                <ToolInputRow label="Ratio">
                    <select aria-label="Select Ratio" value={ratio} onChange={e => setRatio(e.target.value)} className="ui-input ui-select">
                        <option value="1:1">Square (1:1)</option>
                        <option value="4:5">Portrait (4:5)</option>
                        <option value="9:16">Story (9:16)</option>
                        <option value="16:9">Landscape</option>
                    </select>
                </ToolInputRow>
                <ToolInputRow label="Background">
                    <select aria-label="Select Background" value={bgMode} onChange={e => setBgMode(e.target.value as 'blur' | 'white' | 'black')} className="ui-input ui-select">
                        <option value="blur">Blur</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                </ToolInputRow>
            </div>
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} disabled={!file} className="ui-btn primary ui-w-full">Fit Image</button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Social post result" className="max-w-full max-h-[300px]" />
                    <a href={res} download="social_post.jpg" className="ui-btn primary ui-w-full mt-4 block no-underline">Download</a>
                </div>
            )}
        </ToolShell>
    );
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
    return (
        <ToolShell description="قص الصور (مربع تلقائي).">
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input mb-4" />
            <button onClick={process} disabled={!file} className="ui-btn primary ui-w-full">Crop Square</button>
            {res && (
                <div className="ui-output text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={res} alt="Cropped result" className="max-w-full max-h-[300px]" />
                    <a href={res} download="cropped.jpg" className="ui-btn primary ui-w-full mt-4 block no-underline">Download</a>
                </div>
            )}
        </ToolShell>
    );
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
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
