"use client";
import React from 'react';

export default function NewsTicker() {
    return (
        <div className="news-ticker-bar">
            <div className="ticker-label">🔴 تحديثات مباشرة</div>
            <div className="ticker-track">
                <div className="ticker-item">
                    🚀 <strong>إطلاق Ri88 V14.0!</strong> • 🏆 الهلال يفوز 3-0 • 🤖 تمت إضافة أدوات ذكاء اصطناعي جديدة • 💡 مقال "كيف تبني عادة" يتصدر الترند • 📅 تحديث حاسبة الزكاة لعام ٢٠٢٦
                </div>
                {/* Duplicate for smooth loop */}
                <div className="ticker-item">
                    🚀 <strong>إطلاق Ri88 V14.0!</strong> • 🏆 الهلال يفوز 3-0 • 🤖 تمت إضافة أدوات ذكاء اصطناعي جديدة • 💡 مقال "كيف تبني عادة" يتصدر الترند • 📅 تحديث حاسبة الزكاة لعام ٢٠٢٦
                </div>
            </div>
        </div>
    );
}
