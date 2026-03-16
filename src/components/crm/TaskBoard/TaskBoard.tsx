import React, { useState } from 'react';
import { 
    LayoutList, Columns, Calendar as CalendarIcon, 
    Plus, Search, GripVertical, CheckSquare 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CRMTask, Client, Opportunity } from '@/types/crm';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
    tasks: CRMTask[];
    isAdmin: boolean;
    permissions: Record<string, boolean>;
    onNewTask: (group?: string) => void;
    onEditTask: (task: CRMTask) => void;
    onDeleteTask: (taskId: string) => void;
    onUpdateTaskStatus: (taskId: string, status: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
    tasks,
    isAdmin,
    permissions,
    onNewTask,
    onEditTask,
    onDeleteTask,
    onUpdateTaskStatus
}) => {
    const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const canCreateTask = isAdmin || permissions?.['can_create_tasks'];

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-surface-base p-1 rounded-2xl border border-border-strong">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'list' ? 'bg-brand-primary text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <LayoutList size={14} /> القائمة
                    </button>
                    <button 
                        onClick={() => setViewMode('board')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'board' ? 'bg-brand-primary text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Columns size={14} /> اللوحة
                    </button>
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'calendar' ? 'bg-brand-primary text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <CalendarIcon size={14} /> التقويم
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text"
                            placeholder="بحث في المهام..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-base border border-border-strong rounded-2xl py-2.5 pr-11 pl-4 text-xs text-white outline-none focus:border-brand-primary/50 transition-all"
                        />
                    </div>
                    {canCreateTask && (
                        <button 
                            onClick={() => onNewTask()}
                            className="bg-brand-primary text-black px-6 py-2.5 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                        >
                            <Plus size={16} /> إضافة مهمة
                        </button>
                    )}
                </div>
            </div>

            {/* Content Rendering */}
            {viewMode === 'list' && (
                <div className="bg-surface-base border border-border-strong rounded-[2rem] overflow-hidden">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <th className="p-5">المهمة</th>
                                <th className="p-5">الأولوية</th>
                                <th className="p-5">تاريخ الاستحقاق</th>
                                <th className="p-5">الحالة</th>
                                <th className="p-5 text-center">أدوات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTasks.length > 0 ? filteredTasks.map(task => (
                                <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEditTask(task)}>
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-primary transition-colors italic font-serif">T</div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{task.title}</p>
                                                {task.client && <span className="text-[10px] text-slate-500 font-bold">عميل: {task.client.name}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                            task.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                            task.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                            task.priority === 'MEDIUM' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                                        }`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="p-5 text-xs text-slate-400 font-bold">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ar-SA') : 'بدون تاريخ'}
                                    </td>
                                    <td className="p-5">
                                        <select 
                                            value={task.status}
                                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="TODO">قيد الانتظار</option>
                                            <option value="IN_PROGRESS">قيد التنفيذ</option>
                                            <option value="COMPLETED">مكتملة</option>
                                        </select>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button 
                                            onClick={() => onEditTask(task)}
                                            className="p-2 hover:bg-brand-primary/10 text-slate-500 hover:text-brand-primary rounded-lg transition-all"
                                        >
                                            تعديل
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="opacity-20 flex flex-col items-center">
                                            <CheckSquare size={48} className="mb-4" />
                                            <p className="font-bold">لا يوجد مهام مطابقة للبحث</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === 'board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                        <div key={status} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status === 'TODO' ? 'bg-slate-500' : status === 'IN_PROGRESS' ? 'bg-brand-primary' : 'bg-emerald-500'}`} />
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">
                                        {status === 'TODO' ? 'قيد الانتظار' : status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مكتملة'}
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                    {filteredTasks.filter(t => t.status === status).length}
                                </span>
                            </div>
                            <div className="bg-surface-base/50 border border-border-strong rounded-[2rem] p-4 min-h-[500px] flex flex-col gap-3">
                                {filteredTasks.filter(t => t.status === status).map(task => (
                                    <TaskCard 
                                        key={task.id}
                                        task={task}
                                        isAdmin={isAdmin}
                                        onEdit={() => onEditTask(task)}
                                        onDelete={() => onDeleteTask(task.id)}
                                    />
                                ))}
                                {canCreateTask && (
                                    <button 
                                        onClick={() => onNewTask(status)}
                                        className="w-full py-4 border-2 border-dashed border-border-strong rounded-2xl text-slate-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                                    >
                                        <Plus size={14} /> إضافة مهمة
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewMode === 'calendar' && (
                <div className="bg-surface-base border border-border-strong rounded-[2rem] p-8 text-center py-40">
                    <CalendarIcon className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-black text-slate-600 mb-2">عرض التقويم قادم قريباً</h3>
                    <p className="text-xs text-slate-700 max-w-xs mx-auto">نقوم حالياً بتطوير عرض التقويم ليوفر لك نظرة شاملة على مواعيد استحقاق المهام</p>
                </div>
            )}
        </div>
    );
};
