"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Download, Image as ImageIcon } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
// HELPER: Read File
const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// ----------------------------------------------------------------------
// 1. IMAGE COMPRESSOR
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
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const newData = canvas.toDataURL('image/jpeg', quality);
            setRes(newData);

            // Calc size savings
            const head = 'data:image/jpeg;base64,';
            const sizeBytes = Math.round((newData.length - head.length) * 3 / 4);
            setSize((sizeBytes / 1024).toFixed(1) + ' KB');
        };
        img.src = dataUrl;
    };

    return (
        <div className="tool-ui-group">
            <div className="input-row">
                <label>الجودة ({quality})</label>
                <input type="range" min="0.1" max="1.0" step="0.1" value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="glass-input full-width" />
            </div>

            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />

            <button onClick={process} className="btn-primary full-width" disabled={!file}>ضغط الصورة</button>

            {res && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--accent-cyan)', marginBottom: '10px' }}>الحجم الجديد: {size}</p>
                    <img src={res} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #333' }} />
                    <a href={res} download={`compressed_${file?.name.split('.')[0]}.jpg`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>تحميل</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. IMAGE RESIZER
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
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            setRes(canvas.toDataURL(file.type));
        };
        img.src = dataUrl;
    };

    return (
        <div className="tool-ui-group">
            <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" placeholder="العرض (px)" value={w} onChange={e => setW(e.target.value)} className="glass-input" />
                <input type="number" placeholder="الارتفاع (px)" value={h} onChange={e => setH(e.target.value)} className="glass-input" />
            </div>
            <small style={{ color: '#aaa' }}>اترك حقلاً فارغاً للحفاظ على الأبعاد.</small>

            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <button onClick={process} className="btn-primary full-width" disabled={!file}>تغيير الحجم</button>

            {res && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <img src={res} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    <a href={res} download={`resized_${file?.name}`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>تحميل</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. WEBP CONVERTER
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
        <div className="tool-ui-group">
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <button onClick={process} className="btn-primary full-width" disabled={!file}>تحويل إلى WebP</button>
            {res && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <img src={res} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    <a href={res} download={`${file?.name.split('.')[0]}.webp`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>تحميل WebP</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. PHOTO FILTERS
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

            // Apply filter
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
        <div className="tool-ui-group">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginBottom: '10px' }}>
                {['grayscale', 'sepia', 'invert', 'brightness', 'contrast', 'blur'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`tool-action ${filter === f ? 'active' : ''}`} style={{ border: filter === f ? '1px solid var(--accent-pink)' : '1px solid transparent' }}>
                        {f}
                    </button>
                ))}
            </div>

            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <button onClick={process} className="btn-primary full-width" disabled={!file}>تطبيق الفلتر</button>

            {res && (
                <div className="result-box" style={{ textAlign: 'center' }}>
                    <img src={res} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    <a href={res} download={`filtered_${file?.name}`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>تحميل</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. AUDIO RECORDER
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
            } catch (e) {
                alert('Microphone access denied.');
            }
        } else {
            mediaRecorderRef.current?.stop();
            setRecording(false);
        }
    };

    return (
        <div className="tool-ui-group" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2em', marginBottom: '20px', color: recording ? 'var(--accent-pink)' : '#aaa' }}>
                {recording ? 'جاري التسجيل...' : 'جاهز للتسجيل'}
            </div>

            <button onClick={toggle} style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: recording ? '#e74c3c' : 'var(--glass-bg)',
                border: '2px solid var(--glass-border)',
                color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: '0.3s'
            }}>
                {recording ? <Square size={32} fill="white" /> : <Mic size={32} />}
            </button>

            {audioUrl && (
                <div className="result-box" style={{ marginTop: '24px' }}>
                    <audio controls src={audioUrl} style={{ width: '100%' }} />
                    <a href={audioUrl} download="recording.ogg" className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>تحميل التسجيل</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN ROUTER

// ----------------------------------------------------------------------
// 6. REMOVE BACKGROUND (Recommender)
function RemoveBackground() {
    return (
        <div className="tool-ui-group" style={{ textAlign: 'center', padding: '40px' }}>
            <p className="mb-4">للحصول على أفضل جودة لإزالة الخلفية بالذكاء الاصطناعي، ننصح باستخدام:</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://www.remove.bg" target="_blank" className="btn-primary" style={{ textDecoration: 'none' }}>remove.bg</a>
                <a href="https://pfpmaker.com" target="_blank" className="btn-primary" style={{ textDecoration: 'none', background: '#3498db' }}>PFPMaker</a>
                <a href="https://www.adobe.com/express/feature/image/remove-background" target="_blank" className="btn-primary" style={{ textDecoration: 'none', background: '#e74c3c' }}>Adobe Express</a>
            </div>
            <p className="mt-4 text-sm text-gray-500">نعمل على إضافة أداة مدمجة قريباً.</p>
        </div>
    );
}

// ----------------------------------------------------------------------
// 7. HEIC TO JPG
function HeicConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);
    const [converting, setConverting] = useState(false);

    const convert = async () => {
        if (!file) return;
        setConverting(true);
        try {
            // Check if heic2any is loaded via script tag? 
            // Or just basic client-side check.
            // Since we don't have heic2any installed, we might default to a simple prompt
            // OR use a reliable CDN if allowed. 
            // For this environment, let's assume we load it similar to PDFLib if needed, but for now 
            // let's show a "Browser Support" check or simple message if lib missing.

            // Actually, we can try to use a dummy converter if lib not present or inform user.
            // But let's verify if we can add the script. Yes, usage of heic2any is standard.

            // DYNAMIC IMPORT from CDN
            if (!(window as any).heic2any) {
                const script = document.createElement('script');
                script.src = "https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js";
                script.onload = () => runHeic();
                document.body.appendChild(script);
            } else {
                runHeic();
            }
        } catch (e) {
            alert('Error loading converter');
            setConverting(false);
        }
    };

    const runHeic = () => {
        const heic2any = (window as any).heic2any;
        if (!heic2any) return;

        heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 })
            .then((blob: Blob) => {
                const url = URL.createObjectURL(blob);
                setRes(url);
                setConverting(false);
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((e: any) => {
                alert('Error converting: ' + e.message);
                setConverting(false);
            });
    }

    return (
        <div className="tool-ui-group">
            <input type="file" accept=".heic, .heif" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={convert} disabled={!file || converting} className="btn-primary full-width">
                {converting ? 'Converting HEIC...' : 'Convert to JPG'}
            </button>
            {res && (
                <div className="result-box" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img src={res} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                    <a href={res} download={`converted_${file?.name.split('.')[0]}.jpg`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>Download JPG</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN ROUTER

// ----------------------------------------------------------------------
// 8. REMOVE METADATA
function RemoveMetadata() {
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
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            // Exporting to new file strips EXIF
            setRes(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = dataUrl;
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-2">Remove EXIF/Metadata</h3>
            <p className="text-sm text-gray-400 mb-4">Creates a clean copy of your image without location or device data.</p>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={process} disabled={!file} className="btn-primary full-width">Clean Image</button>
            {res && (
                <div className="result-box" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a href={res} download={`clean_${file?.name.split('.')[0]}.jpg`} className="btn-primary full-width" style={{ display: 'block', textDecoration: 'none' }}>Download Clean Image</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 9. ADD FRAME (Shadow & Border)
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
            const canvas = document.createElement('canvas');
            // Canvas size = image size + padding * 2
            const p = parseInt(padding.toString());
            canvas.width = img.width + (p * 2);
            canvas.height = img.height + (p * 2);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Background
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Shadow
            if (shadow) {
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 5;
            }

            // Draw Image Centered
            ctx.drawImage(img, p, p);

            setRes(canvas.toDataURL('image/png'));
        };
        img.src = dataUrl;
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4">Add Frame & Shadow</h3>
            <div className="flex gap-4 mb-4">
                <div style={{ flex: 1 }}>
                    <label>Padding</label>
                    <input type="number" value={padding} onChange={e => setPadding(parseInt(e.target.value))} className="glass-input full-width" />
                </div>
                <div style={{ flex: 1 }}>
                    <label>Bg Color</label>
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="glass-input full-width" style={{ height: '42px', padding: '0' }} />
                </div>
            </div>
            <div className="mb-4">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={shadow} onChange={e => setShadow(e.target.checked)} /> Add Drop Shadow
                </label>
            </div>

            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={process} disabled={!file} className="btn-primary full-width">Generate Frame</button>

            {res && (
                <div className="result-box" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img src={res} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px', border: '1px solid #333' }} />
                    <a href={res} download={`framed_${file?.name.split('.')[0]}.png`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>Download</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 10. SOCIAL POST PREP (Smart Fitter)
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
            let targetW = img.width;
            let targetH = img.height;

            // Calculate target dimension based on ratio, keeping the largest dimension of the image
            const [rw, rh] = ratio.split(':').map(Number);
            const r = rw / rh; // desired aspect ratio

            // If image is wider than target ratio
            if (img.width / img.height > r) {
                targetW = img.width;
                targetH = img.width / r;
            } else {
                targetH = img.height;
                targetW = img.height * r;
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Fill Background
            if (bgMode === 'blur') {
                // Draw simplified blur: scale up image to cover
                const scale = Math.max(targetW / img.width, targetH / img.height);
                const bw = img.width * scale;
                const bh = img.height * scale;
                const bx = (targetW - bw) / 2;
                const by = (targetH - bh) / 2;

                ctx.filter = 'blur(20px)';
                ctx.drawImage(img, bx, by, bw, bh);
                ctx.filter = 'none';
                // Darken overlay
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(0, 0, targetW, targetH);
            } else if (bgMode === 'white') {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, targetW, targetH);
            } else {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, targetW, targetH);
            }

            // Draw Image Centered containing
            const scale = Math.min(targetW / img.width, targetH / img.height);
            const iw = img.width * scale;
            const ih = img.height * scale;
            const ix = (targetW - iw) / 2;
            const iy = (targetH - ih) / 2;

            // Shadow for pop
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 20;
            ctx.drawImage(img, ix, iy, iw, ih);

            setRes(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = dataUrl;
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4">Social Fit</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label>Aspect Ratio</label>
                    <select value={ratio} onChange={e => setRatio(e.target.value)} className="glass-input full-width">
                        <option value="1:1">Square (1:1)</option>
                        <option value="4:5">Portrait (4:5)</option>
                        <option value="9:16">Story (9:16)</option>
                        <option value="16:9">Landscape (16:9)</option>
                    </select>
                </div>
                <div>
                    <label>Background</label>
                    <select value={bgMode} onChange={e => setBgMode(e.target.value as any)} className="glass-input full-width">
                        <option value="blur">Blurred</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                </div>
            </div>

            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={process} disabled={!file} className="btn-primary full-width">Fit Image</button>

            {res && (
                <div className="result-box" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img src={res} style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} />
                    <a href={res} download={`social_${file?.name.split('.')[0]}.jpg`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>Download</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 11. IMAGE CROPPER
function ImageCropper() {
    // Simple centralized crop for now to avoid massive UI complexity in one file
    // Future: Use react-image-crop
    const [file, setFile] = useState<File | null>(null);
    const [res, setRes] = useState<string | null>(null);
    const [aspect, setAspect] = useState(1);

    // Placeholder simple center crop
    const process = async () => {
        if (!file) return;
        const dataUrl = await readFile(file);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const minDim = Math.min(img.width, img.height);

            // Very basic CENTER CROP based on aspect logic
            // Assuming square for simplicity as "Crop" usually implies specific target or manual
            // Let's implement a square center crop as default behavior for "Simple Cropper"

            const w = minDim;
            const h = minDim;
            const x = (img.width - w) / 2;
            const y = (img.height - h) / 2;

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, x, y, w, h, 0, 0, w, h);

            setRes(canvas.toDataURL('image/jpeg'));
        };
        img.src = dataUrl;
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-2">Simple Center Crop</h3>
            <p className="text-sm text-gray-400 mb-4">Crops the center square of the image.</p>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={process} disabled={!file} className="btn-primary full-width">Crop Square</button>
            {res && (
                <div className="result-box" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img src={res} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                    <a href={res} download={`cropped_${file?.name.split('.')[0]}.jpg`} className="btn-primary full-width" style={{ marginTop: '12px', display: 'block', textDecoration: 'none' }}>Download</a>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN ROUTER

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

        default: return <div style={{ textAlign: 'center', padding: '40px' }}>Tool coming soon: {toolId}</div>
    }
}
