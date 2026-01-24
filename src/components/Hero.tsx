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
                <span className="hero-badge">✨ مستقبل الأدوات الرقمية</span>
                <h1>
                    أدوات ذكية <br />
                    <span className="gradient-text-anim">لاستخدامك اليومي</span>
                </h1>
                <p style={{ fontSize: '1.2em', maxWidth: '600px', margin: '0 auto 30px', color: 'var(--text-secondary)' }}>
                    مجموعة متميزة من الأدوات الأساسية للمالية والإنتاجية وصناعة المحتوى. مجانية للجميع.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button className="btn-primary glow-effect">
                        تصفح الأدوات
                    </button>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        تصفح المجلة <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
