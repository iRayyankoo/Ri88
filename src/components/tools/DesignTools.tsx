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
                <div className="h-32 w-full rounded-xl flex items-center justify-center transition-all bg-white preview-box">
                    <p className="text-gray-500 font-bold">Element</p>
                </div>
            </div>
            <style jsx>{`
                .preview-box {
                    box-shadow: ${shadow};
                }
            `}</style>
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
            <div className="h-32 w-full rounded-xl mb-6 transition-all gradient-box" />
            <style jsx>{`
                .gradient-box {
                    background: ${grad};
                }
            `}</style>
            <div className="ui-output flex justify-between items-center">
                <code className="text-xs">{`background: ${grad};`}</code>
                <button onClick={() => navigator.clipboard.writeText(`background: ${grad};`)} className="ui-btn ghost text-xs">Copy</button>
            </div>
        </ToolShell>
    );
}

// 3. Color Extractor (Real)
function ColorExtractor() {
    const [img, setImg] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImg(url);
            extractColors(url);
        }
    };

    const extractColors = async (imageUrl: string) => {
        setIsExtracting(true);
        try {
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.src = imageUrl;
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
            });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Resize for performance
            const MAX_SIZE = 100;
            const scale = Math.min(MAX_SIZE / image.width, MAX_SIZE / image.height, 1);
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            // Simple Color Quantization (Binning)
            const colorCounts: { [key: string]: number } = {};

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                // Ignore transparent or very dark/light pixels
                if (imageData[i + 3] < 128) continue;

                // Quantize to reduced palette (round to nearest 32)
                const qr = Math.round(r / 32) * 32;
                const qg = Math.round(g / 32) * 32;
                const qb = Math.round(b / 32) * 32;

                const key = `${qr},${qg},${qb}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            // Sort by frequency
            const sortedColors = Object.entries(colorCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5) // Top 5
                .map(([key]) => {
                    const [r, g, b] = key.split(',').map(Number);
                    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                });

            setColors(sortedColors);
        } catch (error) {
            console.error("Extraction failed", error);
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <ToolShell description="استخراج الألوان الأساسية من الصور.">
            <input aria-label="Upload Image" type="file" accept="image/*" onChange={handleImageUpload} className="ui-input mb-4" />

            {img && <img src={img} alt="Preview" className="w-full h-64 object-contain rounded-lg mb-6 border border-white/10 bg-black/40" />}

            {isExtracting ? (
                <div className="text-center text-sm text-gray-400 py-4">Extracting colors...</div>
            ) : (
                <div className="flex flex-wrap gap-4 justify-center">
                    {colors.map(c => (
                        <div key={c} className="group relative" onClick={() => navigator.clipboard.writeText(c)}>
                            <div className="w-16 h-16 rounded-2xl cursor-pointer border border-white/10 shadow-lg transition-transform hover:scale-110 color-swatch flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-[10px] px-1 rounded backdrop-blur-sm">Copy</span>
                            </div>
                            <div className="text-center text-xs mt-2 font-mono text-gray-400">{c}</div>
                            <style jsx>{`
                                .color-swatch {
                                    background: ${c};
                                }
                            `}</style>
                        </div>
                    ))}
                    {img && colors.length === 0 && <div className="text-gray-500 text-sm">No distinct colors found</div>}
                </div>
            )}
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
                <div className="p-6 rounded-xl flex items-center justify-center text-lg font-bold transition-colors contrast-preview">
                    Text Preview
                </div>
                <div className="p-6 rounded-xl flex items-center justify-center text-lg font-bold transition-colors contrast-preview-inv">
                    Inverted
                </div>
            </div>
            <style jsx>{`
                .contrast-preview {
                    background-color: ${bg};
                    color: ${fg};
                }
                .contrast-preview-inv {
                    background-color: ${fg};
                    color: ${bg};
                }
            `}</style>
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
