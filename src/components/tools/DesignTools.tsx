"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';

interface ToolProps {
    toolId: string;
}

// 1. Shadow Generator
function ShadowGenerator() {
    const [x, setX] = useState(10);
    const [y, setY] = useState(10);
    const [blur, setBlur] = useState(20);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState('#000000');
    const [opacity, setOpacity] = useState(0.5);
    const shadow = `${x}px ${y}px ${blur}px ${spread}px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;

    return (
        <ToolShell description="توليد كود CSS للظلال (Drop Shadow).">
            <div className="ui-grid-2">
                <div>
                    <ToolInputRow label={`X-Offset: ${x}px`}><input aria-label="X Offset" type="range" min="-50" max="50" value={x} onChange={e => setX(parseInt(e.target.value))} className="w-full" /></ToolInputRow>
                    <ToolInputRow label={`Y-Offset: ${y}px`}><input aria-label="Y Offset" type="range" min="-50" max="50" value={y} onChange={e => setY(parseInt(e.target.value))} className="w-full" /></ToolInputRow>
                    <ToolInputRow label={`Blur: ${blur}px`}><input aria-label="Blur Radius" type="range" min="0" max="100" value={blur} onChange={e => setBlur(parseInt(e.target.value))} className="w-full" /></ToolInputRow>
                    <ToolInputRow label={`Spread: ${spread}px`}><input aria-label="Spread Radius" type="range" min="-50" max="50" value={spread} onChange={e => setSpread(parseInt(e.target.value))} className="w-full" /></ToolInputRow>
                    <ToolInputRow label="Color"><input aria-label="Shadow Color" type="color" value={color} onChange={e => setColor(e.target.value)} className="ui-input p-0 h-10" /></ToolInputRow>
                    <ToolInputRow label={`Opacity: ${opacity}`}><input aria-label="Shadow Opacity" type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full" /></ToolInputRow>
                </div>
                {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
                <div className="h-32 w-full rounded-xl flex items-center justify-center transition-all bg-white" style={{ boxShadow: shadow }}>
                    <p className="text-gray-500 font-bold">Element</p>
                </div>
            </div>
            <div className="ui-output mt-4 flex justify-between items-center">
                <code className="text-xs">{`box-shadow: ${shadow};`}</code>
                <button onClick={() => navigator.clipboard.writeText(`box-shadow: ${shadow};`)} className="ui-btn ghost text-xs">Copy</button>
            </div>
        </ToolShell>
    );
}

// 2. Gradient Generator
function GradientGenerator() {
    const [c1, setC1] = useState('#8e44ad');
    const [c2, setC2] = useState('#3498db');
    const [deg, setDeg] = useState(45);
    const grad = `linear-gradient(${deg}deg, ${c1}, ${c2})`;

    return (
        <ToolShell description="توليد تدرجات لونية (Gradients).">
            <div className="ui-grid-3">
                <input aria-label="Gradient Color 1" type="color" value={c1} onChange={e => setC1(e.target.value)} className="ui-input p-0 h-12" />
                <input aria-label="Gradient Color 2" type="color" value={c2} onChange={e => setC2(e.target.value)} className="ui-input p-0 h-12" />
                <div className="flex items-center"><input aria-label="Gradient Angle" type="number" value={deg} onChange={e => setDeg(parseInt(e.target.value))} className="ui-input" /><span className="ml-2">deg</span></div>
            </div>
            {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
            <div className="h-32 w-full rounded-xl mb-6 transition-all" style={{ background: grad }} />
            <div className="ui-output flex justify-between items-center">
                <code className="text-xs">{`background: ${grad};`}</code>
                <button onClick={() => navigator.clipboard.writeText(`background: ${grad};`)} className="ui-btn ghost text-xs">Copy</button>
            </div>
        </ToolShell>
    );
}

// 3. Color Extractor (Mock)
function ColorExtractor() {
    const [img, setImg] = useState<string | null>(null);
    const [colors] = useState(['#ff0000', '#00ff00', '#0000ff', '#f1c40f', '#9b59b6']);
    return (
        <ToolShell description="استخراج الألوان من الصور (تجريبي).">
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); }} className="ui-input mb-4" />
            {img && <img src={img} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4 border border-white/10" />}
            <div className="flex gap-2 justify-center">
                {colors.map(c => (
                    // eslint-disable-next-line
                    <div key={c} className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20" style={{ background: c }} onClick={() => navigator.clipboard.writeText(c)}></div>
                ))}
            </div>
        </ToolShell>
    );
}

// 4. Contrast Checker
function ContrastChecker() {
    const [bg, setBg] = useState('#ffffff');
    const [fg, setFg] = useState('#000000');

    // Helper to calculate luminance
    const getLum = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
        const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const ratio = React.useMemo(() => {
        if (bg.length === 7 && fg.length === 7) {
            const l1 = getLum(bg), l2 = getLum(fg);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }
        return null;
    }, [bg, fg]);

    return (
        <ToolShell description="التحقق من تباين الألوان (Accessibility).">
            <div className="ui-grid-2 mb-4">
                <ToolInputRow label="Background"><input aria-label="Background Color" type="color" value={bg} onChange={e => setBg(e.target.value)} className="ui-input p-0 h-10" /></ToolInputRow>
                <ToolInputRow label="Text"><input aria-label="Text Color" type="color" value={fg} onChange={e => setFg(e.target.value)} className="ui-input p-0 h-10" /></ToolInputRow>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
                <div className="p-6 rounded-xl flex items-center justify-center text-lg font-bold transition-colors" style={{ backgroundColor: bg, color: fg }}>
                    Text Preview
                </div>
                {/* eslint-disable-next-line react-dom/no-unsafe-inline-style */}
                <div className="p-6 rounded-xl flex items-center justify-center text-lg font-bold transition-colors" style={{ backgroundColor: fg, color: bg }}>
                    Inverted
                </div>
            </div>
            {ratio && (
                <div className="ui-output text-center mt-4">
                    <div className="text-3xl font-bold mb-2">{ratio.toFixed(2)}</div>
                    <div className={ratio >= 4.5 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{ratio >= 4.5 ? '✓ Good (AA)' : '✕ Poor Contrast'}</div>
                </div>
            )}
        </ToolShell>
    );
}

export default function DesignTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'design-shadow': return <ShadowGenerator />;
        case 'design-gradient': return <GradientGenerator />;
        case 'design-palette': return <ColorExtractor />;
        case 'design-contrast': return <ContrastChecker />;
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
