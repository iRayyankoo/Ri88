"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolInput, ToolButton, ToolTextarea, ToolSelect } from './ToolUi';
import { Sparkles, Instagram, ExternalLink, Youtube } from 'lucide-react';
import { toast } from 'sonner';

interface ToolProps {
    toolId: string;
}

// Phase 6.7: YT Thumbnail Seer
function YoutubeThumbSeer() {
    const [url, setUrl] = useState('');
    const [thumb, setThumb] = useState('');

    const extract = () => {
        const id = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (id && id[1]) {
            setThumb(`https://img.youtube.com/vi/${id[1]}/maxresdefault.jpg`);
            toast.success("تم استخراج الصورة!");
        } else {
            toast.error("رابط يوتيوب غير صحيح");
        }
    };

    return (
        <ToolShell description="استخراج الصور المصغرة (Thumbnails) بجودة عالية من أي مقطع يوتيوب.">
            <ToolInputRow label="رابط اليوتيوب">
                <ToolInput value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="h-14 ltr" />
            </ToolInputRow>
            <ToolButton onClick={extract} className="w-full mt-4 h-14" variant="iridescent">استخراج الصورة</ToolButton>
            {thumb && (
                <div className="mt-8">
                    <img src={thumb} alt="YouTube Thumbnail" className="w-full rounded-2xl border border-white/10 shadow-2xl" />
                    <a href={thumb} target="_blank" rel="noreferrer" className="block mt-4 text-center text-sm font-bold text-brand-primary hover:underline">تحميل الصورة الأصلية</a>
                </div>
            )}
        </ToolShell>
    );
}

// 1. Bio Link Generator
function BioLinkGen() {
    const [name, setName] = useState('ريان المستخدم');
    const [bio, setBio] = useState('صانع محتوى رقمي ومهتم بالتقنية');
    const [links, setLinks] = useState([{ id: 1, title: 'موقعي الشخصي', url: 'https://example.com' }]);

    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const addLink = () => {
        if (!newTitle || !newUrl) return;
        setLinks([...links, { id: Date.now(), title: newTitle, url: newUrl }]);
        setNewTitle(''); setNewUrl('');
    };

    const removeLink = (id: number) => {
        setLinks(links.filter(l => l.id !== id));
    };

    return (
        <ToolShell description="أنشئ معاينة لصفحة 'رابط في البايو' وخصص الأزرار والروابط.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Editor */}
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                        <label className="text-sm font-bold text-slate-300 block mb-2">المعلومات الأساسية</label>
                        <ToolInputRow label="اسم العرض"><ToolInput value={name} onChange={e => setName(e.target.value)} /></ToolInputRow>
                        <ToolInputRow label="النبذة التعريفية (Bio)"><ToolTextarea value={bio} onChange={e => setBio(e.target.value)} className="h-20" /></ToolInputRow>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                        <label className="text-sm font-bold text-slate-300 block mb-2">إضافة الروابط</label>
                        <ToolInputRow label="عنوان الرابط"><ToolInput placeholder="مثال: يوتيوب، متجري..." value={newTitle} onChange={e => setNewTitle(e.target.value)} /></ToolInputRow>
                        <ToolInputRow label="عنوان URL"><ToolInput placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} className="ltr" /></ToolInputRow>
                        <ToolButton onClick={addLink} className="w-full" variant="primary">إضافة للملف</ToolButton>

                        <div className="mt-4 space-y-2">
                            {links.map((link) => (
                                <div key={link.id} className="flex items-center justify-between p-2 bg-black/20 border border-white/10 rounded-lg text-sm">
                                    <span className="font-bold truncate max-w-[150px]">{link.title}</span>
                                    <button onClick={() => removeLink(link.id)} className="text-red-400 hover:text-red-300 px-2" title="حذف">حذف</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="flex flex-col items-center p-8 bg-gradient-to-b from-slate-900 to-black rounded-3xl border-2 border-slate-800 shadow-2xl relative overflow-hidden min-h-[500px]">
                    <div className="absolute top-0 w-32 h-6 bg-slate-800 rounded-b-3xl"></div>
                    <div className="w-24 h-24 bg-gradient-to-tr from-brand-primary to-purple-500 rounded-full flex items-center justify-center mt-6 mb-4 shadow-lg p-1">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                            <span className="text-3xl">👋</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                    <p className="text-slate-400 text-sm mb-8 text-center max-w-[250px] leading-relaxed">{bio}</p>

                    <div className="space-y-4 w-full px-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {links.map((link) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-brand-primary/50 rounded-xl text-center text-white font-bold flex items-center justify-center transition-all hover:scale-[1.02]">
                                {link.title}
                            </a>
                        ))}
                    </div>
                    <div className="mt-auto pt-8 text-[10px] text-slate-600 uppercase tracking-widest font-mono">Powered by Ri88</div>
                </div>
            </div>
        </ToolShell>
    );
}

