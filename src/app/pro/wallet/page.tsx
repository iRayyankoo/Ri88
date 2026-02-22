"use client";
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import WalletActivity from '@/components/Pages/WalletActivity';

export default function WalletPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Link
                    href="/pro/charge"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    شحن المحفظة
                </Link>
            </div>
            <WalletActivity />
        </div>
    );
}
