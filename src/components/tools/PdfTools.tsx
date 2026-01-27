"use client";
import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Loader2, Info } from 'lucide-react';
import { ToolShell, ToolInputRow } from './ToolShell';

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
        <ToolShell description="Combine multiple PDF files into one document.">
            <ToolInputRow label="Choose Files">
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={e => setFiles(e.target.files)}
                    className="ui-input"
                />
            </ToolInputRow>

            {files && (
                <div className="ui-mb-4 text-sm text-gray-400">
                    Selected {files.length} files
                </div>
            )}

            <button
                onClick={merge}
                disabled={!files || processing}
                className="ui-btn primary ui-w-full"
            >
                {processing ? <Loader2 className="animate-spin" size={16} /> : null}
                {processing ? 'Merging...' : 'Merge PDFs'}
            </button>
        </ToolShell>
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
        <ToolShell description="Extract specific pages from your PDF.">
            <ToolInputRow label="Upload PDF">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="ui-input"
                />
            </ToolInputRow>

            <ToolInputRow label="Page Ranges (Optional)">
                <input
                    value={range}
                    onChange={e => setRange(e.target.value)}
                    className="ui-input"
                    placeholder="e.g. 1-3, 5"
                />
                <p className="tool-desc" style={{ fontSize: '12px', marginTop: '6px' }}>Leave empty to extract all pages.</p>
            </ToolInputRow>

            <button onClick={split} disabled={!file || processing} className="ui-btn primary ui-w-full">
                {processing ? <Loader2 className="animate-spin" size={16} /> : null}
                {processing ? 'Processing...' : 'Extract Pages'}
            </button>
        </ToolShell>
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
            const pdf = await PDFDocument.load(bytes);
            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdf, pdf.getPageIndices());
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            copiedPages.forEach((p: any) => newPdf.addPage(p));
            const pdfBytes = await newPdf.save({ useObjectStreams: false });
            download(pdfBytes, `compressed_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell description="Optimize PDF file size.">
            <ToolInputRow label="Upload PDF">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="ui-input"
                />
            </ToolInputRow>
            <p className="tool-desc ui-mb-4" style={{ fontSize: '12px' }}>Note: Optimizes internal structure. Scanned documents may not shrink significantly.</p>
            <button onClick={compress} disabled={!file || processing} className="ui-btn primary ui-w-full">
                {processing ? 'Compressing...' : 'Compress PDF'}
            </button>
        </ToolShell>
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
            URL.revokeObjectURL(uri);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell description="Convert PDF pages to high-quality PNG images.">
            <ToolInputRow label="Upload PDF">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="ui-input"
                />
            </ToolInputRow>
            <button onClick={convert} disabled={!file || processing} className="ui-btn primary ui-w-full">
                {processing ? 'Converting...' : 'Convert to Images'}
            </button>
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
        <ToolShell description="Extract raw text content from PDF.">
            <ToolInputRow label="Upload PDF">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="ui-input"
                />
            </ToolInputRow>

            <button onClick={extract} disabled={!file || processing} className="ui-btn primary ui-w-full ui-mb-4">
                {processing ? 'Extracting...' : 'Extract Text'}
            </button>

            {textResult && (
                <div className="ui-output">
                    <textarea
                        value={textResult}
                        readOnly
                        className="ui-textarea ui-mb-4"
                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                    />
                    <button onClick={downloadText} className="ui-btn ghost ui-w-full">Download .txt</button>
                </div>
            )}
        </ToolShell>
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
        <ToolShell description="Encrypt PDF with a password.">
            <ToolInputRow label="Upload PDF">
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input" />
            </ToolInputRow>
            <ToolInputRow label="Set Password">
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="ui-input" placeholder="Enter secure password" />
            </ToolInputRow>
            <button onClick={protect} disabled={!file || !pass || processing} className="ui-btn primary ui-w-full">
                Encrypt PDF
            </button>
        </ToolShell>
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
            const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pdfBytes = await pdf.save();
            download(pdfBytes, `unlocked_${file.name}`);
        } catch (e: unknown) {
            alert('Unlock failed. File may require password to open first.');
            console.error(e);
        }
        setProcessing(false);
    };

    return (
        <ToolShell description="Remove PDF security/password (if openable).">
            <ToolInputRow label="Upload PDF">
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input" />
            </ToolInputRow>
            <button onClick={unlock} disabled={!file || processing} className="ui-btn primary ui-w-full">
                Remove Security
            </button>
        </ToolShell>
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
        <ToolShell description="Combine images into a single PDF document.">
            <ToolInputRow label="Select Images">
                <input type="file" multiple accept="image/png, image/jpeg" onChange={e => setFiles(e.target.files)} className="ui-input" />
            </ToolInputRow>
            <button onClick={convert} disabled={!files || processing} className="ui-btn primary ui-w-full">
                Convert to PDF
            </button>
        </ToolShell>
    );
}

// ----------------------------------------------------------------------
// 9. PAGE OPERATIONS (Rotate, Remove, Reorder, Crop, Number)
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
        <ToolShell description={labels[mode]}>
            <ToolInputRow label="Upload PDF">
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input" />
            </ToolInputRow>

            {mode === 'rotate' && (
                <ToolInputRow label="Rotation">
                    <select value={param} onChange={e => setParam(e.target.value)} className="ui-select">
                        <option value="" disabled>Select Rotation</option>
                        <option value="90">90° Clockwise</option>
                        <option value="180">180°</option>
                        <option value="-90">90° Counter-Clockwise</option>
                    </select>
                </ToolInputRow>
            )}

            {mode === 'remove' && (
                <ToolInputRow label="Pages to Remove">
                    <input value={param} onChange={e => setParam(e.target.value)} className="ui-input" placeholder="e.g. 1, 3, 5" />
                </ToolInputRow>
            )}

            {mode === 'reorder' && (
                <ToolInputRow label="New Order">
                    <input value={param} onChange={e => setParam(e.target.value)} className="ui-input" placeholder="e.g. 3, 1, 2" />
                </ToolInputRow>
            )}

            {mode === 'crop' && (
                <ToolInputRow label="Crop Margin">
                    <input value={param} onChange={e => setParam(e.target.value)} className="ui-input" placeholder="e.g. 50" />
                </ToolInputRow>
            )}

            <button onClick={run} disabled={!file || (processing)} className="ui-btn primary ui-w-full">
                {processing ? 'Processing...' : 'Apply'}
            </button>
        </ToolShell>
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
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell description="Overlay text watermark on all pages.">
            <ToolInputRow label="Upload PDF">
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="ui-input" />
            </ToolInputRow>
            <ToolInputRow label="Watermark Text">
                <input value={text} onChange={e => setText(e.target.value)} className="ui-input" />
            </ToolInputRow>
            <button onClick={apply} disabled={!file || !text || processing} className="ui-btn primary ui-w-full">
                Apply Watermark
            </button>
        </ToolShell>
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

                    {!['pdf-merge', 'pdf-split', 'pdf-protect', 'pdf-unlock', 'pdf-compress', 'pdf-to-img', 'img-to-pdf', 'pdf-rotate', 'pdf-rem', 'pdf-ord', 'pdf-crop', 'pdf-page-num', 'pdf-watermark', 'pdf-extract-text'].includes(toolId) && (
                        <div className="text-center py-12 text-gray-400">
                            <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Tool Not Found</h3>
                            <p>We are working on {toolId}...</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
