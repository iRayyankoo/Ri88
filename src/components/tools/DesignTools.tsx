"use client";
import React, { useState, useEffect } from 'react';

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
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
        <div className="tool-ui-group">
            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <label>X Offset: <input type="range" min="-50" max="50" value={x} onChange={e => setX(parseInt(e.target.value))} /></label>
                    <label>Y Offset: <input type="range" min="-50" max="50" value={y} onChange={e => setY(parseInt(e.target.value))} /></label>
                    <label>Blur: <input type="range" min="0" max="100" value={blur} onChange={e => setBlur(parseInt(e.target.value))} /></label>
                    <label>Spread: <input type="range" min="-50" max="50" value={spread} onChange={e => setSpread(parseInt(e.target.value))} /></label>
                    <label>Color: <input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
                    <label>Opacity: <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} /></label>
                </div>
                <div className="flex-1 flex items-center justify-center bg-white rounded p-4">
                    <div style={{ width: '100px', height: '100px', background: '#3498db', boxShadow: shadow, borderRadius: '8px' }}></div>
                </div>
            </div>
            <div className="glass-panel p-2 mt-4 font-mono text-xs select-all">box-shadow: {shadow};</div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Gradient Generator
function GradientGenerator() {
    const [c1, setC1] = useState('#8e44ad');
    const [c2, setC2] = useState('#3498db');
    const [deg, setDeg] = useState(45);

    const grad = `linear-gradient(${deg}deg, ${c1}, ${c2})`;

    return (
        <div className="tool-ui-group">
            <div className="flex gap-4 mb-4">
                <input type="color" value={c1} onChange={e => setC1(e.target.value)} className="h-10 w-full" />
                <input type="color" value={c2} onChange={e => setC2(e.target.value)} className="h-10 w-full" />
                <input type="number" value={deg} onChange={e => setDeg(parseInt(e.target.value))} className="glass-input w-20" /> deg
            </div>
            <div style={{ height: '150px', background: grad, borderRadius: '8px', marginBottom: '16px' }}></div>
            <div className="glass-panel p-2 font-mono text-xs select-all">background: {grad};</div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Color Extractor (Mock/Basic)
function ColorExtractor() {
    const [img, setImg] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);

    const handleImg = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImg(url);
            // Mock extraction logic (real requires canvas pixel analysis)
            setColors(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff']);
        }
    };

    return (
        <div className="tool-ui-group">
            <input type="file" accept="image/*" onChange={handleImg} className="glass-input full-width mb-4" />
            {img && <img src={img} alt="Preview" className="w-full h-48 object-cover rounded mb-4" />}
            <div className="flex gap-2 justify-center">
                {colors.map(c => (
                    <div key={c} style={{ background: c, width: '40px', height: '40px', borderRadius: '50%' }} title={c} className="cursor-pointer border border-white" onClick={() => navigator.clipboard.writeText(c)}></div>
                ))}
            </div>
            {img && <p className="text-center text-xs text-gray-400 mt-2">Click color to copy (Mock Palette)</p>}
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. Contrast Checker
function ContrastChecker() {
    const [bg, setBg] = useState('#ffffff');
    const [fg, setFg] = useState('#000000');
    const [ratio, setRatio] = useState<number | null>(null);

    const getLum = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    useEffect(() => {
        if (bg.length === 7 && fg.length === 7) {
            const l1 = getLum(bg);
            const l2 = getLum(fg);
            const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            setRatio(ratio);
        }
    }, [bg, fg]);

    return (
        <div className="tool-ui-group">
            <div className="flex gap-4 mb-4">
                <div className="flex-1 text-center">
                    <label>Background</label>
                    <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 mt-1" />
                </div>
                <div className="flex-1 text-center">
                    <label>Text</label>
                    <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-full h-10 mt-1" />
                </div>
            </div>

            <div style={{ background: bg, color: fg, padding: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em' }}>
                Preview Text
            </div>

            {ratio && (
                <div className="mt-4 text-center">
                    <div className="text-3xl font-bold">{ratio.toFixed(2)}</div>
                    <div className={`text-sm ${ratio >= 4.5 ? 'text-green-500' : 'text-red-500'}`}>
                        {ratio >= 4.5 ? 'Passes AA' : 'Fails AA'}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DesignTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'design-shadow': return <ShadowGenerator />;
        case 'design-gradient': return <GradientGenerator />;
        case 'design-palette': return <ColorExtractor />;
        case 'design-contrast': return <ContrastChecker />;
        default: return <div style={{ padding: '20px', textAlign: 'center' }}>Tool coming soon: {toolId}</div>
    }
}
