
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Sparkles, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TIERS = [
    {
        name: 'المجانية',
        price: '0',
        description: 'للمستخدمين العاديين الذين يحتاجون أدوات بسيطة.',
        features: [
            'وصول لكافة الأدوات الأساسية',
            'سرعة معالجة قياسية',
            'دعم عبر المجتمع',
            'حفظ حتى 5 عمليات في السجل',
        ],
        buttonText: 'ابدأ مجاناً',
        isPopular: false,
        gradient: 'from-slate-800 to-slate-900',
    },
    {
        name: 'المحترفة (Pro)',
        price: '49',
        description: 'للمبدعين والشركات التي تبحث عن القوة الكاملة.',
        features: [
            'كل مميزات الباقة المجانية',
            'معالجة فائقة السرعة للأدوات المتقدمة',
            'محول الأكواد الذكي (Unlimited)',
            'سجل عمليات غير محدود',
            'دعم فني سريع (Priority)',
            'الوصول المبكر للميزات الجديدة',
        ],
        buttonText: 'اشترك الآن',
        isPopular: true,
        gradient: 'from-brand-primary to-brand-secondary',
    },
];

export default function PricingPage() {
    const router = useRouter();

    const handleSubscribe = async (tier: string) => {
        if (tier === 'المجانية') {
            router.push('/pro/beta');
            return;
        }
        // Redirect to Moyasar Charge Page
        router.push('/pro/charge');
    };

    return (
        <div className="min-h-screen bg-[#0D0D0F] py-20 px-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-secondary/10 blur-[120px] rounded-full" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold text-sm group"
                >
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    العودة
                </motion.button>
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">خطط الأسعار</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            اختر الخطة المناسبة لاحتياجاتك وابدأ في توظيف قوة الذكاء الاصطناعي والأدوات المتقدمة في أعمالك اليومية.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {TIERS.map((tier, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className={`relative rounded-[32px] p-1 border ${tier.isPopular ? 'bg-gradient-to-br from-brand-primary/50 to-brand-secondary/50 border-transparent shadow-[0_0_40px_rgba(139,92,246,0.2)]' : 'bg-white/5 border-white/10'
                                }`}
                        >
                            {tier.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                    <Star size={12} fill="currentColor" />
                                    الأكثر طلباً
                                </div>
                            )}

                            <div className="bg-[#13131A] rounded-[30px] p-8 lg:p-10 h-full flex flex-col">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white">{tier.price}</span>
                                        <span className="text-slate-500 font-bold">ريال / شهرياً</span>
                                    </div>
                                    <p className="text-slate-400 mt-4 text-sm leading-relaxed">{tier.description}</p>
                                </div>

                                <div className="space-y-4 mb-10 flex-1">
                                    {tier.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-3">
                                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${tier.isPopular ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-slate-400'}`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-300 text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSubscribe(tier.name)}
                                    className={`w-full h-14 rounded-2xl font-black text-lg transition-all active:scale-95 ${tier.isPopular
                                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40'
                                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {tier.buttonText}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/5 pt-12">
                    {[
                        { icon: <Zap size={24} className="text-amber-400" />, title: "تفعيل فوري", desc: "تتم ترقية حسابك مباشرة فور إتمام عملية الدفع." },
                        { icon: <Shield size={24} className="text-blue-400" />, title: "دفع آمن", desc: "نستخدم بوابات دفع آمنة ومشفرة لضمان حماية بياناتك." },
                        { icon: <Sparkles size={24} className="text-purple-400" />, title: "تحديثات دورية", desc: "نضيف أدوات جديدة ومزايا حصرية للمشتركين كل أسبوع." },
                    ].map((item, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h4 className="text-white font-bold mb-2">{item.title}</h4>
                            <p className="text-slate-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
