"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';

// Declare globals for CDN loaded libraries
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PDFLib: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfjsLib: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfjsWorker: any;
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
// ----------------------------------------------------------------------
// 1. MERGE PDFs
function PDFMerger() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

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
            setLastFile('merged.pdf');
        } catch (e: unknown) {
            alert('Error: ' + (e as Error).message);
        }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Combine multiple PDF files into one document."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <span className="text-5xl">✅</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">Merged Successfully!</h3>
                    <p className="text-slate-400 mb-8 text-center">Your files have been combined into one document.</p>

                    <ToolButton variant="ghost" onClick={() => merge()} className="w-full mb-4">
                        Download Again
                    </ToolButton>
                    <ToolButton variant="secondary" onClick={() => { setLastFile(null); setFiles(null); }} className="w-full">
                        Merge New Files
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Choose Files">
                <ToolInput
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={e => setFiles(e.target.files)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF files to merge"
                />
            </ToolInputRow>

            {files && (
                <div className="mb-4 text-sm text-gray-400 font-medium px-1">
                    Selected {files.length} files
                </div>
            )}

            <ToolButton
                onClick={merge}
                disabled={!files || processing}
                className="w-full text-lg mt-4"
            >
                {processing ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                {processing ? 'Merging...' : 'Merge PDFs'}
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 2. SPLIT PDFs
function PDFSplitter() {
    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

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
            setLastFile(`split_${file.name}`);

        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Extract specific pages from your PDF."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                        <span className="text-5xl">✂️</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Splitting Complete!</h3>
                    <p className="text-slate-400 mb-8 text-center">Extracted pages are ready.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFile(null); }} className="w-full text-lg">
                        Process Another File
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file to split"
                />
            </ToolInputRow>

            <ToolInputRow label="Page Ranges (Optional)">
                <ToolInput
                    value={range}
                    onChange={e => setRange(e.target.value)}
                    placeholder="e.g. 1-3, 5"
                    aria-label="Page ranges"
                />
                <p className="text-xs text-brand-secondary/70 mt-2 font-medium">Leave empty to extract all pages.</p>
            </ToolInputRow>

            <ToolButton onClick={split} disabled={!file || processing} className="w-full text-lg mt-6">
                {processing ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                {processing ? 'Processing...' : 'Extract Pages'}
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 3. COMPRESS PDF
function PDFCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const compress = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdf, pdf.getPageIndices());
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            copiedPages.forEach((p: any) => newPdf.addPage(p));
            const pdfBytes = await newPdf.save({ useObjectStreams: false });
            download(pdfBytes, `compressed_${file.name}`);
            setLastFile(`compressed_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Optimize PDF file size."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                        <span className="text-5xl">🗜️</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Compression Done!</h3>
                    <p className="text-slate-400 mb-8 text-center">Your PDF has been optimized.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFile(null); }} className="w-full text-lg">
                        Compress Another
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file to compress"
                />
            </ToolInputRow>
            <p className="text-xs text-brand-secondary/70 mb-6 font-medium">Note: Optimizes internal structure. Scanned documents may not shrink significantly.</p>
            <ToolButton onClick={compress} disabled={!file || processing} className="w-full text-lg">
                {processing ? 'Compressing...' : 'Compress PDF'}
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 4. PDF TO IMAGES
function PDFToImages() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [count, setCount] = useState(0);

    const convert = async () => {
        if (!file || !window.pdfjsLib) return;
        setProcessing(true);
        setCount(0);
        try {
            const uri = URL.createObjectURL(file);
            const pdf = await window.pdfjsLib.getDocument(uri).promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;

                canvas.toBlob((blob) => {
                    if (blob) download(blob, `page_${i}.png`);
                }, 'image/png');
            }
            setCount(pdf.numPages);
            URL.revokeObjectURL(uri);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Convert PDF pages to high-quality PNG images."
            results={count > 0 && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,115,22,0.3)]">
                        <span className="text-5xl">🖼️</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">{count} Images</h3>
                    <p className="text-slate-400 mb-8 text-center">Converted successfully. Check your downloads.</p>
                    <ToolButton onClick={() => { setCount(0); setFile(null); }} className="w-full text-lg">
                        Convert More
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file to convert to images"
                />
            </ToolInputRow>
            <ToolButton onClick={convert} disabled={!file || processing} className="w-full text-lg mt-6">
                {processing ? 'Converting...' : 'Convert to Images'}
            </ToolButton>
        </ToolShell>
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
                let pageText = '';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = tokenizedText.items as any[];

                // ... (simplified text merge logic for brevity, relying on basic spacing)
                if (items.length > 0) {
                    for (const item of items) {
                        pageText += item.str + ' ';
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
        const blob = new Blob(['\uFEFF' + textResult], { type: 'text/plain;charset=utf-8' });
        download(blob, 'extracted_text.txt');
    };

    return (
        <ToolShell
            description="Extract raw text content from PDF."
            results={textResult && (
                <div className="h-full flex flex-col p-6 bg-white/5 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span>📝</span> Extracted Text
                    </h3>
                    <textarea
                        aria-label="Extracted Text Result"
                        value={textResult}
                        readOnly
                        className="w-full flex-1 mb-4 bg-black/20 border border-white/10 rounded-xl p-4 resize-none text-xs font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-wrap min-h-[300px]"
                    />
                    <ToolButton onClick={downloadText} className="w-full text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        Download .txt
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file to extract text from"
                />
            </ToolInputRow>

            <ToolButton onClick={extract} disabled={!file || processing} className="w-full text-lg mt-6">
                {processing ? 'Extracting...' : 'Extract Text'}
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 6. PROTECT
function PDFProtector() {
    const [file, setFile] = useState<File | null>(null);
    const [pass, setPass] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const protect = async () => {
        if (!file || !pass || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pdfBytes = await pdf.save({ userPassword: pass, ownerPassword: pass });
            download(pdfBytes, `protected_${file.name}`);
            setLastFile(`protected_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Encrypt PDF with a password."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-red-500/5 rounded-3xl border border-red-500/20">
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                        <span className="text-5xl">🔒</span>
                    </div>
                    <h3 className="text-2xl font-black text-red-500 mb-2">Encrypted!</h3>
                    <p className="text-slate-400 mb-8 text-center">Your file is now password protected.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFile(null); setPass(''); }} className="w-full text-lg bg-red-600 border-red-500 hover:bg-red-500">
                        Protect Another
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file to protect"
                />
            </ToolInputRow>
            <ToolInputRow label="Set Password">
                <ToolInput
                    type="password"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder="Enter secure password"
                    aria-label="Password for PDF"
                />
            </ToolInputRow>
            <ToolButton onClick={protect} disabled={!file || !pass || processing} className="w-full text-lg mt-6 bg-red-600 border-red-500 hover:bg-red-500 text-white">
                Encrypt PDF
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 7. UNLOCK
function PDFUnlock() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const unlock = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pdfBytes = await pdf.save();
            download(pdfBytes, `unlocked_${file.name}`);
            setLastFile(`unlocked_${file.name}`);
        } catch (e: unknown) {
            alert('Unlock failed. File may require password to open first.');
            console.error(e);
        }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Remove PDF security/password (if openable)."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-green-500/5 rounded-3xl border border-green-500/20">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <span className="text-5xl">🔓</span>
                    </div>
                    <h3 className="text-2xl font-black text-green-500 mb-2">Unlocked!</h3>
                    <p className="text-slate-400 mb-8 text-center">Protection removed successfully.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFile(null); }} className="w-full text-lg bg-green-600 border-green-500 hover:bg-green-500">
                        Unlock Another
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file to unlock"
                />
            </ToolInputRow>
            <ToolButton onClick={unlock} disabled={!file || processing} className="w-full text-lg mt-6 bg-green-600 border-green-500 hover:bg-green-500 text-white">
                Remove Security
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 8. IMAGE TO PDF
function ImageToPDF() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

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
            setLastFile('images.pdf');
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Combine images into a single PDF document."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                        <span className="text-5xl">📄</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">PDF Created!</h3>
                    <p className="text-slate-400 mb-8 text-center">Images successfully converted.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFiles(null); }} className="w-full text-lg">
                        Create New PDF
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Select Images">
                <ToolInput
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={e => setFiles(e.target.files)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select images to convert"
                />
            </ToolInputRow>
            <ToolButton onClick={convert} disabled={!files || processing} className="w-full text-lg mt-6">
                Convert to PDF
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 9. PAGE OPERATIONS (Rotate, Remove, Reorder, Crop, Number)
function PDFPageOps({ mode }: { mode: 'rotate' | 'remove' | 'reorder' | 'crop' | 'number' }) {
    const [file, setFile] = useState<File | null>(null);
    const [param, setParam] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

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
                (pdf.getPages() as any[]).forEach((p) => {
                    p.setRotation(degrees(p.getRotation().angle + angle));
                });
            }
            else if (mode === 'remove') {
                const toRemove = param.split(',').map(x => parseInt(x.trim()) - 1).filter(x => x >= 0 && x < total).sort((a, b) => b - a);
                toRemove.forEach(idx => pdf.removePage(idx));
            }
            else if (mode === 'reorder') {
                const order = param.split(',').map(x => parseInt(x.trim()) - 1).filter(x => x >= 0 && x < total);
                if (order.length > 0) {
                    const newPdf = await PDFDocument.create();
                    const copied = await newPdf.copyPages(pdf, order);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    copied.forEach((p: any) => newPdf.addPage(p));
                    const res = await newPdf.save();
                    download(res, `reordered_${file.name}`);
                    setProcessing(false);
                    setLastFile(`reordered_${file.name}`);
                    return;
                }
            }
            else if (mode === 'number') {
                const pages = pdf.getPages();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pages.forEach((page: any, idx: number) => {
                    const { width } = page.getSize();
                    page.drawText(`${idx + 1}`, { x: width / 2, y: 20, size: 12, color: rgb(0, 0, 0) });
                });
            }
            else if (mode === 'crop') {
                const margin = parseInt(param) || 20;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pdf.getPages().forEach((page: any) => {
                    const { width, height } = page.getSize();
                    page.setCropBox(margin, margin, width - margin * 2, height - margin * 2);
                });
            }

            const pdfBytes = await pdf.save();
            download(pdfBytes, `${mode}_${file.name}`);
            setLastFile(`${mode}_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    const labels: Record<string, string> = {
        rotate: 'Rotate Pages',
        remove: 'Remove Pages',
        reorder: 'Reorder Pages',
        number: 'Add Page Numbers',
        crop: 'Crop Pages'
    };

    return (
        <ToolShell
            description={labels[mode]}
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                        <span className="text-5xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Done!</h3>
                    <p className="text-slate-400 mb-8 text-center">{labels[mode]} completed.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFile(null); setParam(''); }} className="w-full text-lg">
                        Edit Another
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Upload PDF"
                />
            </ToolInputRow>

            {mode === 'rotate' && (
                <ToolInputRow label="Rotation" id="rotate-select">
                    <ToolSelect id="rotate-select" value={param} onChange={e => setParam(e.target.value)} aria-label="Rotation angle" title="زاوية الدوران (Rotation Angle)">
                        <option value="" disabled>Select Rotation</option>
                        <option value="90">90° Clockwise</option>
                        <option value="180">180°</option>
                        <option value="-90">90° Counter-Clockwise</option>
                    </ToolSelect>
                </ToolInputRow>
            )}

            {mode === 'remove' && (
                <ToolInputRow label="Pages to Remove">
                    <ToolInput value={param} onChange={e => setParam(e.target.value)} placeholder="e.g. 1, 3, 5" aria-label="Pages to remove" />
                </ToolInputRow>
            )}

            {mode === 'reorder' && (
                <ToolInputRow label="New Order">
                    <ToolInput value={param} onChange={e => setParam(e.target.value)} placeholder="e.g. 3, 1, 2" aria-label="New page order" />
                </ToolInputRow>
            )}

            {mode === 'crop' && (
                <ToolInputRow label="Crop Margin">
                    <ToolInput value={param} onChange={e => setParam(e.target.value)} placeholder="e.g. 50" aria-label="Crop margin" />
                </ToolInputRow>
            )}

            <ToolButton onClick={run} disabled={!file || (processing)} className="w-full text-lg mt-6">
                {processing ? 'Processing...' : 'Apply'}
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 10. WATERMARK
function PDFWatermark() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('CONFIDENTIAL');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const apply = async () => {
        if (!file || !window.PDFLib) return;
        setProcessing(true);
        try {
            const { PDFDocument, rgb, degrees } = window.PDFLib;
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pages = pdf.getPages();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pages as any[]).forEach((page) => {
                const { width, height } = page.getSize();
                page.drawText(text, {
                    x: width / 2 - (text.length * 15),
                    y: height / 2,
                    size: 50,
                    color: rgb(0.7, 0.7, 0.7),
                    opacity: 0.5,
                    rotate: degrees(45),
                });
            });

            const pdfBytes = await pdf.save();
            download(pdfBytes, `watermarked_${file.name}`);
            setLastFile(`watermarked_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="Overlay text watermark on all pages."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/20">
                    <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                        <span className="text-5xl">💧</span>
                    </div>
                    <h3 className="text-2xl font-black text-cyan-400 mb-2">Watermarked!</h3>
                    <p className="text-slate-400 mb-8 text-center">Document secured with watermark.</p>
                    <ToolButton onClick={() => { setLastFile(null); setFile(null); setText(''); }} className="w-full text-lg bg-cyan-600 border-cyan-500 hover:bg-cyan-500 text-white">
                        Add Another
                    </ToolButton>
                </div>
            )}
        >
            <ToolInputRow label="Upload PDF">
                <ToolInput
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="h-auto py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary/80"
                    aria-label="Select PDF file for watermark"
                />
            </ToolInputRow>
            <ToolInputRow label="Watermark Text">
                <ToolInput value={text} onChange={e => setText(e.target.value)} aria-label="Watermark text" />
            </ToolInputRow>
            <ToolButton onClick={apply} disabled={!file || !text || processing} className="w-full text-lg mt-6">
                Apply Watermark
            </ToolButton>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// MAIN ROUTER
