"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolTextarea, ToolButton } from './ToolUi';

interface ToolProps {
    toolId: string;
}

// 1. User-Agent Parser (Phase 7)
function UserAgentParser() {
    const [ua, setUa] = useState('');
    const [data, setData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setTimeout(() => setUa(navigator.userAgent), 0);
        }
    }, []);

    const parse = () => {
        // Simple mock parser for UI demo
        const isMobile = /Mobile|Android|iPhone/i.test(ua);
        const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : 'Other';
        setData({ browser, os: 'Windows/MacOS', device: isMobile ? 'Mobile' : 'Desktop' });
    };

    return (
        <ToolShell description="استخراج تفاصيل الجهاز والمتصفح ونظام التشغيل من سلسلة User-Agent.">
            <ToolTextarea value={ua} onChange={e => setUa(e.target.value)} className="h-32 font-mono text-sm" placeholder="سلسلة User Agent..." />
            <ToolButton onClick={parse} className="w-full mt-4 h-14">تحليل البيانات</ToolButton>
            {data && (
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {Object.entries(data).map(([k, v]) => (
                        <div key={k} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                            <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">{k}</span>
                            <span className="text-white font-bold">{v as string}</span>
                        </div>
                    ))}
                </div>
            )}
        </ToolShell>
    );
}

// 2. Base64 Image Decoder (Phase 7)
function Base64ImageDecoder() {
    const [input, setInput] = useState('');
    return (
        <ToolShell description="معاينة الصور المشفرة بكود Base64 فوراً وبسهولة.">
            <ToolTextarea value={input} onChange={e => setInput(e.target.value)} className="h-48 font-mono text-[10px]" placeholder="data:image/png;base64,..." />
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center min-h-[200px]">
                {input ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={input} alt="Preview" className="max-w-full rounded-xl shadow-2xl" />
                ) : (
                    <span className="text-slate-500">الصق الكود للمعاينة</span>
                )}
            </div>
        </ToolShell>
    );
}

// 3. Unix Timestamp (Phase 8)
function UnixConverter() {
    const [input, setInput] = useState('');
    const [res, setRes] = useState('');

    useEffect(() => {
        setTimeout(() => setInput(Math.floor(Date.now() / 1000).toString()), 0);
    }, []);

    const convert = () => {
        try {
            const date = new Date(parseInt(input) * 1000);
            setRes(date.toLocaleString('ar-EG'));
        } catch { toast.error("طابع وقت غير صحيح"); }
    };
    return (
        <ToolShell description="التحويل بين طابع الوقت Unix والتاريخ المقروء.">
            <ToolInputRow label="طابع الوقت (Unix)"><ToolInput value={input} onChange={e => setInput(e.target.value)} /></ToolInputRow>
            <ToolButton onClick={convert} className="w-full mt-4">تحويل إلى تاريخ</ToolButton>
            {res && <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl text-center text-xl font-bold text-brand-primary">{res}</div>}
        </ToolShell>
    );
}

// 4. Color Pro (Phase 8)
function ColorPro() {
    const [color, setColor] = useState('#6366f1');
    return (
        <ToolShell description="محول ألوان متقدم مع اقتراحات Tailwind CSS.">
            <div className="flex gap-4 items-center mb-6">
                <input type="color" title="Color Picker" aria-label="Color Picker" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-2xl bg-transparent border-0 cursor-pointer" />
                <ToolInput value={color} onChange={e => setColor(e.target.value)} className="flex-1 text-2xl font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-500 block">قيمة HEX</span>
                    <code className="text-white">{color.toUpperCase()}</code>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-slate-500 block">Tailwind</span>
                    <code className="text-brand-secondary">bg-indigo-500</code>
                </div>
            </div>
        </ToolShell>
    );
}

// 5. Binary Visualizer (Phase 8)
function BinaryVisualizer() {
    const [bin, setBin] = useState('01101001 01101100 01101111 01110110 01100101 01111001 01101111 01110101');
    const bits = bin.replace(/\s/g, '').split('');
    return (
        <ToolShell description="تحويل البيانات الثنائية (Binary) إلى تمثيل مرئي هندسي.">
            <ToolTextarea value={bin} onChange={e => setBin(e.target.value)} className="font-mono text-xs mb-4" />
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 p-4 bg-black/40 rounded-3xl border border-white/5">
                {bits.map((b, i) => (
                    <div key={i} className={`aspect-square rounded-sm ${b === '1' ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'bg-white/5'}`} />
                ))}
            </div>
        </ToolShell>
    );
}

// 6. JWT Debugger
function JwtDebugger() {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState<{ header: object; payload: object } | null>(null);
    const decode = () => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) throw new Error('Invalid JWT');
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            setDecoded({ header, payload });
        } catch { toast.error('توكن JWT غير صحيح'); }
    };
    return (
        <ToolShell description="فك تشفير وفحص رموز JWT مباشرة.">
            <ToolTextarea value={token} onChange={e => setToken(e.target.value)} className="h-24 font-mono text-xs text-left" dir="ltr" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
            <ToolButton onClick={decode} className="w-full mt-4 h-12">فك التشفير</ToolButton>
            {decoded && (
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-xs text-brand-primary font-bold mb-2">Header</div>
                        <pre className="text-xs text-slate-300 font-mono overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-xs text-brand-secondary font-bold mb-2">Payload</div>
                        <pre className="text-xs text-slate-300 font-mono overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
                    </div>
                </div>
            )}
        </ToolShell>
    );
}

