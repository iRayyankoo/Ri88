import React from 'react';
import { 
    Users, HandCoins, CheckSquare, Receipt, Plus 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    AreaChart, Area, CartesianGrid 
} from 'recharts';
import { Client, Opportunity, CRMTask, PipelineStage } from '@/types/crm';

interface AnalyticsDashboardProps {
    clients: Client[];
    opportunities: Opportunity[];
    tasks: CRMTask[];
    pipelineStages: PipelineStage[];
    pipelineData: any[];
    acquisitionData: any[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
    clients,
    opportunities,
    tasks,
    pipelineStages,
    pipelineData,
    acquisitionData
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Expected Sales */}
                <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl transition-all hover:border-brand-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                            <HandCoins size={20} />
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">المبيعات المتوقعة</span>
                    </div>
                    <div className="text-3xl font-black text-white tabular-nums">
                        {opportunities.reduce((s, o) => s + (o.value || 0), 0).toLocaleString('ar-SA')} ر.س
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-emerald-400">
                        <Plus size={10} className="inline" /> {opportunities.length} صفقة 
                    </div>
                </div>

                {/* Clients */}
                <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl transition-all hover:border-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">العملاء</span>
                    </div>
                    <div className="text-3xl font-black text-white tabular-nums">{clients.length}</div>
                    <div className="mt-2 text-[10px] font-bold text-blue-400">
                        {clients.filter(c => c.status === 'WON').length} عميل تم البيع له
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl transition-all hover:border-amber-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                            <CheckSquare size={20} />
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">المهام المنجزة</span>
                    </div>
                    <div className="text-3xl font-black text-white tabular-nums">
                        {tasks.filter(t => t.status === 'DONE').length}
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-amber-400">من أصل {tasks.length} مهمة</div>
                </div>

                {/* Pipeline Quality */}
                <div className="bg-surface-base border border-border-subtle rounded-3xl p-6 shadow-xl transition-all hover:border-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                            <Receipt size={20} />
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">جودة المسار</span>
                    </div>
                    <div className="text-3xl font-black text-white tabular-nums">
                        {(() => {
                            const wonStage = pipelineStages.find(s => s.name.includes('تم البيع') || s.name.toUpperCase().includes('WON'));
                            if (!wonStage || opportunities.length === 0) return 0;
                            return Math.round((opportunities.filter(o => o.stageId === wonStage.id).length / opportunities.length) * 100);
                        })()}%
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-purple-400">نسبة الانغلاق الناجح</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pipeline Value Bar Chart */}
                <div className="bg-surface-base border border-border-strong rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-black text-white mb-8 font-cairo">قيمة الصفقات حسب المرحلة</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pipelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#475569" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <YAxis 
                                    stroke="#475569" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `${value.toLocaleString('ar-SA')}`}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }} 
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        border: '1px solid #1e293b', 
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                                    }} 
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="value" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Acquisition Area Chart */}
                <div className="bg-surface-base border border-border-strong rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-black text-white mb-8 font-cairo">تطور اكتساب العملاء (آخر 30 يوم)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={acquisitionData}>
                                <defs>
                                    <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#475569" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    minTickGap={30}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <YAxis 
                                    stroke="#475569" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    allowDecimals={false}
                                    tick={{ fill: '#94a3b8' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        border: '1px solid #1e293b', 
                                        borderRadius: '16px'
                                    }} 
                                    itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="clients" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorClients)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
