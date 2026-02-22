"use client";
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="hero-3d">
            {/* Mesh Background */}
            <div className="hero-mesh-bg"></div>

            {/* Floating Elements (Pure CSS) */}
            <div className="hero-elements">
                <div className="floaty-card c1"><Sparkles color="#D35BFF" /></div>
                <div className="floaty-card c2"><Sparkles color="#00FFF2" /></div>
            </div>

            <div className="hero-content">
                <div className="flex justify-center mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black font-cairo animate-pulse">
                        تشغيل تجريبي 🚀
                    </span>
                </div>
                <span className="hero-badge">✨ مستقبل الأدوات الرقمية</span>
                <h1>
                    أدوات ذكية <br />
                    <span className="gradient-text-anim">لاستخدامك اليومي</span>
                </h1>
                <p className="text-[1.2em] max-w-[600px] mx-auto mb-8 text-[var(--text-secondary)]">
                    مجموعة متميزة من الأدوات الأساسية للمالية والإنتاجية وصناعة المحتوى. مجانية للجميع.
                </p>

                <div className="flex gap-4 justify-center">
                    <button className="btn-primary glow-effect">
                        تصفح الأدوات
                    </button>
                    <button className="btn-secondary flex items-center gap-2">
                        تصفح المجلة <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
