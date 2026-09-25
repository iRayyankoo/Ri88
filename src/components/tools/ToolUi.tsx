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
                        "w-full h-11 sm:h-12 bg-surface-base border border-border-subtle rounded-xl px-4 text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all font-cairo font-semibold text-sm sm:text-base backdrop-blur-md shadow-inner",
                        className
                    )}
                    {...props}
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-brand-primary/0 group-focus-within/input:border-brand-primary/30 transition-all duration-300" />
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
                        "w-full bg-surface-base border border-border-subtle rounded-xl p-4 text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all font-cairo font-semibold text-sm sm:text-base backdrop-blur-md shadow-inner resize-none min-h-[110px]",
                        className
                    )}
                    {...props}
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-brand-primary/0 group-focus-within/input:border-brand-primary/30 transition-all duration-300" />
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
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md shadow-brand-primary/20 border border-brand-primary/50",
    iridescent: "bg-gradient-to-r from-brand-primary via-emerald-600 to-teal-500 text-white shadow-md shadow-brand-primary/25 border-t border-white/20 hover:brightness-110",
    secondary: "bg-surface-glass text-text-primary hover:bg-surface-raised border border-border-subtle backdrop-blur-md shadow-sm",
    outline: "bg-transparent border border-border-subtle text-text-primary hover:border-brand-primary/40 hover:bg-surface-glass backdrop-blur-sm",
    ghost: "bg-transparent text-text-muted hover:text-brand-primary hover:bg-brand-primary/5"
};

export const toolButtonSizes = {
    sm: "px-3.5 py-1.5 text-xs font-bold rounded-lg",
    md: "px-5 py-2.5 text-sm font-bold rounded-xl",
    lg: "px-7 py-3 text-base font-bold rounded-xl",
    xl: "px-9 py-4 text-lg font-bold rounded-2xl"
};

export const ToolButton = React.memo(React.forwardRef<HTMLButtonElement, ToolButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "flex items-center justify-center gap-2.5 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none font-cairo font-bold cursor-pointer select-none",
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

        const finalTitle = title || "قائمة الخيارات";
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
                        "w-full h-11 sm:h-12 bg-surface-base border border-border-subtle rounded-xl px-4 text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all font-cairo font-semibold text-sm sm:text-base backdrop-blur-md shadow-inner",
                        className
                    )}
                >
                    {children}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-focus-within/input:text-brand-primary transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="absolute inset-0 rounded-xl pointer-events-none border border-brand-primary/0 group-focus-within/input:border-brand-primary/30 transition-all duration-300" />
            </div>
        );
    }
));
ToolSelect.displayName = "ToolSelect";

// 4. Tool Checkbox (Label Wrapper)
export const ToolCheckbox = React.memo(({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => {
    return (
        <label className={cn(
            "flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none backdrop-blur-md",
            checked
                ? "bg-brand-primary/10 border-brand-primary/30 text-text-primary shadow-sm"
                : "bg-surface-glass border-border-subtle text-text-muted hover:bg-surface-raised"
        )}>
            <div className={cn(
                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                checked
                    ? "bg-brand-primary border-brand-primary text-white shadow-sm"
                    : "bg-surface-base border-border-subtle"
            )}>
                {checked && (
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xs font-bold"
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
            <span className="text-sm font-bold font-cairo">{label}</span>
        </label>
    );
});
ToolCheckbox.displayName = "ToolCheckbox";