export default function PdfTools({ toolId }: ToolProps) {
    const [libLoaded, setLibLoaded] = useState(false);
    const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

    useEffect(() => {
        let mounted = true;
        const checkLibs = () => {
            if (!mounted) return;
            if (window.PDFLib && !libLoaded) setLibLoaded(true);
            if (window.pdfjsLib && !pdfJsLoaded) setPdfJsLoaded(true);
        };
        const timer = setTimeout(checkLibs, 100);
        const interval = setInterval(checkLibs, 500);
        return () => {
            mounted = false;
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [libLoaded, pdfJsLoaded]);

    return (
        <>
            <Script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" strategy="lazyOnload" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="lazyOnload" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" strategy="lazyOnload" />

            {toolId === 'pdf-merge' && <PDFMerger />}
            {toolId === 'pdf-split' && <PDFSplitter />}
            {toolId === 'pdf-compress' && <PDFCompressor />}
            {toolId === 'pdf-to-img' && <PDFToImages />}
            {toolId === 'pdf-text' && <PDFExtractText />}
            {toolId === 'pdf-protect' && <PDFProtector />}
            {toolId === 'pdf-unlock' && <PDFUnlock />}
            {toolId === 'img-to-pdf' && <ImageToPDF />}
            {toolId === 'pdf-rotate' && <PDFPageOps mode="rotate" />}
            {toolId === 'pdf-remove' && <PDFPageOps mode="remove" />}
            {toolId === 'pdf-reorder' && <PDFPageOps mode="reorder" />}
            {toolId === 'pdf-number' && <PDFPageOps mode="number" />}
            {toolId === 'pdf-crop' && <PDFPageOps mode="crop" />}
            {toolId === 'pdf-watermark' && <PDFWatermark />}
        </>
    );
}
