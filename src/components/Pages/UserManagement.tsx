"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Shield, User, Ban, CheckCircle } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

const UserManagement = () => {
    const { setCurrentView } = useNavigation();
    const [search, setSearch] = useState('');

    const users = [
        { id: 1, name: 'أحمد العنزي', email: 'ahmed@example.com', role: 'admin', status: 'active', date: '2025-05-01' },
        { id: 2, name: 'سارة محمد', email: 'sara@example.com', role: 'user', status: 'active', date: '2025-05-10' },
        { id: 3, name: 'DevilHunter', email: 'spam@bot.net', role: 'user', status: 'banned', date: '2025-05-11' },
        { id: 4, name: 'خالد الزهراني', email: 'khaled@tech.sa', role: 'developer', status: 'pending', date: '2025-05-12' },
        { id: 5, name: 'Mona Lisa', email: 'mona@art.com', role: 'user', status: 'active', date: '2025-05-12' },
    ];

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-white">إدارة المستخدمين</h2>
                    <p className="text-slate-500 font-medium mt-1">عرض والتحكم في حسابات الأعضاء.</p>
                </div>
                <button
                    onClick={() => setCurrentView('admin')}
                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                    عودة للرئيسية
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="بحث بالاسم أو البريد..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pr-12 pl-4 text-white focus:border-brand-primary outline-none transition-colors"
                    />
                </div>
                <button className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all whitespace-nowrap">
                    إضافة مستخدم
                </button>
            </div>

            {/* Table */}
            <div className="stitch-glass overflow-hidden rounded-2xl">
                <table className="w-full text-right">
                    <thead className="bg-white/5 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">المستخدم</th>
                            <th className="px-6 py-4">الدور</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4">تاريخ الانضمام</th>
                            <th className="px-6 py-4">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-white/[0.02] transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-400 font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            user.role === 'developer' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.status === 'active' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        {user.status === 'banned' && <Ban className="w-4 h-4 text-red-500" />}
                                        <span className={`text-sm font-medium ${user.status === 'active' ? 'text-green-400' :
                                                user.status === 'banned' ? 'text-red-400' : 'text-slate-400'
                                            }`}>
                                            {user.status === 'active' ? 'نشط' : user.status === 'banned' ? 'محظور' : 'انتظار'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-mono">
                                    {user.date}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
