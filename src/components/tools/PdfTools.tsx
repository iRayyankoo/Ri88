"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolSelect } from './ToolUi';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { parsePageRange } from '@/lib/tools/pdf';
// @ts-ignore - pdfjs-dist type definitions
import * as pdfjsLibImport from 'pdfjs-dist';

// Handle default export if it exists
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfjsLib = (pdfjsLibImport as any).default || pdfjsLibImport;

// Polyfill for Promise.withResolvers (Required for pdfjs-dist v4+ but good to have)
if (typeof Promise.withResolvers === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Promise as any).withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}

// Configure PDF.js worker - Fixed Stable Version 3.11.174
if (typeof window !== 'undefined' && 'Worker' in window) {
    try {
        console.log('Configuring PDF.js Worker...', pdfjsLib.version);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (pdfjsLib.GlobalWorkerOptions) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        }
    } catch (error) {
        console.error('Error configuring PDF.js worker:', error);
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
// 1. MERGE PDFS
function PDFMerger() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);
    const [useServer, setUseServer] = useState(false);

    const merge = async () => {
        if (!files) return;
        setProcessing(true);

        try {
            if (useServer) {
                // Server-Side Processing
                const formData = new FormData();
                formData.append('action', 'merge');
                Array.from(files).forEach(f => formData.append('files', f));

                const res = await fetch('/api/pdf/process', { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Server processing failed');

                const blob = await res.blob();
                download(blob, 'merged_server.pdf');
                setLastFile('merged_server.pdf');
            } else {
                // Client-Side Processing (Original)
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
            }
        } catch (e: unknown) {
            alert('Error: ' + (e as Error).message);
        }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="دمج ملفات PDF متعددة في مستند واحد بلمسة واحدة."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl animate-pulse" />
                        <CheckCircle2 size={56} className="text-emerald-400 relative z-10" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم الدمج بنجاح!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">{useServer ? 'تمت المعالجة عبر الخادم السحابي' : 'تمت المعالجة محلياً'}</p>

                    <div className="w-full space-y-4">
                        <ToolButton variant="iridescent" size="lg" onClick={() => merge()} className="w-full h-16 text-lg">تحميل الملف المدمج</ToolButton>
                        <ToolButton variant="ghost" size="lg" onClick={() => { setLastFile(null); setFiles(null); }} className="w-full opacity-60 hover:opacity-100 font-black font-cairo">دمج ملفات جديدة</ToolButton>
                    </div>
                </div>
            )}
        >
            <div className="space-y-10 py-4">
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-brand-primary/20 transition-all cursor-pointer" onClick={() => setUseServer(!useServer)}>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${useServer ? 'bg-brand-primary border-brand-primary' : 'border-white/20'}`}>
                        {useServer && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-black text-white font-cairo uppercase tracking-widest leading-none mb-1">المعالجة السحابية</div>
                        <div className="text-xs text-slate-500 font-medium">أفضل للملفات الضخمة والمعقدة</div>
                    </div>
                </div>

                <ToolInputRow label="اختر الملفات">
                    <ToolInput type="file" multiple accept=".pdf" onChange={e => setFiles(e.target.files)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" />
                </ToolInputRow>

                {files && (
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-brand-primary/5 border border-brand-primary/20 animate-in slide-in-from-left duration-300">
                        <FileText size={24} className="text-brand-primary" />
                        <div className="text-sm font-black text-white font-cairo">تم اختيار {files.length} ملفات جاهزة للدمج</div>
                    </div>
                )}

                <ToolButton variant="primary" size="xl" onClick={merge} disabled={!files || processing} className="w-full text-2xl h-24 group/merge">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري الدمج...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            دمج ملفات PDF
                            <Sparkles size={24} className="group-hover/merge:rotate-12 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 2. SPLIT PDFS
function PDFSplitter() {
    const [file, setFile] = useState<File | null>(null);
    const [range, setRange] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const split = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);

            // Use extracted pure logic
            const indices = parsePageRange(range, pdf.getPageCount());

            const newPdf = await PDFDocument.create();
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
            description="فصل الصفحات بدقة واستخراج المحتوى المطلوب فوراً."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-blue-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_20px_50px_rgba(59,130,246,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">✂️</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم الفصل بنجاح!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تم استخراج الصفحات المحددة بدقة كاملة</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFile(null); }} className="w-full h-20 text-xl font-black font-cairo">معالجة ملف جديد</ToolButton>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                <ToolInputRow label="رفع المستند">
                    <ToolInput
                        type="file"
                        accept=".pdf"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest"
                        aria-label="Upload PDF file"
                    />
                </ToolInputRow>

                <ToolInputRow label="نطاق الصفحات (اختياري)">
                    <ToolInput
                        type="text"
                        value={range}
                        onChange={e => setRange(e.target.value)}
                        placeholder="مثال: 1-3, 5"
                        className="h-16 text-xl tracking-widest placeholder:tracking-normal font-mono"
                        aria-label="Page range to split"
                    />
                    <p className="text-[10px] text-brand-secondary/70 mt-4 font-black uppercase tracking-widest font-cairo">اترك الحقل فارغاً لاستخراج كافة الصفحات بشكل منفرد.</p>
                </ToolInputRow>

                <ToolButton variant="primary" size="xl" onClick={split} disabled={!file || processing} className="w-full text-2xl h-24 group/split">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري الفصل...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            فصل الصفحات المختارة
                            <Sparkles size={24} className="group-hover/split:translate-x-1 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 3. COMPRESS PDF
function PDFCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const compress = async () => {
        if (!file) return;
        setProcessing(true);
        try {
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
            description="تحسين وبناء هيكل ملفات PDF لضمان أقل حجم ممكن مع الحفاظ على الجودة."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-purple-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-purple-500/20 shadow-[0_20px_50px_rgba(168,85,247,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-purple-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">📉</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">اكتمل الضغط!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تم تحسين الروابط والهياكل الداخلية للملف</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFile(null); }} className="w-full h-20 text-xl font-black font-cairo">ضغط ملف آخر</ToolButton>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                <ToolInputRow label="رفع ملف PDF للضغط">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Upload PDF for compression" />
                </ToolInputRow>

                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                    <p className="text-xs text-slate-500 font-bold font-cairo uppercase tracking-widest leading-loose">ملاحظة: يقوم هذا الإجراء بتحسين الهياكل والروابط الداخلية. قد لا يقل حجم الملفات الممسوحة ضوئياً بشكل ملحوظ.</p>
                </div>

                <ToolButton variant="primary" size="xl" onClick={compress} disabled={!file || processing} className="w-full text-2xl h-24 group/compress">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري الضغط...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            تقليل حجم الملف
                            <Sparkles size={24} className="group-hover/compress:scale-110 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 4. PDF TO IMAGES
function PDFToImages() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [count, setCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Added errorMessage state

    const convert = async () => {
        setErrorMessage(null); // Reset error message on new attempt
        if (!file) return;
        if (!pdfjsLib) {
            const msg = 'خطأ: مكتبة PDF.js غير محملة. يرجى تحديث الصفحة.';
            setErrorMessage(msg); // Set error message
            alert(msg);
            return;
        }

        console.log('Starting Image Conversion...', file.name);
        setProcessing(true);
        setCount(0);
        try {
            const uri = URL.createObjectURL(file);
            console.log('Loading Document:', uri);
            const pdf = await pdfjsLib.getDocument(uri).promise;
            console.log('Document Loaded. Pages:', pdf.numPages);
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                canvas.toBlob((blob) => { if (blob) download(blob, `page_${i}.png`); }, 'image/png');
            }
            setCount(pdf.numPages);
            URL.revokeObjectURL(uri);
        } catch (e: unknown) {
            const msg = 'Error: ' + (e as Error).message;
            setErrorMessage(msg); // Set error message
            alert(msg);
        }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="تحويل كل صفحة في مستند PDF إلى صورة عالية الدقة بصيغة PNG."
            results={count > 0 && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-orange-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-orange-500/20 shadow-[0_20px_50px_rgba(249,115,22,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-orange-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">🖼️</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم استخراج {count} صور!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تم تحويل كافة صفحات المستند بنجاح</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setCount(0); setFile(null); }} className="w-full h-20 text-xl font-black font-cairo">تحويل ملف آخر</ToolButton>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                {errorMessage && ( // Display error message
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium">
                        {errorMessage}
                    </div>
                )}
                <ToolInputRow label="رفع ملف PDF">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Upload PDF for image conversion" />
                </ToolInputRow>

                <ToolButton variant="primary" size="xl" onClick={convert} disabled={!file || processing} className="w-full text-2xl h-24 group/convert">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري التحويل...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            تحويل لصور PNG
                            <Sparkles size={24} className="group-hover/convert:rotate-45 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 5. EXTRACT TEXT
function PDFExtractText() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [textResult, setTextResult] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [extractMode, setExtractMode] = useState<'all' | 'page'>('all');
    const [targetPage, setTargetPage] = useState<string>('1');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Manage Preview URL
    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setFileUrl(null);
        }
    }, [file]);

    const extract = async () => {
        setErrorMessage(null);
        if (!file) return;
        if (!pdfjsLib) {
            const msg = 'خطأ: مكتبة PDF.js غير محملة.';
            setErrorMessage(msg);
            alert(msg);
            return;
        }

        const pageNum = parseInt(targetPage);
        if (extractMode === 'page' && (isNaN(pageNum) || pageNum < 1)) {
            alert('يرجى إدخال رقم صفحة صحيح.');
            return;
        }

        console.log('Starting Text Extraction...', file.name);
        setProcessing(true);
        try {
            const resultFileUrl = fileUrl || URL.createObjectURL(file); // Use existing or create new
            console.log('Loading Document with CMaps:', resultFileUrl);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const loadingTask = pdfjsLib.getDocument({
                url: resultFileUrl,
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
                cMapPacked: true,
                enableXfa: true,
            });

            const pdf = await loadingTask.promise;
            console.log('Document Loaded. Pages:', pdf.numPages);

            if (extractMode === 'page' && pageNum > pdf.numPages) {
                throw new Error(`رقم الصفحة غير موجود. المستند يحتوي على ${pdf.numPages} صفحات فقط.`);
            }

            let fullText = '';
            let extractedCharCount = 0;

            const startPage = extractMode === 'all' ? 1 : pageNum;
            const endPage = extractMode === 'all' ? pdf.numPages : pageNum;

            for (let i = startPage; i <= endPage; i++) {
                const page = await pdf.getPage(i);
                // disableFontFace helps avoid errors with weird embedded fonts
                const tokenizedText = await page.getTextContent({ disableFontFace: true });
                let pageText = '';

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = tokenizedText.items as any[];

                if (items.length > 0) {
                    for (const item of items) {
                        const str = item.str.trim();
                        if (str.length > 0) {
                            pageText += item.str + (item.hasEOL ? '\n' : ' ');
                            extractedCharCount += str.length;
                        }
                    }
                }

                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
            }

            console.log('Total extracted characters:', extractedCharCount);

            if (extractedCharCount < 20) {
                const confirmDownload = window.confirm(
                    'تنبيه: النصوص المستخرجة قليلة جداً.\n\n' +
                    'السبب الغالب: الملف (أو الصفحة المحددة) عبارة عن "صور ممسوحة ضوئياً" ولا يحتوي على نصوص قابلة للنسخ.\n\n' +
                    'هل تريد تحميل الملف الفارغ؟'
                );

                if (!confirmDownload) {
                    setProcessing(false);
                    return;
                }
            }

            setTextResult(fullText);

            // Auto-download directly
            const blob = new Blob(['\uFEFF' + fullText], { type: 'text/plain;charset=utf-8' });
            const filenameSuffix = extractMode === 'page' ? `_page${pageNum}` : '';
            download(blob, `extracted_text_${file.name.replace('.pdf', '')}${filenameSuffix}.txt`);

            // Note: We don't revoke URL here immediately if it's the state one, useEffect handles it.
        } catch (e: unknown) {
            console.error('PDF Extraction Error:', e);
            const msg = 'فشل استخراج النص: ' + (e instanceof Error ? e.message : String(e));
            setErrorMessage(msg);
            alert(msg);
        }
        setProcessing(false);
    };

    const downloadText = () => {
        if (!textResult) return;
        const blob = new Blob(['\uFEFF' + textResult], { type: 'text/plain;charset=utf-8' });
        download(blob, `extracted_text.txt`);
    };

    return (
        <ToolShell
            description="استخراج النصوص الخام من مستندات PDF بدقة عالية."
            layout="single"
            results={textResult && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500 w-full max-w-4xl mx-auto">
                    <div className="w-28 h-28 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">📄</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم استخراج النص!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">بدأ التحميل التلقائي لملف النصوص.</p>

                    <div className="flex gap-4 w-full max-w-md">
                        <ToolButton variant="iridescent" size="xl" onClick={downloadText} className="flex-1 h-20 text-lg font-black font-cairo">
                            <span className="ml-2">📥</span> تحميل مجدداً
                        </ToolButton>
                        <ToolButton variant="secondary" size="xl" onClick={() => { setTextResult(''); setFile(null); }} className="flex-1 h-20 text-lg font-black font-cairo border-white/10 hover:bg-white/5">
                            ملف آخر
                        </ToolButton>
                    </div>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                <ToolInputRow label="رفع المستند لتحليل النصوص">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Upload PDF for text extraction" />
                </ToolInputRow>

                {file && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">

                        {/* 1. Controls & Actions (Top Priority) */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full space-y-2">
                                <label className="text-slate-300 font-bold font-cairo text-sm">نطاق الاستخراج</label>
                                <div className="flex gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
                                    <button
                                        onClick={() => setExtractMode('all')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${extractMode === 'all' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        كامل الملف
                                    </button>
                                    <button
                                        onClick={() => setExtractMode('page')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${extractMode === 'page' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        صفحة محددة
                                    </button>
                                </div>
                            </div>

                            {extractMode === 'page' && (
                                <div className="w-full md:w-32 space-y-2 animate-in fade-in zoom-in duration-300">
                                    <label className="text-slate-300 font-bold font-cairo text-sm">رقم الصفحة</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={targetPage}
                                        onChange={(e) => setTargetPage(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white font-mono text-center focus:border-brand-primary outline-none transition-colors"
                                        title="رقم الصفحة المراد استخراجها"
                                        aria-label="رقم الصفحة"
                                        placeholder="1"
                                    />
                                </div>
                            )}

                            <ToolButton variant="primary" size="lg" onClick={extract} disabled={!file || processing} className="w-full md:w-auto h-[74px] px-8 text-lg shrink-0" aria-label="Extract text from PDF">
                                {processing ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="animate-spin" size={20} />
                                        جاري المعالجة...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        استخراج
                                        <Sparkles size={18} className="group-hover/extract:translate-y-[-2px] transition-transform" />
                                    </div>
                                )}
                            </ToolButton>
                        </div>

                        {/* 2. Toggle Preview Button */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="w-full py-4 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors border-t border-b border-white/5"
                        >
                            <span className="text-sm font-bold">{showPreview ? 'إخفاء معاينة الملف' : 'عرض معاينة الملف'}</span>
                            {showPreview ? <div className="rotate-180 transition-transform">▲</div> : <div className="transition-transform">▼</div>}
                        </button>

                        {/* 3. PDF Preview Area (Collapsible) */}
                        {showPreview && fileUrl && (
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl h-[600px] w-full relative group animate-in slide-in-from-top-4 duration-500">
                                <embed
                                    src={`${fileUrl}#toolbar=0&navpanes=0`}
                                    type="application/pdf"
                                    className="w-full h-full"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolShell>
    );
}

// 6. PROTECT
function PDFProtector() {
    const [file, setFile] = useState<File | null>(null);
    const [pass, setPass] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const protect = async () => {
        if (!file || !pass) return;
        setProcessing(true);
        try {
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (pdf as any).encrypt({ userPassword: pass, ownerPassword: pass });
            const pdfBytes = await pdf.save();
            download(pdfBytes, `protected_${file.name}`);
            setLastFile(`protected_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="تشفير ملفات PDF بكلمات مرور قوية لضمان الخصوصية والأمان المطلق."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-red-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_20px_50px_rgba(239,68,68,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-red-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">🔒</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم التشفير!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">المستند الآن محمي بكلمة مرور عسكرية</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFile(null); setPass(''); }} className="w-full h-20 text-xl font-black font-cairo">حماية ملف آخر</ToolButton>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                <ToolInputRow label="المستند المراد حمايته">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Upload PDF to protect" />
                </ToolInputRow>

                <ToolInputRow label="تعيين كلمة المرور">
                    <ToolInput type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••••••" className="h-16 text-xl tracking-[0.3em] placeholder:tracking-normal font-mono" aria-label="Password for PDF protection" />
                </ToolInputRow>

                <ToolButton variant="primary" size="xl" onClick={protect} disabled={!file || !pass || processing} className="w-full text-2xl h-24 bg-red-600 border-red-500 hover:bg-red-500 group/protect">
                    {processing ? (
                        <div className="flex items-center gap-4 text-white">
                            <Loader2 className="animate-spin" size={28} />
                            جاري التشفير...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 text-white">
                            تشفير المستند الآن
                            <Sparkles size={24} className="group-hover/protect:rotate-12 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 7. UNLOCK (Client only try)
function PDFUnlock() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const unlock = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
            const pdfBytes = await pdf.save();
            download(pdfBytes, `unlocked_${file.name}`);
            setLastFile(`unlocked_${file.name}`);
        } catch (e: unknown) { alert('Unlock failed.'); console.error(e); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="إزالة قيود التشفير وكلمات المرور من ملفات PDF المفتوحة."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">🔓</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم فك القفل!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تمت إزالة قيود الأمان من الملف بنجاح</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFile(null); }} className="w-full h-20 text-xl font-black font-cairo">معالجة ملف آخر</ToolButton>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                <ToolInputRow label="رفع الملف المشفر">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Upload locked PDF" />
                </ToolInputRow>

                <ToolButton variant="primary" size="xl" onClick={unlock} disabled={!file || processing} className="w-full text-2xl h-24 group/unlock">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري الإزالة...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            إيقاف نظام الحماية
                            <Sparkles size={24} className="group-hover/unlock:scale-110 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 8. IMAGE TO PDF
function ImageToPDF() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const convert = async () => {
        if (!files) return;

        setProcessing(true);
        // setCount(0); // This line was commented out in the original, keeping it that way.
        try {
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
            description="تحويل مجموعة صور إلى مستند PDF احترافي ومنسق."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-brand-primary/10 rounded-[40px] flex items-center justify-center mb-8 border border-brand-primary/20 shadow-[0_20px_50px_rgba(139,92,246,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-brand-primary/5 blur-3xl animate-pulse" />
                        <FileText size={56} className="text-brand-primary relative z-10" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">تم إنشاء الـ PDF!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تم دمج كافة الصور في ملف واحد بجودة أصلية</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFiles(null); }} className="w-full h-20 text-xl font-black font-cairo">بدء عملية جديدة</ToolButton>
                </div>
            )}
        >
            <div className="space-y-12 py-4">
                <ToolInputRow label="اختيار الصور">
                    <ToolInput type="file" multiple accept="image/png, image/jpeg" onChange={e => setFiles(e.target.files)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Select images for PDF" />
                </ToolInputRow>

                {files && (
                    <div className="flex flex-wrap gap-3">
                        {Array.from(files).map((f, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 font-cairo uppercase tracking-widest"
                            >
                                {f.name}
                            </motion.div>
                        ))}
                    </div>
                )}

                <ToolButton variant="primary" size="xl" onClick={convert} disabled={!files || processing} className="w-full text-2xl h-24 group/imgtopdf">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري التحويل...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            إنشاء ملف PDF
                            <Sparkles size={24} className="group-hover/imgtopdf:rotate-[-12deg] transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 9. PAGE OPS
function PDFPageOps({ mode }: { mode: 'rotate' | 'remove' | 'reorder' | 'crop' | 'number' }) {
    const [file, setFile] = useState<File | null>(null);
    const [param, setParam] = useState('');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const run = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const total = pdf.getPageCount();

            if (mode === 'rotate') {
                const angle = parseInt(param) || 90;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (pdf.getPages() as any[]).forEach((p: any) => { p.setRotation(degrees(p.getRotation().angle + angle)); });
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
                    setProcessing(false); setLastFile(`reordered_${file.name}`); return;
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

    return (
        <ToolShell
            description={`تنفيذ عمليات متقدمة (${mode === 'rotate' ? 'تدوير' : mode === 'remove' ? 'حذف' : mode === 'reorder' ? 'ترتيب' : mode === 'crop' ? 'قص' : 'ترقيم'}) على صفحات المستند.`}
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-brand-secondary/10 rounded-[40px] flex items-center justify-center mb-8 border border-brand-secondary/20 shadow-[0_20px_50px_rgba(236,72,153,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-brand-secondary/5 blur-3xl animate-pulse" />
                        <CheckCircle2 size={56} className="text-brand-secondary relative z-10" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-3 font-cairo tracking-tight">اكتملت العملية!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تم تطبيق التعديلات المطلوبة على كافة الصفحات</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFile(null); setParam(''); }} className="w-full h-20 text-xl font-black font-cairo">تعديل ملف آخر</ToolButton>
                </div>
            )}
        >
            <div className="space-y-10 py-4">
                <ToolInputRow label="رفع مستند PDF">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" aria-label="Upload PDF for operations" />
                </ToolInputRow>

                {mode === 'rotate' && (
                    <ToolInputRow label="زاوية الدوران">
                        <ToolSelect value={param} onChange={e => setParam(e.target.value)} className="h-16" aria-label="Rotation angle" title="زاوية الدوران">
                            <option value="90">90° مع عقارب الساعة</option>
                            <option value="180">180° قلب كامل</option>
                            <option value="-90">90° عكس عقارب الساعة</option>
                        </ToolSelect>
                    </ToolInputRow>
                )}

                {mode !== 'rotate' && mode !== 'number' && (
                    <ToolInputRow label="المعايير">
                        <ToolInput value={param} onChange={e => setParam(e.target.value)} placeholder={mode === 'crop' ? "أدخل الهامش (مثل: 20)" : "مثال: 1, 3, 5-7"} className="h-16 text-xl" aria-label="Operation parameters" />
                    </ToolInputRow>
                )}

                <ToolButton variant="primary" size="xl" onClick={run} disabled={!file || processing} className="w-full text-2xl h-24 group/ops" aria-label="Apply PDF operation">
                    {processing ? (
                        <div className="flex items-center gap-4">
                            <Loader2 className="animate-spin" size={28} />
                            جاري التنفيذ...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            تطبيق التعديلات
                            <Sparkles size={24} className="group-hover/ops:rotate-90 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 10. Watermark
function PDFWatermark() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('CONFIDENTIAL');
    const [processing, setProcessing] = useState(false);
    const [lastFile, setLastFile] = useState<string | null>(null);

    const apply = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            const bytes = await readFile(file);
            const pdf = await PDFDocument.load(bytes);
            const pages = pdf.getPages();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pages as any[]).forEach((page) => {
                const { width, height } = page.getSize();
                page.drawText(text, { x: width / 2 - (text.length * 15), y: height / 2, size: 50, color: rgb(0.7, 0.7, 0.7), opacity: 0.5, rotate: degrees(45) });
            });
            const pdfBytes = await pdf.save();
            download(pdfBytes, `watermarked_${file.name}`);
            setLastFile(`watermarked_${file.name}`);
        } catch (e: unknown) { alert('Error: ' + (e as Error).message); }
        setProcessing(false);
    };

    return (
        <ToolShell
            description="إضافة بصمة أو علامة مائية نصية مخصصة لحماية ملكية المستند."
            results={lastFile && (
                <div className="h-full flex flex-col justify-center items-center p-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-28 h-28 bg-cyan-500/10 rounded-[40px] flex items-center justify-center mb-8 border border-cyan-500/20 shadow-[0_20px_50px_rgba(6,182,212,0.2)] relative group/success isolate">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl animate-pulse" />
                        <span className="text-5xl relative z-10">💧</span>
                    </div>
                    <h3 className="text-4xl font-black text-cyan-400 mb-3 font-cairo tracking-tight">تم الختم بنجاح!</h3>
                    <p className="text-slate-400 mb-10 font-medium font-cairo">تم دمج العلامة المائية في كافة الصفحات</p>
                    <ToolButton variant="iridescent" size="xl" onClick={() => { setLastFile(null); setFile(null); setText('CONFIDENTIAL'); }} className="w-full h-20 text-xl font-black font-cairo">إضافة لملف آخر</ToolButton>
                </div>
            )}
        >
            <div className="space-y-10 py-4">
                <ToolInputRow label="رفع المستند">
                    <ToolInput type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="h-auto py-5 file:bg-brand-primary file:text-white file:rounded-2xl file:px-6 file:py-2 file:mr-4 file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest" />
                </ToolInputRow>

                <ToolInputRow label="نص العلامة المائية">
                    <ToolInput value={text} onChange={e => setText(e.target.value)} placeholder="مثال: سري للغاية" className="h-16 text-xl tracking-widest" />
                </ToolInputRow>

                <ToolButton variant="primary" size="xl" onClick={apply} disabled={!file || processing} className="w-full text-2xl h-24 bg-cyan-600 border-cyan-500 hover:bg-cyan-500 group/watermark">
                    {processing ? (
                        <div className="flex items-center gap-4 text-white">
                            <Loader2 className="animate-spin" size={28} />
                            جاري الختم...
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 text-white">
                            بصمة المستند
                            <Sparkles size={24} className="group-hover/watermark:scale-125 transition-transform" />
                        </div>
                    )}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

export default function PdfTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'pdf-merge': return <PDFMerger />;
        case 'pdf-split': return <PDFSplitter />;
        case 'pdf-compress': return <PDFCompressor />;
        case 'pdf-to-img': return <PDFToImages />;
        case 'pdf-extract-text': return <PDFExtractText />;
        case 'pdf-protect': return <PDFProtector />;
        case 'pdf-unlock': return <PDFUnlock />;
        case 'img-to-pdf': return <ImageToPDF />;
        case 'pdf-rotate': return <PDFPageOps mode="rotate" />;
        case 'pdf-rem': return <PDFPageOps mode="remove" />;
        case 'pdf-ord': return <PDFPageOps mode="reorder" />;
        case 'pdf-crop': return <PDFPageOps mode="crop" />;
        case 'pdf-page-num': return <PDFPageOps mode="number" />;
        case 'pdf-watermark': return <PDFWatermark />;
        case 'pdf-extract-imgs': return <div className="text-center py-12">Extract Images is coming soon</div>; // Placeholder
        default: return <div className="text-center py-12">Tool not implemented: {toolId}</div>
    }
}
