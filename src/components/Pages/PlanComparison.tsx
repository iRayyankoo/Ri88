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
            highlight: false
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
            highlight: true
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
            highlight: false
        }
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black text-white">خطط تناسب جميع الاحتياجات</h2>
                <p className="text-slate-400 font-medium max-w-xl mx-auto">اختر الخطة التي تمكنك من الوصول لأقصى إمكانات الذكاء الاصطناعي مع RI88 PRO.</p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative rounded-[32px] p-8 space-y-8 border transition-all duration-300 ${plan.highlight
                            ? 'stitch-glass border-brand-primary/50 shadow-[0_0_50px_rgba(139,92,246,0.15)] scale-105 z-10'
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        {/* Highlght Badge */}
                        {plan.highlight && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-lg">
                                الأكثر شيوعاً
                            </div>
                        )}

                        {/* Header */}
                        <div className="text-center space-y-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${plan.highlight ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-white/5 text-slate-400'
                                }`}>
                                <plan.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <p className="text-slate-500 text-sm mt-1">{plan.desc}</p>
                            </div>
                            <div className="flex items-end justify-center gap-1 font-black text-white">
                                <span className="text-4xl">{plan.price}</span>
                                {plan.period && <span className="text-sm text-slate-500 mb-1">{plan.period}</span>}
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-4">
                            {plan.features.map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm">
                                    {feat.included ? (
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
                                            <X className="w-3 h-3 text-slate-600" />
                                        </div>
                                    )}
                                    <span className={feat.included ? "text-slate-200" : "text-slate-600"}>{feat.name}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <button
                            onClick={plan.action}
                            className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${plan.highlight
                                ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90'
                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                }`}
                        >
                            {plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PlanComparison;
