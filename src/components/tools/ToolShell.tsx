"use client";
import React from 'react';
import { Copy, Check, Info } from 'lucide-react';

interface ToolShellProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
}

export function ToolShell({ title, description, children, className = '', footer }: ToolShellProps) {
    return (
        <div className={`tool-shell ${className}`} dir="rtl">
            {(title || description) && (
                <div className="tool-header">
                    {title && <h2 className="tool-title">{title}</h2>}
                    {description && <p className="tool-desc">{description}</p>}
                </div>
            )}

            <div className="tool-body">
                {children}
            </div>

            {footer && (
                <div className="tool-footer">
                    {footer}
                </div>
            )}
        </div>
    );
}

// --- Helper Subcomponents for stricter layout usage ---

export function ToolInputRow({ label, children }: { label: string, children: React.ReactNode }) {
    return (
        <div className="ui-mb-4">
            <label className="ui-label">{label}</label>
            {children}
        </div>
    );
}

export function ToolOutput({ content, label = "النتيجة" }: { content: string, label?: string }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!content) return null;

    return (
        <div className="ui-output">
            <div className="ui-output-header">
                <span className="ui-output-label">{label}</span>
                <button
                    onClick={handleCopy}
                    className="ui-btn ghost"
                    style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                </button>
            </div>
            <div className="ui-output-content">
                {content}
            </div>
        </div>
    );
}