// 7. Cron Job Generator
function CronGen() {
    const [min, setMin] = useState('0');
    const [hr, setHr] = useState('*');
    const [dom, setDom] = useState('*');
    const [mon, setMon] = useState('*');
    const [dow, setDow] = useState('*');
    const cron = `${min} ${hr} ${dom} ${mon} ${dow}`;
    const presets = [
        { label: 'كل دقيقة', value: '* * * * *' },
        { label: 'كل ساعة', value: '0 * * * *' },
        { label: 'يومياً 12 ص', value: '0 12 * * *' },
        { label: 'أسبوعياً', value: '0 9 * * 1' },
        { label: 'شهرياً', value: '0 0 1 * *' },
    ];
    const copy = () => { navigator.clipboard.writeText(cron); toast.success('تم النسخ!'); };
    return (
        <ToolShell description="توليد جداول Cron للمهام المجدولة.">
            <div className="grid grid-cols-5 gap-2 mb-4">
                {[['Min', min, setMin], ['Hour', hr, setHr], ['DOM', dom, setDom], ['Mon', mon, setMon], ['DOW', dow, setDow]].map(([label, val, setter]) => (
                    <ToolInputRow key={label as string} label={label as string}>
                        <ToolInput value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} className="text-center font-mono" />
                    </ToolInputRow>
                ))}
            </div>
            <div className="p-4 bg-black/30 rounded-2xl font-mono text-xl text-brand-primary text-center border border-white/10 mb-4">{cron}</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {presets.map(p => <ToolButton key={p.label} variant="secondary" onClick={() => { const parts = p.value.split(' '); setMin(parts[0]); setHr(parts[1]); setDom(parts[2]); setMon(parts[3]); setDow(parts[4]); }}>{p.label}</ToolButton>)}
            </div>
            <ToolButton onClick={copy} className="w-full h-12">نسخ الجدول</ToolButton>
        </ToolShell>
    );
}

// 8. Meta Tags Generator
function MetaTagsGen() {
    const [title, setTitle] = useState('عنوان الصفحة');
    const [desc, setDesc] = useState('وصف الصفحة');
    const [url, setUrl] = useState('https://example.com');
    const tags = `<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:url" content="${url}">\n<meta name="twitter:card" content="summary_large_image">`;
    const copy = () => { navigator.clipboard.writeText(tags); toast.success('تم النسخ!'); };
    return (
        <ToolShell description="توليد وسوم الميتا وSEO لصفحات الويب.">
            <div className="space-y-4 mb-6">
                <ToolInputRow label="عنوان الصفحة"><ToolInput value={title} onChange={e => setTitle(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الوصف"><ToolInput value={desc} onChange={e => setDesc(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="رابط URL"><ToolInput value={url} onChange={e => setUrl(e.target.value)} dir="ltr" /></ToolInputRow>
            </div>
            <div className="p-4 bg-black/30 rounded-2xl font-mono text-xs text-brand-secondary border border-white/10 mb-4 whitespace-pre-wrap overflow-auto max-h-44" dir="ltr">{tags}</div>
            <ToolButton onClick={copy} className="w-full h-12">نسخ الكود</ToolButton>
        </ToolShell>
    );
}

// 9. Screen Info
function ScreenInfo() {
    const info = typeof window !== 'undefined' ? [
        { label: 'دقة الشاشة', value: `${window.screen.width} × ${window.screen.height}` },
        { label: 'نافذة المتصفح', value: `${window.innerWidth} × ${window.innerHeight}` },
        { label: 'كثافة البكسل', value: `${window.devicePixelRatio}x` },
        { label: 'نظام التشغيل', value: navigator.platform },
        { label: 'المتصفح', value: navigator.userAgent.split(') ')[0].split('(')[1] || navigator.appName },
        { label: 'اللغة', value: navigator.language },
    ] : [];
    return (
        <ToolShell description="معلومات دققية عن شاشتك ومتصفحك.">
            <div className="grid grid-cols-2 gap-4">
                {info.map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="text-xs text-slate-400 font-bold mb-1">{item.label}</div>
                        <div className="text-white font-mono font-bold truncate">{item.value}</div>
                    </div>
                ))}
            </div>
        </ToolShell>
    );
}

export default function DeveloperTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'tech-ua-parser': return <UserAgentParser />;
        case 'tech-base64-img': return <Base64ImageDecoder />;
        case 'dev-unix': return <UnixConverter />;
        case 'dev-color-pro': return <ColorPro />;
        case 'dev-binary': return <BinaryVisualizer />;
        case 'dev-jwt': return <JwtDebugger />;
        case 'dev-cron': return <CronGen />;
        case 'dev-meta': return <MetaTagsGen />;
        case 'dev-screen': return <ScreenInfo />;
        default: return null;
    }
}
