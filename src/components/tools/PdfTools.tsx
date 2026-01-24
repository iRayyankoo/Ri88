"use client";
import React, { useState } from 'react';
import Script from 'next/script';

// We need to declare the global PDFLib object since we load it from CDN
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PDFLib: any;
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

const download = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
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
            <input type="file" multiple accept=".pdf" onChange={e => setFiles(e.target.files)} className="glass-input full-width" />
            <div style={{ fontSize: '0.9em', color: '#aaa', marginTop: '8px' }}>
                {files ? `${files.length} selected` : 'Select multiple PDFs'}
            </div>
            <button onClick={merge} disabled={!files || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                {processing ? 'Processing...' : 'Merge PDFs'}
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
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <div className="input-row" style={{ marginTop: '10px' }}>
                <label>Pages (e.g. 1-3, 5)</label>
                <input value={range} onChange={e => setRange(e.target.value)} className="glass-input bg-dark" placeholder="Leave empty for all" />
            </div>
            <button onClick={split} disabled={!file || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                {processing ? 'Processing...' : 'Split PDF'}
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. PROTECT (Encrypt)
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

            const pdfBytes = await pdf.save({
                userPassword: pass,
                ownerPassword: pass
            });
            download(pdfBytes, `protected_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <div className="input-row" style={{ marginTop: '10px' }}>
                <label>Password</label>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="glass-input bg-dark" />
            </div>
            <button onClick={protect} disabled={!file || !pass || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                Encrypt PDF
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. WATERMARK
function PDFWatermark() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('CONFIDENTIAL');
    const [processing, setProcessing] = useState(false);

    const run = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument, degrees } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pages = pdf.getPages();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pages.forEach((page: any) => {
                const { width, height } = page.getSize();
                page.drawText(text, {
                    x: width / 2 - (text.length * 6),
                    y: height / 2,
                    size: 50,
                    opacity: 0.3,
                    rotate: degrees(45)
                });
            });

            const pdfBytes = await pdf.save();
            download(pdfBytes, `watermarked_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    }

    return (
        <div className="tool-ui-group">
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <div className="input-row" style={{ marginTop: '10px' }}>
                <label>Watermark Text</label>
                <input value={text} onChange={e => setText(e.target.value)} className="glass-input bg-dark" />
            </div>
            <button onClick={run} disabled={!file || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                Add Watermark
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 5. IMAGES TO PDF
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
                if (file.type === 'image/jpeg') {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    // Try PNG fallback or skip
                    continue;
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            download(pdfBytes, 'images-converted.pdf');
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <div className="tool-ui-group">
            <input type="file" multiple accept="image/png, image/jpeg" onChange={e => setFiles(e.target.files)} className="glass-input full-width" />
            <div style={{ fontSize: '0.9em', color: '#aaa', marginTop: '8px' }}>
                {files ? `${files.length} selected` : 'Select JPG/PNG images'}
            </div>
            <button onClick={convert} disabled={!files || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                Convert to PDF
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 6. ROTATE PDF
function PDFRotate() {
    const [file, setFile] = useState<File | null>(null);
    const [rotation, setRotation] = useState(90);
    const [processing, setProcessing] = useState(false);

    const run = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument, degrees } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pages = pdf.getPages();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pages.forEach((page: any) => {
                const currentRotation = page.getRotation().angle;
                page.setRotation(degrees(currentRotation + rotation));
            });

            const pdfBytes = await pdf.save();
            download(pdfBytes, `rotated_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    }

    return (
        <div className="tool-ui-group">
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <div className="input-row" style={{ marginTop: '10px' }}>
                <label>Rotation Degrees</label>
                <select value={rotation} onChange={e => setRotation(parseInt(e.target.value))} className="glass-input">
                    <option value="90">90° Clockwise</option>
                    <option value="180">180°</option>
                    <option value="270">90° Counter-Clockwise</option>
                </select>
            </div>
            <button onClick={run} disabled={!file || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                Rotate All Pages
            </button>
        </div>
    );
}

// ----------------------------------------------------------------------
// 7. REMOVE PAGES
function PDFRemovePages() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesToRemove, setPagesToRemove] = useState('');
    const [processing, setProcessing] = useState(false);

    const run = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            // Parse pages to remove (1-indexed)
            const toRemove = new Set<number>();
            pagesToRemove.split(',').forEach(p => {
                const num = parseInt(p.trim());
                if (!isNaN(num) && num >= 1 && num <= total) {
                    toRemove.add(num - 1); // 0-indexed for API
                }
            });

            // Convert to sorted array descending to avoid index shifting issues when removing
            const sortedIndices = Array.from(toRemove).sort((a, b) => b - a);

            sortedIndices.forEach(idx => {
                pdf.removePage(idx);
            });

            const pdfBytes = await pdf.save();
            download(pdfBytes, `trimmed_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    }

    return (
        <div className="tool-ui-group">
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="glass-input full-width" />
            <div className="input-row" style={{ marginTop: '10px' }}>
                <label>Pages to Remove (e.g. 1, 3, 5)</label>
                <input value={pagesToRemove} onChange={e => setPagesToRemove(e.target.value)} className="glass-input bg-dark" placeholder="Page numbers..." />
            </div>
            <button onClick={run} disabled={!file || !pagesToRemove || processing} className="btn-primary full-width" style={{ marginTop: '16px' }}>
                Delete Pages
            </button>
        </div>
    );
}
export default function PdfTools({ toolId }: ToolProps) {
    const [libLoaded, setLibLoaded] = useState(false);

    return (
        <>
            <Script
                src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
                onLoad={() => setLibLoaded(true)}
            />

            {!libLoaded ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading PDF Library...</div>
            ) : (
                <>
                    {toolId === 'pdf-merge' && <PDFMerger />}
                    {toolId === 'pdf-split' && <PDFSplitter />}
                    {toolId === 'pdf-protect' && <PDFProtector />}
                    {toolId === 'pdf-watermark' && <PDFWatermark />}

                    {toolId === 'img-to-pdf' && <ImageToPDF />}
                    {toolId === 'pdf-rotate' && <PDFRotate />}
                    {toolId === 'pdf-rem' && <PDFRemovePages />}

                    {/* Fallback for others */}
                    {!['pdf-merge', 'pdf-split', 'pdf-protect', 'pdf-watermark', 'img-to-pdf', 'pdf-rotate', 'pdf-rem'].includes(toolId) && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <h3>Coming Soon</h3>
                            <p>This PDF tool ({toolId}) is being migrated.</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
