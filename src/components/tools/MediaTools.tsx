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

export default function MediaTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'img-compress': return <ImageCompressor />;
        case 'img-resize': return <ImageResizer />;
        case 'img-webp': return <WebPConverter />;
        case 'img-filter': return <PhotoFilters />;
        case 'media-rec': return <AudioRecorder />;

        // Placeholders for others (Video tools are tricky in pure client-side without ffmpeg.wasm)
        default: return <div style={{ textAlign: 'center', padding: '40px' }}>Tool coming soon: {toolId}</div>
    }
}
