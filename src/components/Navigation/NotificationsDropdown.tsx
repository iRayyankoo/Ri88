"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Tag } from 'lucide-react';
import { getUserNotifications, markAsRead, markAllAsRead } from '@/actions/notifications';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import Link from 'next/link';

interface NotificationProps {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

const getIconForType = (type: string) => {
    switch (type) {
        case 'SUCCESS':
            return <CheckCircle className="w-5 h-5 text-emerald-400" />;
        case 'WARNING':
            return <AlertTriangle className="w-5 h-5 text-amber-400" />;
        case 'PROMO':
            return <Tag className="w-5 h-5 text-purple-400" />;
        case 'INFO':
        default:
            return <Info className="w-5 h-5 text-blue-400" />;
    }
};

const getBgForType = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-surface-base border-border-subtle';
    switch (type) {
        case 'SUCCESS': return 'bg-emerald-500/10 border-emerald-500/20';
        case 'WARNING': return 'bg-amber-500/10 border-amber-500/20';
        case 'PROMO': return 'bg-purple-500/10 border-purple-500/20';
        case 'INFO':
        default: return 'bg-blue-500/10 border-blue-500/20';
    }
};

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchAlerts = async () => {
        const res = await getUserNotifications();
        if (res.success && res.data) {
            setNotifications(res.data as any);
            setUnreadCount(res.unreadCount || 0);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Optional: Could poll every X seconds
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
        if (currentStatus) return; // already read
        await markAsRead(id);
        fetchAlerts();
    };

    const handleMarkAll = async () => {
        if (unreadCount === 0) return;
        await markAllAsRead();
        fetchAlerts();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchAlerts(); // Refresh when opening
                }}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all group ${isOpen ? 'bg-surface-glass' : 'hover:bg-surface-glass'}`}
            >
                {unreadCount > 0 && (
                    <div className="absolute top-2.5 right-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-base z-10 animate-pulse" />
                )}
                <Bell className={`w-5 h-5 transition-colors ${isOpen ? 'text-text-primary' : 'text-text-muted group-hover:text-brand-primary'}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 sm:w-96 bg-surface-base/95 backdrop-blur-2xl border border-border-subtle rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden z-50 transform origin-top">
                    <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-glass">
                        <h3 className="text-text-primary font-black text-lg">الإشعارات</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAll}
                                className="text-xs font-bold text-brand-primary hover:text-white transition-colors flex items-center gap-1 bg-brand-primary/10 px-3 py-1.5 rounded-lg"
                            >
                                <Check className="w-3 h-3" />
                                تحديد الكل كمقروء
                            </button>
                        )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto no-scrollbar scroll-smooth">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center justify-center opacity-50">
                                <Bell className="w-10 h-10 mb-3 text-text-muted" />
                                <p className="text-text-muted font-medium">لا توجد إشعارات حالياً</p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-2">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-border-strong flex gap-4 items-start ${getBgForType(notif.type, notif.isRead)}`}
                                        dir="rtl"
                                    >
                                        <div className={`mt-0.5 p-2 rounded-xl bg-surface-glass shrink-0`}>
                                            {getIconForType(notif.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`text-sm font-bold ${notif.isRead ? 'text-text-muted' : 'text-text-primary'}`}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                                                )}
                                            </div>
                                            <p className={`text-xs leading-relaxed text-text-muted`}>
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] text-text-muted block pt-1 font-medium">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: arSA })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-border-subtle text-center bg-surface-glass">
                        <Link href="/pro/notifications" className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors" onClick={() => setIsOpen(false)}>
                            عرض كل الإشعارات
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
