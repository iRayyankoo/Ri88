
import { auth } from "@/auth";
import { getUserHistory, deleteHistoryItem } from "@/lib/actions/history";
import { Trash2, Clock, FileText, Calculator, Code } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

function getToolIcon(type: string) {
    if (type.includes('finance')) return <Calculator className="w-5 h-5 text-blue-400" />;
    if (type.includes('code')) return <Code className="w-5 h-5 text-purple-400" />;
    return <FileText className="w-5 h-5 text-slate-400" />;
}

export default async function DashboardPage() {
    const session = await auth();
    const history = await getUserHistory();

    // Stats
    const toolsUsedCount = Array.isArray(history) ? history.length : 0;
    const uniqueTools = Array.isArray(history) ? new Set(history.map(h => h.type)).size : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">مرحباً، {session?.user?.name?.split(' ')[0] || "المستخدم"} 👋</h1>
                    <p className="text-slate-400 font-medium">سجل عملياتك ونتائجك المحفوظة.</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "الأدوات المحفوظة", value: toolsUsedCount, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
                    { label: "أنواع الأدوات", value: uniqueTools, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
                    { label: "حالة الحساب", value: "Premium", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                ].map((stat, i) => (
                    <div key={i} className={`bg-[#13131A] border ${stat.color} p-6 rounded-[24px] transition-transform hover:scale-[1.02]`}>
                        <p className="text-slate-400 text-sm font-bold mb-1">{stat.label}</p>
                        <p className={`text-4xl font-black`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* History Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-primary" />
                    النشاط الأخير
                </h2>

                {!Array.isArray(history) || history.length === 0 ? (
                    <div className="bg-[#13131A] border border-white/5 rounded-3xl p-12 text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-bold text-lg">لا يوجد نشاط مسجل بعد.</p>
                        <p className="text-slate-600 mt-1">ابدأ باستخدام الأدوات وحفظ نتائجك لتظهر هنا.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {history.map((item) => (
                            <div key={item.id} className="group bg-[#13131A] border border-white/5 hover:border-brand-primary/30 p-5 rounded-2xl flex items-center justify-between transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-primary/10 transition-colors">
                                        {getToolIcon(item.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors">{item.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ar })}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 uppercase font-mono">
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <form action={async () => {
                                        "use server";
                                        await deleteHistoryItem(item.id);
                                    }}>
                                        <button className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
