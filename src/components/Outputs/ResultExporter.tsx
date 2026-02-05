"use client";
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { FileDown, Table, Copy, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultExporterProps {
    data: any; // Can be an object, array of objects, or string
    fileName?: string;
    title?: string;
    type?: 'table' | 'text' | 'image';
}

export const ResultExporter: React.FC<ResultExporterProps> = ({
    data,
    fileName = 'ri88-export',
    title = 'نتيجة التقرير',
    type = 'text'
}) => {
    const [copied, setCopied] = useState(false);

    // 1. Export to PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setLanguage('ar'); // Basic support placeholder
        doc.setFontSize(18);
        doc.text(title, 20, 20);

        doc.setFontSize(12);
        if (typeof data === 'string') {
            doc.text(data, 20, 30, { maxWidth: 170 });
        } else {
            doc.text(JSON.stringify(data, null, 2), 20, 30);
        }

        doc.save(`${fileName}.pdf`);
    };

    // 2. Export to Excel
    const exportExcel = () => {
        const wb = XLSX.utils.book_new();
        let ws;

        if (Array.isArray(data)) {
            ws = XLSX.utils.json_to_sheet(data);
        } else if (typeof data === 'object') {
            ws = XLSX.utils.json_to_sheet([data]);
        } else {
            ws = XLSX.utils.aoa_to_sheet([[data]]);
        }

        XLSX.utils.book_append_sheet(wb, ws, "Results");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    // 3. Copy to Clipboard
    const copyToClipboard = () => {
        const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 4. Share (Mobile)
    const shareResult = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: typeof data === 'string' ? data : JSON.stringify(data),
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            alert('Sharing is not supported on this browser');
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6" dir="rtl">
            <h3 className="text-sm font-bold text-slate-400 mb-4 px-2">تصدير النتائج</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['table', 'text'].includes(type) && (
                    <>
                        <button
                            onClick={exportPDF}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all group"
                        >
                            <FileDown className="w-6 h-6 mb-1" />
                            <span className="text-xs font-bold">PDF حفظ</span>
                        </button>

                        <button
                            onClick={exportExcel}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all group"
                        >
                            <Table className="w-6 h-6 mb-1" />
                            <span className="text-xs font-bold">Excel جدول</span>
                        </button>
                    </>
                )}

                <button
                    onClick={copyToClipboard}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary border border-white/5 hover:border-brand-primary/30 transition-all group relative"
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            >
                                <Check className="w-6 h-6 mb-1" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            >
                                <Copy className="w-6 h-6 mb-1" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className="text-xs font-bold">{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                </button>

                <button
                    onClick={shareResult}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 border border-white/5 hover:border-blue-500/30 transition-all group"
                >
                    <Share2 className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">مشاركة</span>
                </button>
            </div>
        </div>
    );
};
