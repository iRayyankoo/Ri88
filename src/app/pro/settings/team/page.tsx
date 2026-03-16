"use client";
import React from 'react';
import WorkgroupManagement from '@/components/Pages/WorkgroupManagement';
import { motion } from 'framer-motion';
import { Users, ShieldCheck } from 'lucide-react';

export default function TeamSettingsPage() {
    return (
        <div className="min-h-screen bg-surface-base p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white flex items-center gap-4">
                            <Users className="text-brand-primary w-10 h-10" />
                            إدارة الفريق والصلاحيات
                        </h1>
                        <p className="text-text-muted font-bold mt-2 text-lg">التحكم الكامل في وصول الأعضاء والخصوصية</p>
                    </div>
                </div>

                {/* Workgroup Management Component */}
                <div className="bg-surface-glass border border-border-subtle rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
                    <WorkgroupManagement />
                </div>

                {/* Info Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-primary/5 border border-brand-primary/10 rounded-[2rem] p-8 flex flex-col md:flex-row gap-6 items-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white mb-1">نظام الحماية المتقدم</h3>
                        <p className="text-text-muted font-bold leading-relaxed">
                            يتم تطبيق الصلاحيات بشكل فوري على جميع الأعضاء. يمكنك تعيين أدوار محددة لكل عضو (مشاهدة فقط، إنشاء، تعديل) لضمان أعلى مستويات الأمان والخصوصية لبيانات العملاء والمهام.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
