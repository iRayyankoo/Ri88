import React from 'react';

interface WidgetTemplateProps {
    title: string;
    icon: React.ElementType;
    value?: React.ReactNode;
    meta?: React.ReactNode;
    children?: React.ReactNode;
    className?: string; // For gradients or specific overrides if permitted
}

export default function WidgetTemplate({ title, icon: Icon, value, meta, children, className }: WidgetTemplateProps) {
    return (
        <div className={`h-full flex flex-col justify-between ${className || ''}`}>
            {/* Top Row: Title (Right) & Icon (Left in RTL) */}
            <div className="flex justify-between items-start w-full relative">
                <span className="text-[13px] font-medium text-[#888] tracking-wide">{title}</span>
                <div className="bg-white/5 p-1.5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                    <Icon size={16} />
                </div>
            </div>

            {/* Middle: Big Value OR Custom Children */}
            <div className="flex-1 flex flex-col justify-center my-2">
                {value ? (
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/80">
                        {value}
                    </div>
                ) : (
                    children
                )}
            </div>

            {/* Bottom: Meta / Description */}
            <div className="text-[12px] text-[#666] font-medium flex items-center gap-1.5 min-h-[16px]">
                {meta}
            </div>
        </div>
    );
}
