"use client";
import React, { useState, useCallback } from 'react';
import { ToolShell, ToolInputRow, ToolOutput } from './ToolShell';
import { ToolInput, ToolButton, ToolTextarea } from './ToolUi';
import { generateShadowCSS } from '@/lib/tools/design';
import { toast } from 'sonner';

interface ToolProps {
    toolId: string;
}

// 1. Shadow Generator
function ShadowGenerator() {
    const [x, setX] = useState(10);
    const [y, setY] = useState(10);
    const [blur, setBlur] = useState(20);
    const [color, setColor] = useState('#000000');
    const shadow = generateShadowCSS(x, y, blur, 0, color, 0.5);
    return (
        <ToolShell description="توليد كود CSS للظلال (Drop Shadow)." results={
            <div className="flex flex-col h-full justify-between">
                <div className="h-32 w-full rounded-xl flex items-center justify-center bg-white mb-6 border border-white/10 shadow-lg" style={{ boxShadow: shadow }}>
                    <p className="text-gray-500 font-bold">عنصر</p>
                </div>
                <ToolOutput content={`box-shadow: ${shadow};`} />
            </div>
        }>
            <div className="grid grid-cols-1 gap-4">
                <ToolInputRow label={`X: ${x}px`}><input type="range" min="-50" max="50" value={x} onChange={e => setX(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
                <ToolInputRow label={`Y: ${y}px`}><input type="range" min="-50" max="50" value={y} onChange={e => setY(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
                <ToolInputRow label={`Blur: ${blur}px`}><input type="range" min="0" max="80" value={blur} onChange={e => setBlur(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
                <ToolInputRow label="اللون"><ToolInput type="color" value={color} onChange={e => setColor(e.target.value)} /></ToolInputRow>
            </div>
        </ToolShell>
    );
}

// 2. CSS Gradient Generator
function GradientGenerator() {
    const [color1, setColor1] = useState('#6366f1');
    const [color2, setColor2] = useState('#a855f7');
    const [angle, setAngle] = useState(135);
    const [type, setType] = useState<'linear' | 'radial'>('linear');
    const css = type === 'linear'
        ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
        : `radial-gradient(circle, ${color1}, ${color2})`;
    const copy = () => { navigator.clipboard.writeText(`background: ${css};`); toast.success('تم النسخ!'); };
    return (
        <ToolShell description="مولد تدرجات لونية CSS احترافية بلمح البصر.">
            <div className="rounded-3xl h-40 w-full mb-6 border border-white/10 transition-all duration-500" style={{ background: css }} />
            <div className="grid grid-cols-2 gap-4 mb-4">
                <ToolInputRow label="اللون الأول"><ToolInput type="color" value={color1} onChange={e => setColor1(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="اللون الثاني"><ToolInput type="color" value={color2} onChange={e => setColor2(e.target.value)} /></ToolInputRow>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <ToolInputRow label="النوع">
                    <div className="flex gap-2">
                        <ToolButton variant={type === 'linear' ? 'primary' : 'secondary'} onClick={() => setType('linear')}>خطي</ToolButton>
                        <ToolButton variant={type === 'radial' ? 'primary' : 'secondary'} onClick={() => setType('radial')}>دائري</ToolButton>
                    </div>
                </ToolInputRow>
                {type === 'linear' && (
                    <ToolInputRow label={`الزاوية: ${angle}°`}>
                        <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                    </ToolInputRow>
                )}
            </div>
            <div className="p-4 bg-black/30 rounded-2xl font-mono text-sm text-brand-secondary border border-white/10 mb-4">
                background: {css};
            </div>
            <ToolButton onClick={copy} className="w-full h-12">نسخ الكود</ToolButton>
        </ToolShell>
    );
}

// 3. Contrast Checker (WCAG)
function ContrastChecker() {
    const [fg, setFg] = useState('#ffffff');
    const [bg, setBg] = useState('#6366f1');

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };
    const luminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    const [r1, g1, b1] = hexToRgb(fg.length === 7 ? fg : '#ffffff');
    const [r2, g2, b2] = hexToRgb(bg.length === 7 ? bg : '#6366f1');
    const L1 = luminance(r1, g1, b1);
    const L2 = luminance(r2, g2, b2);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const ratioFixed = ratio.toFixed(2);
    const passAA = ratio >= 4.5;
    const passAAA = ratio >= 7;

    return (
        <ToolShell description="فحص تباين الألوان للوصول (WCAG accessibility).">
            <div className="rounded-3xl h-28 flex items-center justify-center text-2xl font-black mb-6 border border-white/10" style={{ color: fg, background: bg }}>
                نص تجريبي — Sample Text
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <ToolInputRow label="لون النص"><ToolInput type="color" value={fg} onChange={e => setFg(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="لون الخلفية"><ToolInput type="color" value={bg} onChange={e => setBg(e.target.value)} /></ToolInputRow>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <div className="text-xs text-slate-400 font-bold mb-1">نسبة التباين</div>
                    <div className="text-3xl font-black text-white">{ratioFixed}:1</div>
                </div>
                <div className={`p-4 border rounded-2xl text-center ${passAA ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                    <div className="text-xs text-slate-400 font-bold mb-1">AA (4.5:1)</div>
                    <div className={`text-2xl font-black ${passAA ? 'text-emerald-400' : 'text-red-400'}`}>{passAA ? '✓ نجح' : '✗ رسب'}</div>
                </div>
                <div className={`p-4 border rounded-2xl text-center ${passAAA ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-red-500/20 border-red-500/40'}`}>
                    <div className="text-xs text-slate-400 font-bold mb-1">AAA (7:1)</div>
                    <div className={`text-2xl font-black ${passAAA ? 'text-emerald-400' : 'text-red-400'}`}>{passAAA ? '✓ نجح' : '✗ رسب'}</div>
                </div>
            </div>
        </ToolShell>
    );
}

// 4. Glassmorphism Generator
function GlassMorphism() {
    const [blur, setBlur] = useState(10);
    const [opacity, setOpacity] = useState(0.2);
    const [border, setBorder] = useState(0.3);
    const css = `backdrop-filter: blur(${blur}px);\nbackground: rgba(255,255,255,${opacity});\nborder: 1px solid rgba(255,255,255,${border});\nborder-radius: 16px;`;
    const copy = () => { navigator.clipboard.writeText(css); toast.success('تم النسخ!'); };
    return (
        <ToolShell description="مولد تأثير الزجاجية CSS (Glassmorphism).">
            <div className="relative h-40 w-full mb-6 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <div className="absolute inset-4 rounded-2xl flex items-center justify-center text-white font-bold"
                    style={{ backdropFilter: `blur(${blur}px)`, background: `rgba(255,255,255,${opacity})`, border: `1px solid rgba(255,255,255,${border})` }}>
                    Glass Effect ✨
                </div>
            </div>
            <div className="space-y-4 mb-6">
                <ToolInputRow label={`Blur: ${blur}px`}><input type="range" min="0" max="30" value={blur} onChange={e => setBlur(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
                <ToolInputRow label={`الشفافية: ${Math.round(opacity * 100)}%`}><input type="range" min="0" max="100" value={Math.round(opacity * 100)} onChange={e => setOpacity(parseInt(e.target.value) / 100)} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
                <ToolInputRow label={`الحدود: ${Math.round(border * 100)}%`}><input type="range" min="0" max="100" value={Math.round(border * 100)} onChange={e => setBorder(parseInt(e.target.value) / 100)} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
            </div>
            <div className="p-4 bg-black/30 rounded-2xl font-mono text-xs text-brand-secondary border border-white/10 mb-4 whitespace-pre">{css}</div>
            <ToolButton onClick={copy} className="w-full h-12">نسخ الكود</ToolButton>
        </ToolShell>
    );
}

// 5. Aspect Ratio Calculator
function AspectRatioCalc() {
    const [w, setW] = useState('1920');
    const [h, setH] = useState('1080');
    const [newW, setNewW] = useState('1280');

    const wn = parseFloat(w) || 1;
    const hn = parseFloat(h) || 1;
    const nwn = parseFloat(newW) || 0;
    const newH = ((nwn * hn) / wn).toFixed(0);

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g = gcd(Math.round(wn), Math.round(hn));
    const ratioW = Math.round(wn) / g;
    const ratioH = Math.round(hn) / g;

    return (
        <ToolShell description="احسب نسبة العرض إلى الارتفاع وحوّل بين أبعاد متناسبة.">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <ToolInputRow label="العرض (px)"><ToolInput type="number" value={w} onChange={e => setW(e.target.value)} /></ToolInputRow>
                <ToolInputRow label="الارتفاع (px)"><ToolInput type="number" value={h} onChange={e => setH(e.target.value)} /></ToolInputRow>
            </div>
            <div className="p-6 bg-gradient-to-r from-brand-primary/20 to-purple-600/20 border border-brand-primary/30 rounded-2xl text-center mb-6">
                <div className="text-sm text-slate-400 font-bold mb-1">نسبة الأبعاد</div>
                <div className="text-4xl font-black text-white">{ratioW}:{ratioH}</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-4">
                <div className="text-sm text-slate-400 font-bold mb-3">حوّل بحفظ النسبة</div>
                <div className="grid grid-cols-2 gap-4">
                    <ToolInputRow label="العرض الجديد"><ToolInput type="number" value={newW} onChange={e => setNewW(e.target.value)} /></ToolInputRow>
                    <div className="flex flex-col justify-end">
                        <label className="text-xs text-slate-500 font-bold mb-1">الارتفاع المحسوب</label>
                        <div className="h-10 flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-brand-primary font-bold">{newH}px</div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}

// 6. SVG Blob Generator
function BlobGenerator() {
    const [complexity, setComplexity] = useState(5);
    const [seed, setSeed] = useState(42);

    const generateBlob = useCallback(() => {
        const numPoints = complexity;
        const angleStep = (Math.PI * 2) / numPoints;
        const points = Array.from({ length: numPoints }, (_, i) => {
            const angle = i * angleStep;
            const r = 150 + (((seed * (i + 1) * 1337) % 100) - 50) * 0.6;
            return { x: 200 + r * Math.cos(angle), y: 200 + r * Math.sin(angle) };
        });
        const d = points.map((p, i) => {
            const next = points[(i + 1) % points.length];
            const cx = (p.x + next.x) / 2 + (Math.random() - 0.5) * 40;
            const cy = (p.y + next.y) / 2 + (Math.random() - 0.5) * 40;
            return `Q ${cx} ${cy} ${next.x} ${next.y}`;
        }).join(' ');
        return `M ${points[0].x} ${points[0].y} ${d} Z`;
    }, [complexity, seed]);

    const path = generateBlob();
    const svgCode = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">\n  <path d="${path}" fill="#6366f1"/>\n</svg>`;
    const copy = () => { navigator.clipboard.writeText(svgCode); toast.success('تم نسخ SVG!'); };

    return (
        <ToolShell description="مولد أشكال SVG عضوية عشوائية (Blob generator).">
            <div className="flex justify-center mb-6">
                <svg viewBox="0 0 400 400" className="w-48 h-48">
                    <path d={path} fill="url(#grad)" />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <ToolInputRow label={`التعقيد: ${complexity}`}><input type="range" min="3" max="12" value={complexity} onChange={e => setComplexity(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
                <ToolInputRow label="تحديث"><ToolButton onClick={() => setSeed(Math.floor(Math.random() * 1000))} className="w-full h-10">🎲 شكل جديد</ToolButton></ToolInputRow>
            </div>
            <ToolButton onClick={copy} className="w-full h-12">نسخ SVG</ToolButton>
        </ToolShell>
    );
}

// 7. Color Extractor (design-palette)
function ColorExtractor() {
    const palette = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
    const copy = (c: string) => { navigator.clipboard.writeText(c); toast.success(`تم نسخ ${c}`); };
    return (
        <ToolShell description="استخراج باليت الألوان من أي صورة.">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center text-slate-400 mb-6">
                📸 ارفع صورة — تجريبي: باليت نموذجية
            </div>
            <div className="grid grid-cols-5 gap-3">
                {palette.map((c, i) => (
                    <button key={i} onClick={() => copy(c)} className="group aspect-square rounded-2xl border-2 border-white/10 hover:border-white/40 transition-all flex flex-col items-center justify-end pb-1" style={{ background: c }} title={c}>
                        <span className="text-[9px] font-mono text-white/80 bg-black/30 px-1 rounded hidden group-hover:block">{c}</span>
                    </button>
                ))}
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">اضغط على أي لون لنسخه</p>
        </ToolShell>
    );
}

// 8. CSS Animation Builder (design-anim)
function AnimationBuilder() {
    const [animType, setAnimType] = useState('fade');
    const [duration, setDuration] = useState(1);

    const anims: Record<string, string> = {
        fade: `@keyframes fade {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n.element {\n  animation: fade ${duration}s ease forwards;\n}`,
        slide: `@keyframes slide {\n  from { transform: translateY(30px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}\n.element {\n  animation: slide ${duration}s ease forwards;\n}`,
        bounce: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}\n.element {\n  animation: bounce ${duration}s infinite;\n}`,
        spin: `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n.element {\n  animation: spin ${duration}s linear infinite;\n}`,
        pulse: `@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.1); }\n}\n.element {\n  animation: pulse ${duration}s ease infinite;\n}`,
    };

    const copy = () => { navigator.clipboard.writeText(anims[animType]); toast.success('تم النسخ!'); };

    return (
        <ToolShell description="منشئ أنيميشن CSS بصري بدون كتابة كود.">
            <div className="flex gap-2 flex-wrap mb-6">
                {Object.keys(anims).map(a => (
                    <ToolButton key={a} variant={animType === a ? 'primary' : 'secondary'} onClick={() => setAnimType(a)} className="capitalize">{a === 'fade' ? 'ظهور' : a === 'slide' ? 'انزلاق' : a === 'bounce' ? 'ارتداد' : a === 'spin' ? 'دوران' : 'نبض'}</ToolButton>
                ))}
            </div>
            <div className="flex justify-center mb-6 h-24 items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-purple-600"
                    style={{ animation: `${animType === 'fade' ? 'fadeIn' : animType} ${duration}s ${animType === 'spin' ? 'linear' : 'ease'} infinite`, opacity: 1 }} />
            </div>
            <ToolInputRow label={`المدة: ${duration}s`}><input type="range" min="0.2" max="3" step="0.1" value={duration} onChange={e => setDuration(parseFloat(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" /></ToolInputRow>
            <div className="mt-6 p-4 bg-black/30 rounded-2xl font-mono text-xs text-brand-secondary border border-white/10 whitespace-pre overflow-auto max-h-40">
                {anims[animType]}
            </div>
            <ToolButton onClick={copy} className="w-full h-12 mt-4">نسخ الكود</ToolButton>
        </ToolShell>
    );
}

// 9. Code to Image (design-codeimg)
function CodeToImage() {
    const [code, setCode] = useState('const greet = (name: string) => {\n  console.log(`مرحباً ${name}!`);\n  return true;\n};');
    const [lang, setLang] = useState('TypeScript');
    const [theme, setTheme] = useState('dark');

    const copy = () => { navigator.clipboard.writeText(code); toast.success('تم نسخ الكود!'); };

    return (
        <ToolShell description="تحويل الأكواد البرمجية إلى صور جاهزة للنشر.">
            <div className="mb-4 flex gap-3">
                <select value={lang} onChange={e => setLang(e.target.value)} className="flex-1 h-10 rounded-xl px-3 bg-white/10 border border-white/10 text-white text-sm">
                    {['JavaScript', 'TypeScript', 'Python', 'CSS', 'HTML', 'SQL'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ToolButton variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? '🌙 داكن' : '☀️ فاتح'}
                </ToolButton>
            </div>
            <div className={`rounded-2xl border border-white/10 overflow-hidden mb-4 ${theme === 'dark' ? 'bg-[#1e1e2e]' : 'bg-[#f8f8f2]'}`}>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/20 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-slate-400 mr-2 font-mono">{lang}</span>
                </div>
                <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className={`w-full p-4 font-mono text-sm resize-none outline-none bg-transparent ${theme === 'dark' ? 'text-[#cdd6f4]' : 'text-[#24292e]'}`}
                    rows={6}
                    dir="ltr"
                />
            </div>
            <ToolButton onClick={copy} className="w-full h-12">نسخ الكود</ToolButton>
        </ToolShell>
    );
}

// 10. Mockup Generator (design-mockup)
function MockupGenerator() {
    const [url, setUrl] = useState('https://rayyan.sa');
    const [device, setDevice] = useState('mobile');
    return (
        <ToolShell description="معاينة موقعك أو تطبيقك داخل موك أب احترافي.">
            <div className="grid grid-cols-3 gap-2 mb-6">
                {['mobile', 'tablet', 'desktop'].map(d => (
                    <ToolButton key={d} variant={device === d ? 'primary' : 'secondary'} onClick={() => setDevice(d)}>
                        {d === 'mobile' ? '📱 موبايل' : d === 'tablet' ? '📟 تابلت' : '🖥️ سطح المكتب'}
                    </ToolButton>
                ))}
            </div>
            <ToolInputRow label="رابط الموقع"><ToolInput value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." /></ToolInputRow>
            <div className="mt-6 flex justify-center">
                <div className={`relative border-4 border-white/20 rounded-3xl overflow-hidden shadow-2xl bg-black
                    ${device === 'mobile' ? 'w-48 h-96' : device === 'tablet' ? 'w-64 h-80' : 'w-full h-48'}`}>
                    <div className="absolute top-0 left-0 right-0 h-6 bg-black flex items-center justify-center">
                        <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    <iframe src={url} className="w-full h-full border-0 mt-6" title="Mockup Preview" sandbox="allow-same-origin" />
                </div>
            </div>
        </ToolShell>
    );
}

// 11. Font Pairer
function FontPairer() {
    const pairs = [
        { h: 'Playfair Display', p: 'Source Sans Pro', desc: 'أنيق وعصري' },
        { h: 'Montserrat', p: 'Open Sans', desc: 'نظيف ومؤسسي' },
        { h: 'Oswald', p: 'Quattrocento', desc: 'جريء وكلاسيكي' },
        { h: 'Abril Fatface', p: 'Poppins', desc: 'أنيق وودّي' }
    ];
    const [idx, setIdx] = useState(0);
    return (
        <ToolShell description="اقتراح أفضل الخطوط المتناسقة لتصميماتك.">
            <div className="space-y-8 p-8 bg-white/5 border border-white/10 rounded-3xl text-left" dir="ltr">
                <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: pairs[idx].h }}>الثعلب البني السريع</h2>
                <p className="text-lg text-slate-300 leading-relaxed" style={{ fontFamily: pairs[idx].p }}>
                    يقفز فوق الكلب الكسول. توليفة {pairs[idx].h} مع {pairs[idx].p} تعطي شعوراً {pairs[idx].desc} لمشروعك.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
                {pairs.map((p, i) => (
                    <ToolButton key={i} variant={idx === i ? 'primary' : 'secondary'} onClick={() => setIdx(i)}>{p.h}</ToolButton>
                ))}
            </div>
        </ToolShell>
    );
}

// 12. Simple Chart Maker
function ChartMaker() {
    const [data, setData] = useState('20, 45, 30, 80, 50');
    const vals = data.split(',').map(v => parseFloat(v.trim()) || 0);
    const max = Math.max(...vals, 1);
    return (
        <ToolShell description="حول بياناتك إلى رسوم بيانية بسيطة بلمح البصر.">
            <ToolInputRow label="بيانات الرسم (أرقام مفصولة بفاصلة)">
                <ToolInput value={data} onChange={e => setData(e.target.value)} placeholder="10, 20, 30..." />
            </ToolInputRow>
            <div className="mt-8 flex items-end justify-between h-48 gap-2 px-4 bg-white/5 rounded-3xl border border-white/10">
                {vals.map((v, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-brand-primary to-purple-500 rounded-t-lg transition-all relative group" style={{ height: `${(v / max) * 100}%` }}>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100">{v}</span>
                    </div>
                ))}
            </div>
        </ToolShell>
    );
}

// 13. Mind Map Tree
function MindMapTree() {
    const [input, setInput] = useState('المشروع\n  التصميم\n    واجهة المستخدم\n    تجربة المستخدم\n  التطوير\n    الواجهة الأمامية\n    الخلفية');
    return (
        <ToolShell description="حول قوائمك النصية إلى خرائط ذهنية مرئية.">
            <ToolTextarea value={input} onChange={e => setInput(e.target.value)} className="h-48 font-mono mb-4" />
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl overflow-auto">
                <pre className="text-brand-secondary font-mono text-sm">{input}</pre>
            </div>
        </ToolShell>
    );
}

export default function DesignTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'design-shadow': return <ShadowGenerator />;
        case 'design-gradient': return <GradientGenerator />;
        case 'design-contrast': return <ContrastChecker />;
        case 'design-glass': return <GlassMorphism />;
        case 'design-ratio': return <AspectRatioCalc />;
        case 'design-blob': return <BlobGenerator />;
        case 'design-palette': return <ColorExtractor />;
        case 'design-anim': return <AnimationBuilder />;
        case 'design-codeimg': return <CodeToImage />;
        case 'design-mockup': return <MockupGenerator />;
        case 'design-font-pair': return <FontPairer />;
        case 'design-chart': return <ChartMaker />;
        case 'design-mindmap': return <MindMapTree />;
        default: return <div className="text-center py-12 opacity-50">أداة تصميم غير موجودة</div>;
    }
}
