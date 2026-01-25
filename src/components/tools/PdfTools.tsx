"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Download, FileUp, Loader2, Lock, Settings, Image as ImageIcon, FileText, Scissors, Layers, RefreshCw, Trash2, ArrowUpDown, Crop } from 'lucide-react';

// Declare globals for CDN loaded libraries
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PDFLib: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfjsLib: any;
    }
}

interface ToolProps {
    toolId: string;
}

// ----------------------------------------------------------------------
// HELPER: Read File
const readFile = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

const download = (data: Uint8Array | Blob, filename: string) => {
    const blob = data instanceof Blob ? data : new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

// ----------------------------------------------------------------------
// 1. MERGE PDFs
function PDFMerger() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [processing, setProcessing] = useState(false);

    const merge = async () => {
        if (!files || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const bytes = await readFile(file);
                const pdf = await PDFDocument.load(bytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                copiedPages.forEach((page: any) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            download(pdfBytes, 'merged.pdf');
        } catch (e: unknown) {
            alert('Error: ' + (e as Error).message);
        }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Layers className="w-5 h-5 text-blue-400" /> Merge PDFs</h3>
            <input type="file" multiple accept=".pdf" onChange={e => setFiles(e.target.files)} className="glass-input full-width mb-2" />
            <div className="text-sm text-gray-400 mb-4">
                {files ? `${files.length} files selected` : 'Select multiple PDF files to combine'}
            </div>
            <button onClick={merge} disabled={!files || processing} className="btn-primary full-width">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : 'Merge Files'}
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. SPLIT PDFs
function PDFSplitter() {
    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState('');
    const [processing, setProcessing] = useState(false);

    const split = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            const newPdf = await PDFDocument.create();
            let indices: number[] = [];

            if (!range) {
                // If empty, extract all as single PDF? Or maybe split into individual pages?
                // For this tool, let's assume "Extract All" implies just saving a copy, 
                // but usually Split implies extracting specific ranges. 
                // If user wants 1 page per file, that's a different mode.
                // Let's default to: If empty, select ALL pages (copy).
                indices = pdf.getPageIndices();
            } else {
                // Simple parser "1-3, 5"
                range.split(',').forEach(part => {
                    if (part.includes('-')) {
                        const [s, e] = part.split('-').map(x => parseInt(x) - 1);
                        for (let i = s; i <= e; i++) if (i >= 0 && i < total) indices.push(i);
                    } else {
                        const idx = parseInt(part) - 1;
                        if (idx >= 0 && idx < total) indices.push(idx);
                    }
                });
            }

            const copiedPages = await newPdf.copyPages(pdf, indices);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            copiedPages.forEach((p: any) => newPdf.addPage(p));

            const pdfBytes = await newPdf.save();
            download(pdfBytes, `split_${file.name}`);

        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Scissors className="w-5 h-5 text-green-400" /> Split PDF</h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <div className="input-row mb-4">
                <label className="text-gray-300 block mb-1">Page Ranges (e.g. 1-3, 5)</label>
                <input value={range} onChange={e => setRange(e.target.value)} className="glass-input bg-dark full-width" placeholder="e.g. 1-5, 8" />
            </div>
            <button onClick={split} disabled={!file || processing} className="btn-primary full-width">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Splitting...</> : 'Extract Pages'}
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. COMPRESS PDF
function PDFCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const compress = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            // Load and save is often enough to "optimize" structure in pdf-lib
            const pdf = await PDFDocument.load(bytes);

            // We can strictly copy pages to a fresh document to discard unused objects
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdf, pdf.getPageIndices());
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            copiedPages.forEach((p: any) => newPdf.addPage(p));

            const pdfBytes = await newPdf.save({ useObjectStreams: false }); // Try disabling object streams for compatibility or enabling for size? 
            // Enabling object streams usually reduces size. default is true.
            // Let's try default save first.

            download(pdfBytes, `compressed_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Settings className="w-5 h-5 text-orange-400" /> Compress PDF</h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <div className="text-sm text-gray-400 mb-4">
                Note: This tool optimizes internal PDF structure. For scanned documents, visual quality remains unchanged.
            </div>
            <button onClick={compress} disabled={!file || processing} className="btn-primary full-width">
                {processing ? 'Compressing...' : 'Compress File'}
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. PDF TO IMAGES
function PDFToImages() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const convert = async () => {
        if (!file || !window.pdfjsLib) return;
        setProcessing(true);
        try {
            const uri = URL.createObjectURL(file);
            const pdf = await window.pdfjsLib.getDocument(uri).promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                canvas.toBlob((blob) => {
                    if (blob) download(blob, `page_${i}.png`);
                }, 'image/png');
            }
            URL.revokeObjectURL(uri);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><ImageIcon className="w-5 h-5 text-purple-400" /> PDF to Images</h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <div className="text-sm text-gray-400 mb-4">
                Converts all pages to high-quality PNG images.
            </div>
            <button onClick={convert} disabled={!file || processing} className="btn-primary full-width">
                {processing ? 'Converting...' : 'Convert to Images'}
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. EXTRACT TEXT
function PDFExtractText() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [textResult, setTextResult] = useState('');

    const extract = async () => {
        if (!file || !window.pdfjsLib) return;
        setProcessing(true);
        try {
            const uri = URL.createObjectURL(file);
            const pdf = await window.pdfjsLib.getDocument(uri).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const tokenizedText = await page.getTextContent();

                // Smart merging logic
                let pageText = '';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = tokenizedText.items as any[];

                if (items.length > 0) {
                    let lastY = -1;
                    let lastX = -1;
                    let lastW = 0;

                    for (const item of items) {
                        const str = item.str;
                        // transform: [scaleX, skewY, skewX, scaleY, x, y]
                        const tx = item.transform;
                        const x = tx[4];
                        const y = tx[5];
                        const w = item.width;
                        const h = Math.sqrt(tx[0] * tx[0] + tx[2] * tx[2]); // Approx font height

                        if (lastY === -1) {
                            pageText += str;
                        } else {
                            const dy = Math.abs(y - lastY);
                            // New line detection (if Y diff is big enough)
                            if (dy > h * 0.6) {
                                pageText += '\n' + str;
                            } else {
                                // Same line: check lateral gap for space
                                // Simple distance check (works for mixed LTR/RTL usually if stream is ordered)
                                // Gap = distance between end of last and start of current?
                                // OR just center-to-center?
                                // Let's try: if x has jumped significantly, add space.
                                // NOTE: In Arabic PDF, chars might be stored in reverse order or visual order.
                                // But usually, if they are "close", they belong to same word.

                                // Calculate gap assuming LTR flow: current X - (prev X + prev Width)
                                const gapLTR = Math.abs(x - (lastX + lastW));
                                // Calculate gap assuming RTL flow (prev is to the right): (prev X) - (current X + current Width)
                                const gapRTL = Math.abs(lastX - (x + w));

                                const minGap = Math.min(gapLTR, gapRTL);

                                // Threshold: 20% of height (arbitrary but better than 'always space')
                                if (minGap > h * 0.3 && str.trim() !== '') {
                                    pageText += ' ' + str;
                                } else {
                                    pageText += str;
                                }
                            }
                        }
                        lastX = x;
                        lastY = y;
                        lastW = w;
                    }
                }

                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
            }

            setTextResult(fullText);
            URL.revokeObjectURL(uri);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    const downloadText = () => {
        // Add Byte Order Mark (BOM) for UTF-8 so Windows (Notepad/Excel) recognizes Arabic correctly
        const blob = new Blob(['\uFEFF' + textResult], { type: 'text/plain;charset=utf-8' });
        download(blob, 'extracted_text.txt');
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><FileText className="w-5 h-5 text-yellow-400" /> Extract Text</h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={extract} disabled={!file || processing} className="btn-primary full-width mb-4">
                {processing ? 'Extracting...' : 'Extract Text'}
            </button>
            {textResult && (
                <div>
                    <textarea value={textResult} readOnly className="glass-input full-width h-32 mb-2" />
                    <button onClick={downloadText} className="btn-secondary full-width">Download .txt</button>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 6. PROTECT
function PDFProtector() {
    const [file, setFile] = useState<File | null>(null);
    const [pass, setPass] = useState('');
    const [processing, setProcessing] = useState(false);

    const protect = async () => {
        if (!file || !pass || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pdfBytes = await pdf.save({ userPassword: pass, ownerPassword: pass });
            download(pdfBytes, `protected_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Lock className="w-5 h-5 text-red-400" /> Protect PDF</h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="glass-input bg-dark full-width mb-4" placeholder="Enter Password" />
            <button onClick={protect} disabled={!file || !pass || processing} className="btn-primary full-width">
                Encrypt PDF
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 7. UNLOCK
function PDFUnlock() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const unlock = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            // Loading without password might fail if it's encrypted. 
            // pdf-lib's load doesn't always require password if we just want to save it?? 
            // Actually, if it's encrypted, we can't load it without password usually.
            // But if user has an openable PDF they want to remove pass from:
            // This is complex client-side. Let's assume standard encrypted PDF.
            // pdf-lib load() takes `password` option. If user doesn't provide it, we might prompt.
            // For now, let's just try loading. If it fails, ask for pass?
            // Simplified: Just "Remove Security" - often means "Resave without password".
            // If the browser can read it, we can save it.

            const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true }); // Attempt to load
            const pdfBytes = await pdf.save(); // Save without encryption
            download(pdfBytes, `unlocked_${file.name}`);
        } catch (e: unknown) {
            alert('Could not unlock. If the file has a password, this tool currently only removes owner restrictions or requires the password to open first.');
            console.error(e);
        }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Lock className="w-5 h-5 text-green-400" /> Unlock PDF</h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <button onClick={unlock} disabled={!file || processing} className="btn-primary full-width">
                Remove Password / Security
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 8. IMAGE TO PDF
function ImageToPDF() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [processing, setProcessing] = useState(false);

    const convert = async () => {
        if (!files || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const pdfDoc = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const arrayBuffer = await readFile(file);
                let image;
                if (file.type === 'image/jpeg') image = await pdfDoc.embedJpg(arrayBuffer);
                else if (file.type === 'image/png') image = await pdfDoc.embedPng(arrayBuffer);
                else continue;

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
            }

            const pdfBytes = await pdfDoc.save();
            download(pdfBytes, 'images.pdf');
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><FileUp className="w-5 h-5 text-pink-400" /> Images to PDF</h3>
            <input type="file" multiple accept="image/png, image/jpeg" onChange={e => setFiles(e.target.files)} className="glass-input full-width mb-4" />
            <button onClick={convert} disabled={!files || processing} className="btn-primary full-width">
                Convert to PDF
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 9. ROTATE & REORDER & REMOVE (Page Ops)
function PDFPageOps({ mode }: { mode: 'rotate' | 'remove' | 'reorder' | 'crop' | 'number' }) {
    const [file, setFile] = useState<File | null>(null);
    const [param, setParam] = useState('');
    const [processing, setProcessing] = useState(false);

    const run = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument, degrees, rgb } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            if (mode === 'rotate') {
                const angle = parseInt(param) || 90;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pdf.getPages().forEach((p: any) => {
                    p.setRotation(degrees(p.getRotation().angle + angle));
                });
            }
            else if (mode === 'remove') {
                // Must remove from end to start to avoid index shifting
                const toRemove = param.split(',').map(x => parseInt(x.trim()) - 1).filter(x => x >= 0 && x < total).sort((a, b) => b - a);
                toRemove.forEach(idx => pdf.removePage(idx));
            }
            else if (mode === 'reorder') {
                // param: "3, 1, 2"
                const order = param.split(',').map(x => parseInt(x.trim()) - 1).filter(x => x >= 0 && x < total);
                if (order.length > 0) {
                    const newPdf = await PDFDocument.create();
                    const copied = await newPdf.copyPages(pdf, order);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    copied.forEach((p: any) => newPdf.addPage(p));
                    const res = await newPdf.save();
                    download(res, `reordered_${file.name}`);
                    setProcessing(false);
                    return; // Return early since we created a new doc
                }
            }
            else if (mode === 'number') {
                const pages = pdf.getPages();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pages.forEach((page: any, idx: number) => {
                    const { width } = page.getSize();
                    page.drawText(`${idx + 1}`, {
                        x: width / 2,
                        y: 20,
                        size: 12,
                        color: rgb(0, 0, 0),
                    });
                });
            }
            else if (mode === 'crop') {
                // Simple crop: trim 50 units from all sides? or user input?
                // For simplicity, let's just do a fixed "Trim Margins" or parse param.
                // let's assume param is "50" => remove 50 from all sides.
                const margin = parseInt(param) || 20;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pdf.getPages().forEach((page: any) => {
                    const { width, height } = page.getSize();
                    page.setSize(width - margin * 2, height - margin * 2);
                    // This is naive, proper crop updates MediaBox. 
                    // pdf-lib setSize changes media box.
                    // We might need to translate content too if we want to center crop, but setSize usually crops from top/right depending on coordinates.
                    // Actually setSize changes the view.
                    // Let's just set the MediaBox explicitly if possible, or use setSize.
                    // Improving crop:
                    // page.setCropBox(x, y, width, height)
                    page.setCropBox(margin, margin, width - margin * 2, height - margin * 2);
                });
            }

            const pdfBytes = await pdf.save();
            download(pdfBytes, `${mode}_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                {mode === 'rotate' && <RefreshCw className="w-5 h-5 text-blue-400" />}
                {mode === 'remove' && <Trash2 className="w-5 h-5 text-red-400" />}
                {mode === 'reorder' && <ArrowUpDown className="w-5 h-5 text-yellow-400" />}
                {mode === 'number' && <FileText className="w-5 h-5 text-green-400" />}
                {mode === 'crop' && <Crop className="w-5 h-5 text-purple-400" />}
                {mode === 'rotate' && 'Rotate Pages'}
                {mode === 'remove' && 'Remove Pages'}
                {mode === 'reorder' && 'Reorder Pages'}
                {mode === 'number' && 'Add Page Numbers'}
                {mode === 'crop' && 'Crop Margins'}
            </h3>

            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />

            {mode === 'rotate' && (
                <select value={param} onChange={e => setParam(e.target.value)} className="glass-input full-width mb-4">
                    <option value="" disabled>Select Rotation</option>
                    <option value="90">90° Clockwise</option>
                    <option value="180">180°</option>
                    <option value="-90">90° Counter-Clockwise</option>
                </select>
            )}

            {mode === 'remove' && (
                <input value={param} onChange={e => setParam(e.target.value)} className="glass-input full-width mb-4" placeholder="Pages to remove (e.g. 1, 3, 5)" />
            )}

            {mode === 'reorder' && (
                <input value={param} onChange={e => setParam(e.target.value)} className="glass-input full-width mb-4" placeholder="New order (e.g. 3, 1, 2)" />
            )}

            {mode === 'crop' && (
                <input value={param} onChange={e => setParam(e.target.value)} className="glass-input full-width mb-4" placeholder="Margin to crop (e.g. 50)" />
            )}

            {/* 'number' needs no param for basic center-bottom */}

            <button onClick={run} disabled={!file || (process && mode !== 'number' && !param) || processing} className="btn-primary full-width">
                {processing ? 'Processing...' : 'Apply and Download'}
            </button>
        </div>
    );
}


// ----------------------------------------------------------------------
// 10. WATERMARK
function PDFWatermark() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('CONFIDENTIAL');
    const [processing, setProcessing] = useState(false);

    const apply = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument, rgb, degrees } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pages = pdf.getPages();

            pages.forEach((page: any) => {
                const { width, height } = page.getSize();
                page.drawText(text, {
                    x: width / 2 - (text.length * 15), // Rough center
                    y: height / 2,
                    size: 50,
                    color: rgb(0.7, 0.7, 0.7), // Light gray
                    opacity: 0.5,
                    rotate: degrees(45),
                });
            });

            const pdfBytes = await pdf.save();
            download(pdfBytes, `watermarked_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" /> Add Watermark
            </h3>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width mb-4" />
            <input value={text} onChange={e => setText(e.target.value)} className="glass-input full-width mb-4" placeholder="Watermark Text" />
            <button onClick={apply} disabled={!file || !text || processing} className="btn-primary full-width">
                {processing ? 'Applying...' : 'Apply Watermark'}
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN ROUTER
export default function PdfTools({ toolId }: ToolProps) {
    const [libLoaded, setLibLoaded] = useState(false);
    const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

    useEffect(() => {
        if (window.PDFLib) setLibLoaded(true);
        if (window.pdfjsLib) setPdfJsLoaded(true);
    }, []);

    return (
        <>
            <Script
                src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
                onLoad={() => setLibLoaded(true)}
            />
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
                onLoad={() => {
                    setPdfJsLoaded(true);
                    if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
                }}
            />

            {!libLoaded ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                    <p>Loading PDF Libraries...</p>
                </div>
            ) : (
                <div className="animate-fade-in">
                    {toolId === 'pdf-merge' && <PDFMerger />}
                    {toolId === 'pdf-split' && <PDFSplitter />}
                    {toolId === 'pdf-protect' && <PDFProtector />}
                    {toolId === 'pdf-unlock' && <PDFUnlock />}
                    {toolId === 'pdf-compress' && <PDFCompressor />}
                    {toolId === 'pdf-to-img' && (pdfJsLoaded ? <PDFToImages /> : <div className="text-center text-gray-400">Loading Text Engine...</div>)}
                    {toolId === 'img-to-pdf' && <ImageToPDF />}
                    {toolId === 'pdf-rotate' && <PDFPageOps mode="rotate" />}
                    {toolId === 'pdf-rem' && <PDFPageOps mode="remove" />}
                    {toolId === 'pdf-ord' && <PDFPageOps mode="reorder" />}
                    {toolId === 'pdf-crop' && <PDFPageOps mode="crop" />}
                    {toolId === 'pdf-page-num' && <PDFPageOps mode="number" />}
                    {toolId === 'pdf-watermark' && <PDFWatermark />}
                    {toolId === 'pdf-extract-text' && (pdfJsLoaded ? <PDFExtractText /> : <div className="text-center text-gray-400">Loading Text Engine...</div>)}
                    {toolId === 'pdf-extract-imgs' && (pdfJsLoaded ? <PDFToImages /> : <div className="text-center text-gray-400">Loading Text Engine...</div>)}

                    {!['pdf-merge', 'pdf-split', 'pdf-protect', 'pdf-unlock', 'pdf-compress', 'pdf-to-img', 'img-to-pdf', 'pdf-rotate', 'pdf-rem', 'pdf-ord', 'pdf-crop', 'pdf-page-num', 'pdf-watermark', 'pdf-extract-text', 'pdf-extract-imgs'].includes(toolId) && (
                        <div className="text-center py-12 text-gray-400">
                            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Tool Not Found</h3>
                            <p>We are working on {toolId}...</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
