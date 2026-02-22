"use client";
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 1. Tool Input (Text / Number)
type ToolInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const ToolInput = React.memo(React.forwardRef<HTMLInputElement, ToolInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative group/input">
                <input
                    ref={ref}
                    className={cn(
                        "w-full bg-[#050507]/40 border border-white/10 rounded-[20px] px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all font-cairo font-bold text-lg backdrop-blur-xl",
                        className
                    )}
                    {...props}
                />
                <div className="absolute inset-0 rounded-[20px] pointer-events-none border border-brand-primary/0 group-focus-within/input:border-brand-primary/20 transition-all duration-500" />
            </div>
        );
    }
));
ToolInput.displayName = "ToolInput";

// 2. Tool Textarea
type ToolTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const ToolTextarea = React.memo(React.forwardRef<HTMLTextAreaElement, ToolTextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative group/input">
                <textarea
                    ref={ref}
                    className={cn(
                        "w-full bg-[#050507]/40 border border-white/10 rounded-[20px] px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all font-cairo font-bold text-lg backdrop-blur-xl resize-none min-h-[120px]",
                        className
                    )}
                    {...props}
                />
                <div className="absolute inset-0 rounded-[20px] pointer-events-none border border-brand-primary/0 group-focus-within/input:border-brand-primary/20 transition-all duration-500" />
            </div>
        );
    }
));
ToolTextarea.displayName = "ToolTextarea";

// 3. Tool Button
interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'iridescent';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const toolButtonVariants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-[0_20px_50px_rgba(139,92,246,0.2)] border border-brand-primary/50",
    iridescent: "bg-gradient-to-br from-brand-primary via-violet-500 to-indigo-600 text-white shadow-[0_20px_60px_rgba(139,92,246,0.3)] border-t border-white/20 hover:scale-[1.02] hover:brightness-110",
    secondary: "bg-white/[0.03] text-slate-200 hover:bg-white/[0.08] border border-white/[0.05] backdrop-blur-md",
    outline: "bg-transparent border border-white/10 text-slate-300 hover:border-white/30 hover:text-white backdrop-blur-sm",
    ghost: "bg-transparent text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5"
};

export const toolButtonSizes = {
    sm: "px-4 py-2 text-xs font-black rounded-xl",
    md: "px-8 py-3.5 text-sm font-black rounded-2xl",
    lg: "px-10 py-5 text-base font-black rounded-[24px]",
    xl: "px-12 py-6 text-xl font-black rounded-[28px] tracking-tight"
};

export const ToolButton = React.memo(React.forwardRef<HTMLButtonElement, ToolButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                    "flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none font-cairo uppercase tracking-tight",
                    toolButtonVariants[variant],
                    toolButtonSizes[size],
                    className
                )}
                {...props as HTMLMotionProps<"button">}
            />
        );
    }
));
ToolButton.displayName = "ToolButton";

// 5. Tool Select
type ToolSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const ToolSelect = React.memo(React.forwardRef<HTMLSelectElement, ToolSelectProps>(
    (props, ref) => {
        const { className, children, title, "aria-label": ariaLabel, id, ...rest } = props;

        // Ensure we always have an accessible name
        const finalTitle = title || "قائمة خيارات الاختيار";
        const finalAriaLabel = ariaLabel || (typeof title === 'string' ? title : finalTitle);

        return (
            <div className="relative group/input">
                <select
                    {...rest}
                    id={id}
                    ref={ref}
                    title={finalTitle}
                    aria-label={finalAriaLabel}
                    className={cn(
                        "w-full bg-[#050507]/40 border border-white/10 rounded-[20px] px-5 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all font-cairo font-bold text-lg backdrop-blur-xl",
                        className
                    )}
                >
                    {children}
                </select>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/input:text-brand-primary transition-colors">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="absolute inset-0 rounded-[20px] pointer-events-none border border-brand-primary/0 group-focus-within/input:border-brand-primary/20 transition-all duration-500" />
            </div>
        );
    }
));
ToolSelect.displayName = "ToolSelect";

// 4. Tool Checkbox (Label Wrapper)
export const ToolCheckbox = React.memo(({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => {
    return (
        <label className={cn(
            "flex items-center gap-4 p-5 rounded-[22px] border transition-all cursor-pointer select-none backdrop-blur-xl",
            checked
                ? "bg-brand-primary/10 border-brand-primary/30 text-white shadow-[0_10px_30px_rgba(139,92,246,0.1)]"
                : "bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:border-white/10"
        )}>
            <div className={cn(
                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500",
                checked
                    ? "bg-brand-primary border-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/30"
                    : "bg-black/40 border-white/20"
            )}>
                {checked && (
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xs font-black"
                    >
                        ✓
                    </motion.span>
                )}
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="hidden"
            />
            <span className="text-base font-black font-cairo">{label}</span>
        </label>
    );
});
ToolCheckbox.displayName = "ToolCheckbox";
