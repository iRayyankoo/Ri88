"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow, ToolOutput } from './ToolShell';
import { ToolInput, ToolButton } from './ToolUi';
import { FileUploadZone } from '../Inputs/FileUploadZone';
import Image from 'next/image';
import { generateShadowCSS, generateGradientCSS, calculateContrastRatio, quantizeColors } from '@/lib/tools/design';

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

    const shadow = generateShadowCSS(x, y, blur, spread, color, opacity);

    return (
        <ToolShell
            description="توليد كود CSS للظلال (Drop Shadow)."
            results={
                <div className="flex flex-col h-full justify-between">
                    <style jsx>{`
                        .preview-box {
                            box-shadow: ${shadow};
                        }
                    `}</style>
                    <div className="h-32 w-full rounded-xl flex items-center justify-center transition-all bg-white mb-6 border border-white/10 preview-box">
                        <p className="text-gray-500 font-bold">Element</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-white/50 font-mono">CSS Output</span>
                            <ToolButton variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(`box-shadow: ${shadow};`)}>Copy</ToolButton>
                        </div>
                        <ToolOutput content={`box-shadow: ${shadow};`} />
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-4">
                <ToolInputRow label={`X-Offset: ${x}px`}>
                    <input type="range" min="-50" max="50" value={x} onChange={e => setX(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" aria-label="X Offset" />
                </ToolInputRow>
                <ToolInputRow label={`Y-Offset: ${y}px`}>
                    <input type="range" min="-50" max="50" value={y} onChange={e => setY(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" aria-label="Y Offset" />
                </ToolInputRow>
                <ToolInputRow label={`Blur: ${blur}px`}>
                    <input type="range" min="0" max="100" value={blur} onChange={e => setBlur(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" aria-label="Blur Radius" />
                </ToolInputRow>
                <ToolInputRow label={`Spread: ${spread}px`}>
                    <input type="range" min="-50" max="50" value={spread} onChange={e => setSpread(parseInt(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" aria-label="Spread Radius" />
                </ToolInputRow>
                <ToolInputRow label="Color">
                    <ToolInput type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 p-1 w-full cursor-pointer" aria-label="Shadow Color" />
                </ToolInputRow>
                <ToolInputRow label={`Opacity: ${opacity}`}>
                    <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full accent-brand-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" aria-label="Shadow Opacity" />
                </ToolInputRow>
            </div>
        </ToolShell>
    );
}

// 2. Gradient Generator
function GradientGenerator() {
    const [c1, setC1] = useState('#8e44ad');
    const [c2, setC2] = useState('#3498db');
    const [deg, setDeg] = useState(45);
    const grad = generateGradientCSS(deg, c1, c2);

    return (
        <ToolShell
            description="توليد تدرجات لونية (Gradients)."
            results={
                <div className="flex flex-col h-full justify-between">
                    <style jsx>{`
                        .gradient-box {
                            background: ${grad};
                        }
                    `}</style>
                    <div className="h-32 w-full rounded-xl mb-6 transition-all border border-white/10 gradient-box" />
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-white/50 font-mono">CSS Output</span>
                            <ToolButton variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(`background: ${grad};`)}>Copy</ToolButton>
                        </div>
                        <ToolOutput content={`background: ${grad};`} />
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <ToolInputRow label="Color 1">
                    <ToolInput type="color" value={c1} onChange={e => setC1(e.target.value)} className="h-12 w-full p-1 cursor-pointer" aria-label="Gradient Color 1" />
                </ToolInputRow>
                <ToolInputRow label="Color 2">
                    <ToolInput type="color" value={c2} onChange={e => setC2(e.target.value)} className="h-12 w-full p-1 cursor-pointer" aria-label="Gradient Color 2" />
                </ToolInputRow>
                <ToolInputRow label="Angle (deg)">
                    <ToolInput type="number" value={deg} onChange={e => setDeg(parseInt(e.target.value))} className="h-12 font-bold text-center" aria-label="Gradient Angle" />
                </ToolInputRow>
            </div>
        </ToolShell>
    );
}

// 3. Color Extractor (Real)
function ColorExtractor() {
    const [img, setImg] = useState<string | null>(null);
    const [colors, setColors] = useState<string[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);

    const handleImageUpload = (file: File | null) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setImg(url);
            extractColors(url);
        }
    };

    const extractColors = async (imageUrl: string) => {
        setIsExtracting(true);
        try {
            const image = new window.Image();
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

            // Use pure logic function for quantization
            const topColors = quantizeColors(imageData, 5);
            setColors(topColors);
        } catch (error) {
            console.error("Extraction failed", error);
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <ToolShell
            description="استخراج الألوان الأساسية من الصور."
            results={
                <div className="flex flex-col h-full">
                    {img && (
                        <div className="relative w-full h-48 mb-6 rounded-xl border border-white/10 overflow-hidden bg-black/40">
                            <Image
                                src={img}
                                alt="Preview"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    )}

                    {isExtracting ? (
                        <div className="text-center text-sm text-gray-400 py-4">Extracting colors...</div>
                    ) : (
                        <div className="flex flex-wrap gap-4 justify-center">
                            {colors.map(c => (
                                <div key={c} className="group relative" onClick={() => navigator.clipboard.writeText(c)}>
                                    <style jsx>{`
                                        .swatch-${c.replace('#', '')} {
                                            background: ${c};
                                        }
                                    `}</style>
                                    <div
                                        className={`w-16 h-16 rounded-2xl cursor-pointer border border-white/10 shadow-lg transition-transform hover:scale-110 flex items-center justify-center transform active:scale-95 swatch-${c.replace('#', '')}`}
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-[10px] px-1 rounded backdrop-blur-sm">Copy</span>
                                    </div>
                                    <div className="text-center text-xs mt-2 font-mono text-gray-400">{c}</div>
                                </div>
                            ))}
                            {img && colors.length === 0 && <div className="text-gray-500 text-sm">No distinct colors found</div>}
                        </div>
                    )}
                </div>
            }
        >
            <div className="mb-4">
                <FileUploadZone
                    onFileChange={handleImageUpload}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    title="Upload Image"
                />
            </div>
        </ToolShell>
    );
}

// 4. Contrast Checker
function ContrastChecker() {
    const [bg, setBg] = useState('#ffffff');
    const [fg, setFg] = useState('#000000');

    const result = calculateContrastRatio(bg, fg);

    return (
        <ToolShell
            description="التحقق من تباين الألوان (Accessibility)."
            results={
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <style jsx>{`
                            .c-bg { background-color: ${bg}; color: ${fg}; }
                            .c-fg { background-color: ${fg}; color: ${bg}; }
                        `}</style>
                        <div className="p-6 rounded-xl flex items-center justify-center text-lg font-bold transition-colors shadow-lg border border-white/5 c-bg">
                            Text Preview
                        </div>
                        <div className="p-6 rounded-xl flex items-center justify-center text-lg font-bold transition-colors shadow-lg border border-white/5 c-fg">
                            Inverted
                        </div>
                    </div>
                    {result && (
                        <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="text-3xl font-bold mb-2">{result.ratio}</div>
                            <div className={result.ratio >= 4.5 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                {result.rating === 'Good (AA)' ? '✓ Good (AA)' : '✕ Poor Contrast'}
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            <div className="grid grid-cols-1 gap-4 mb-4">
                <ToolInputRow label="Background Color">
                    <ToolInput type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-12 w-full p-1 cursor-pointer" aria-label="Background Color" />
                </ToolInputRow>
                <ToolInputRow label="Text Color">
                    <ToolInput type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-12 w-full p-1 cursor-pointer" aria-label="Text Color" />
                </ToolInputRow>
            </div>
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
