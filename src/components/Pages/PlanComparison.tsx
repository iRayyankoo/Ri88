"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, User, Code2 } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const PlanComparison = () => {
    const { setCurrentView } = useNavigation();

    const plans = [
        {
            name: "زائر",
            icon: User,
            price: "مجاني",
            desc: "تجربة محدودة لاستكشاف المنصة",
            features: [
                { name: "تصفح دليل الأدوات", included: true },
                { name: "تجربة 3 أدوات أساسية", included: true },
                { name: "تصدير النتائج", included: false },
                { name: "الوصول للأدوات المتقدمة", included: false },
                { name: "الدعم الفني", included: false },
            ],
            cta: "تصفح الدليل",
            action: () => setCurrentView('directory'),
            color: "slate",
            aura: "from-slate-500/10 to-transparent",
            border: "group-hover:border-slate-500/50"
        },
        {
            name: "محترف",
            icon: Crown,
            price: "49 ر.س",
            period: "/ شهرياً",
            desc: "كل ما تحتاجه لإنجاز أعمالك بذكاء",
            features: [
                { name: "تصفح دليل الأدوات", included: true },
                { name: "وصول كامل لـ 60+ أداة", included: true },
                { name: "تصدير النتائج بلا حدود", included: true },
                { name: "أولوية في المعالجة", included: true },
                { name: "دعم فني عبر الشات", included: true },
            ],
            cta: "اشترك الآن",
            action: () => setCurrentView('checkout'),
            highlight: true,
            color: "brand-primary",
            aura: "from-brand-primary/20 to-brand-primary/5",
            border: "border-brand-primary/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
        },
        {
            name: "مطور",
            icon: Code2,
            price: "199 ر.س",
            period: "/ شهرياً",
            desc: "للمبرمجين وبناء التكاملات",
            features: [
                { name: "فترة تجربة المحترفين", included: true },
                { name: "API Key خاص", included: true },
                { name: "رفع أدواتك الخاصة", included: true },
                { name: "لوحة تحكم المطورين", included: true },
                { name: "Webhooks & Automation", included: true },
            ],
            cta: "انضم كمطور",
            action: () => setCurrentView('checkout'),
            color: "indigo",
            aura: "from-indigo-500/20 to-transparent",
            border: "group-hover:border-indigo-500/50"
        }
    ];

    return (
        <div className="space-y-16 lg:space-y-24 pb-24 relative overflow-hidden">
            {/* BACKGROUND DECORATION */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
            </div>

            {/* HEADER */}
            <div className="relative z-10 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md mb-4"
                >
                    Premium Access
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl lg:text-7xl font-black text-white font-cairo tracking-tight leading-tight"
                >
                    خطط تناسب <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">جميع الاحتياجات</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 font-medium max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed font-cairo px-4"
                >
                    اختر الخطة التي تمكنك من الوصول لأقصى إمكانات الذكاء الاصطناعي مع RI88 PRO.
                </motion.p>
            </div>

            {/* PLANS GRID */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch max-w-7xl mx-auto px-6">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.8 }}
                        whileHover={{ y: -10 }}
                        className={`group relative p-1 lg:p-1.5 rounded-[40px] bg-white/5 border border-white/5 transition-all duration-500 flex flex-col ${plan.highlight ? 'scale-105 z-20' : 'z-10'}`}
                    >
                        {/* AURA GLOW */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${plan.aura} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[40px] pointer-events-none blur-3xl`} />

                        {/* INTERNAL CONTENT CONTAINER */}
                        <div className={`relative flex-1 rounded-[36px] bg-[#0F1115] p-8 lg:p-12 border border-white/5 ${plan.highlight ? plan.border : 'group-hover:border-white/20'} transition-all duration-500 flex flex-col items-center text-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]`}>

                            {/* GLASS OVERLAY GLOW */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.aura} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none`} />

                            {/* HIGHLIGHT BADGE */}
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="bg-brand-primary text-black text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg shadow-brand-primary/20">
                                        الأكثر شيوعاً
                                    </div>
                                </div>
                            )}

                            {/* HEADER AREA */}
                            <div className="relative z-10 w-full flex flex-col items-center space-y-6 mb-10">
                                <div className={`w-20 h-20 rounded-[28px] ${plan.highlight ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-white/5 border-white/10 text-slate-400'} border flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl`}>
                                    <plan.icon className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl lg:text-3xl font-black text-white font-cairo tracking-tight">{plan.name}</h3>
                                    <p className="text-slate-500 text-sm font-medium font-cairo">{plan.desc}</p>
                                </div>
                                <div className="flex items-end justify-center gap-2 pt-4">
                                    <span className="text-4xl lg:text-6xl font-black text-white font-inter tracking-tighter leading-none">{plan.price}</span>
                                    {plan.period && <span className="text-sm lg:text-base text-slate-500 font-bold font-cairo pb-1">{plan.period}</span>}
                                </div>
                            </div>

                            {/* FEATURES LIST */}
                            <div className="relative z-10 w-full flex-1 border-t border-white/5 pt-10 mb-10">
                                <ul className="space-y-5">
                                    {plan.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-right group/feat">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/feat:scale-110 ${feat.included
                                                ? plan.highlight ? 'bg-brand-primary/20 text-brand-primary' : 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-white/5 text-slate-700'
                                                }`}>
                                                {feat.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className={`text-sm lg:text-base font-medium font-cairo transition-colors duration-300 ${feat.included ? 'text-slate-300 group-hover/feat:text-white' : 'text-slate-600'}`}>
                                                {feat.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA BUTTON */}
                            <button
                                onClick={plan.action}
                                className={`relative z-10 w-full py-5 rounded-2xl font-black text-lg lg:text-xl transition-all active:scale-95 duration-500 overflow-hidden shadow-2xl ${plan.highlight
                                    ? 'bg-brand-primary text-black hover:bg-brand-primary/90 shadow-brand-primary/30'
                                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <span className="relative z-10">{plan.cta}</span>
                                {plan.highlight && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PlanComparison;
