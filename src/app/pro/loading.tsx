export default function Loading() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-brand-primary animate-spin" />
            </div>
            <div className="text-slate-500 font-cairo text-sm font-bold animate-pulse">
                جاري تحضير الواجهة...
            </div>
        </div>
    );
}
