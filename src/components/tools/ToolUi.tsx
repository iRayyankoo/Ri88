"use client";
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 1. Tool Input (Text / Number)
type ToolInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const ToolInput = React.forwardRef<HTMLInputElement, ToolInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium",
                    className
                )}
                {...props}
            />
        );
    }
);
ToolInput.displayName = "ToolInput";

// 2. Tool Textarea
type ToolTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const ToolTextarea = React.forwardRef<HTMLTextAreaElement, ToolTextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium resize-none leading-relaxed",
                    className
                )}
                {...props}
            />
        );
    }
);
ToolTextarea.displayName = "ToolTextarea";

// 3. Tool Button
interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const toolButtonVariants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 border border-brand-primary/50",
    secondary: "bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20 border border-brand-secondary/20",
    outline: "bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
};

export const toolButtonSizes = {
    sm: "px-3 py-1.5 text-xs font-bold rounded-lg",
    md: "px-6 py-3 text-sm font-bold rounded-xl",
    lg: "px-8 py-4 text-base font-bold rounded-2xl"
};

export const ToolButton = React.forwardRef<HTMLButtonElement, ToolButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
                    toolButtonVariants[variant],
                    toolButtonSizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
ToolButton.displayName = "ToolButton";

// 5. Tool Select
type ToolSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const ToolSelect = React.forwardRef<HTMLSelectElement, ToolSelectProps>(
    (props, ref) => {
        const { className, children, title, "aria-label": ariaLabel, id, ...rest } = props;
        return (
            <div className="relative">
                <select
                    {...rest}
                    id={id}
                    ref={ref}
                    title={title}
                    aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
                    className={cn(
                        "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all font-medium",
                        className
                    )}
                >
                    {children}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        );
    }
);
ToolSelect.displayName = "ToolSelect";

// 4. Tool Checkbox (Label Wrapper)
export const ToolCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => {
    return (
        <label className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none",
            checked
                ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
        )}>
            <div className={cn(
                "w-5 h-5 rounded-lg border flex items-center justify-center transition-colors",
                checked
                    ? "bg-brand-primary border-brand-primary text-white"
                    : "bg-black/20 border-white/20"
            )}>
                {checked && <span className="text-xs">✓</span>}
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="hidden"
            />
            <span className="text-sm font-bold">{label}</span>
        </label>
    );
};