// 2. Fancy Text Generator
function FancyTextGen() {
    const [input, setInput] = useState('اكتب شيئاً للتجربة...');
    const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("تم النسخ بنجاح!"); };

    // Arabic + English text fancy mapping
    const enAlts: Record<string, string> = {
        'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
        'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
    };
    const cursive: Record<string, string> = {
        'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
        'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
    };

    const mapText = (s: string, map: Record<string, string>) => s.split('').map(c => map[c] || c).join('');

    const styles = [
        { name: 'متباعد (Space)', gen: (s: string) => s.split('').join(' ') },
        { name: 'مزدوج (Double Struck)', gen: (s: string) => mapText(s, enAlts) },
        { name: 'متصل (Cursive)', gen: (s: string) => mapText(s, cursive) },
        { name: 'مربع (Square)', gen: (s: string) => s.split('').map(c => c.trim() ? `[${c}]` : ' ').join('') },
        { name: 'فقاعات (Bubbles)', gen: (s: string) => s.split('').map(c => c.trim() ? `(${c})` : ' ').join('') },
        { name: 'تحسيني (Sparkles)', gen: (s: string) => `✨ ${s} ✨` },
        { name: 'قوي (Shout)', gen: (s: string) => `📢 💥 ${s.toUpperCase()} 💥 📢` },
    ];

    return (
        <ToolShell description="حول نصوصك العادية إلى خطوط مزخرفة وجذابة لمواقع التواصل.">
            <ToolTextarea value={input} onChange={e => setInput(e.target.value)} className="h-28 mb-6 text-xl p-4" placeholder="اكتب النص هنا..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {styles.map((s, i) => {
                    const preview = s.gen(input);
                    return (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-brand-primary/30 transition-colors">
                            <span className="text-xs font-bold text-slate-500 mb-2">{s.name}</span>
                            <div className="flex justify-between items-center gap-4">
                                <span className="font-medium text-lg truncate flex-1 leading-snug">{preview}</span>
                                <ToolButton variant="secondary" size="sm" onClick={() => copy(preview)} className="shrink-0 h-10 w-16 text-xs">نسخ</ToolButton>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToolShell>
    );
}

// 3. Hashtag Recommender
function HashtagGen() {
    const [niche, setNiche] = useState('tech');

    const hashtags: Record<string, string[]> = {
        tech: ['#tech', '#technology', '#innovation', '#coding', '#software', '#developer', '#future'],
        food: ['#food', '#foodporn', '#foodie', '#instafood', '#yummy', '#delicious', '#cooking'],
        travel: ['#travel', '#wanderlust', '#travelgram', '#vacation', '#instatravel', '#adventure', '#explore'],
        fitness: ['#fitness', '#workout', '#gym', '#fit', '#health', '#training', '#motivation'],
        fashion: ['#fashion', '#style', '#ootd', '#beauty', '#model', '#fashionblogger', '#outfit'],
        business: ['#business', '#entrepreneur', '#success', '#marketing', '#startup', '#money', '#leadership'],
        gaming: ['#gaming', '#gamer', '#videogames', '#playstation', '#xbox', '#pcgaming', '#twitch'],
    };

    const currentTags = hashtags[niche] || [];
    const copyAll = () => {
        navigator.clipboard.writeText(currentTags.join(' '));
        toast.success("تم نسخ جميع الوسوم!");
    };

    return (
        <ToolShell description="احصل على أفضل الوسوم (Hashtags) المقترحة لمجال تخصصك للانتشار على انستجرام وتيك توك وغيرها.">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                <ToolInputRow label="اختر مجال المحتوى (Niche)">
                    <ToolSelect value={niche} onChange={e => setNiche(e.target.value)} title="المجال">
                        <option value="tech">تقنية وبرمجة</option>
                        <option value="food">طعام وطبخ</option>
                        <option value="travel">سفر وسياحة</option>
                        <option value="fitness">صحة ولياقة</option>
                        <option value="fashion">أزياء وموضة</option>
                        <option value="business">أعمال وبزنس</option>
                        <option value="gaming">ألعاب قيمنق</option>
                    </ToolSelect>
                </ToolInputRow>
            </div>

            <div className="p-8 bg-brand-primary/5 border border-brand-primary/20 rounded-3xl relative">
                <div className="absolute top-0 right-0 p-4 -translate-y-1/2">
                    <ToolButton size="sm" variant="primary" className="rounded-full shadow-lg" onClick={copyAll}>نسخ الكل</ToolButton>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                    {currentTags.map((tag, i) => (
                        <div key={i} className="px-4 py-2 bg-brand-primary/20 text-brand-primary font-bold rounded-full border border-brand-primary/30 text-sm hover:bg-brand-primary hover:text-white transition-colors cursor-pointer select-all" onClick={() => {
                            navigator.clipboard.writeText(tag);
                            toast.success(`تم نسخ ${tag}`);
                        }}>
                            {tag}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-6 text-center">اضغط على أي وسم لنسخه منفرداً، أو استخدم الأيقونة لنسخ المجموعة.</p>
            </div>
        </ToolShell>
    );
}

export default function SocialTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'social-bio': return <BioLinkGen />;
        case 'social-fancy': return <FancyTextGen />;
        case 'social-hash': return <HashtagGen />;
        case 'social-yt-thumb': return <YoutubeThumbSeer />;
        default: return <div className="text-center py-20 opacity-50"><Sparkles className="w-12 h-12 mx-auto mb-4" /><p>أداة قادمة قريباً...</p></div>;
    }
}
