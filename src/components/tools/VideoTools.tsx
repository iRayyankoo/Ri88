
"use client";

import { useState, useRef } from "react";
import { ToolShell } from "./ToolShell";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
    Video,
    Settings,
    Download,
    Play,
    AlertCircle,
    Loader2,
    FileVideo
} from "lucide-react";
import { toast } from "sonner";

interface ToolProps {
    toolId: string;
}

export default function VideoTools({ toolId }: ToolProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const ffmpegRef = useRef(new FFmpeg());

    const loadFFmpeg = async () => {
        const ffmpeg = ffmpegRef.current;
        if (ffmpeg.loaded) return;

        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            await loadFFmpeg();
            const ffmpeg = ffmpegRef.current;

            ffmpeg.on("progress", ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpeg.writeFile("input.mp4", await fetchFile(file));

            if (toolId === 'media-gif') {
                await ffmpeg.exec([
                    "-i", "input.mp4",
                    "-vf", "fps=10,scale=480:-1:flags=lanczos",
                    "output.gif"
                ]);
                const data = await ffmpeg.readFile("output.gif");
                const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: "image/gif" }));
                setResultUrl(url);
                toast.success("تم تحويل الفيديو إلى GIF بنجاح!");
            } else if (toolId === 'media-mp3') {
                await ffmpeg.exec([
                    "-i", "input.mp4",
                    "-q:a", "0",
                    "-map", "a",
                    "output.mp3"
                ]);
                const data = await ffmpeg.readFile("output.mp3");
                const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: "audio/mp3" }));
                setResultUrl(url);
                toast.success("تم استخراج الصوت بنجاح!");
            }

        } catch (error) {
            console.error(error);
            toast.error("فشل التحويل. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsProcessing(false);
        }
    };

    const isAudio = toolId === 'media-mp3';

    return (
        <ToolShell
            title={toolId === 'media-gif' ? "تحويل الفيديو لـ GIF" : "استخراج الصوت"}
            description={toolId === 'media-gif' ? "حول فيديوهاتك إلى صور متحركة مباشرة في المتصفح." : "استخرج الصوت من الفيديو بصيغة MP3."}
            results={
                <div className="space-y-6">
                    {isProcessing && (
                        <div className="text-center space-y-4 py-10">
                            <div className="relative w-24 h-24 mx-auto">
                                <Loader2 className="w-full h-full text-brand-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                    {progress}%
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium animate-pulse">جاري المعالجة... قد يستغرق ذلك بضع دقائق</p>
                        </div>
                    )}

                    {resultUrl && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 space-y-4">
                                <div className="flex items-center gap-3 text-brand-primary mb-2">
                                    <Download className="w-5 h-5" />
                                    <span className="font-bold">تم الإنشاء!</span>
                                </div>
                                {isAudio ? (
                                    <audio src={resultUrl} controls className="w-full" />
                                ) : (
                                    <img src={resultUrl} alt="Converted result" className="w-full rounded-xl" />
                                )}
                                <a
                                    href={resultUrl}
                                    download={isAudio ? "audio.mp3" : "converted.gif"}
                                    className="block w-full text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    تحميل الملف النهائي
                                </a>
                            </div>
                        </div>
                    )}

                    {!isProcessing && !resultUrl && (
                        <div className="text-center py-20 text-slate-500">
                            <FileVideo className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>اختر ملفاً وابدأ التحويل</p>
                        </div>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">اختر ملف الفيديو (MP4/MOV)</label>
                    <div
                        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${file ? "border-brand-primary bg-brand-primary/5" : "border-white/10 hover:border-white/30"
                            }`}
                        onClick={() => document.getElementById("video-upload")?.click()}
                    >
                        <input
                            id="video-upload"
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            aria-label="Upload video file"
                        />
                        <Video className={`w-12 h-12 mx-auto mb-4 ${file ? "text-brand-primary" : "text-slate-600"}`} />
                        <p className="text-white font-bold">{file ? file.name : "اسحب الفيديو هنا أو اضغط للاختيار"}</p>
                        <p className="text-slate-500 text-sm mt-2">الحد الأقصى (يفضل أقل من 50MB للسرعة)</p>
                    </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-amber-500 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>هذه الميزة تستخدم قوة المعالج في جهازك مباشرة. تأكد من ثبات المتصفح أثناء المعالجة.</p>
                </div>

                <button
                    onClick={handleConvert}
                    disabled={!file || isProcessing}
                    className="w-full h-16 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-black text-lg rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                    {isProcessing ? "جاري المعالجة..." : isAudio ? "استخراج الصوت (MP3)" : "تحويل إلى GIF"}
                </button>
            </div>
        </ToolShell>
    );
}
