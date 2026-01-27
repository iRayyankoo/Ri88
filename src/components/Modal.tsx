"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
// X unused
// import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    // User provided CSS vars mapped to JS
    const vars = {
        bg: '#070A12',
        card: 'rgba(255,255,255,.06)',
        stroke: 'rgba(255,255,255,.10)',
        text: 'rgba(255,255,255,.92)',
        shadow: '0 24px 80px rgba(0,0,0,.55)',
        r: '22px',
        g1: '#8C40FF',
        g2: '#3B82F6'
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="ai-modal"
                onClick={e => e.stopPropagation()}
            >
                <div className="ai-header">
                    <button className="ai-close" onClick={onClose} aria-label="إغلاق">×</button>
                    <h2>{title}</h2>
                </div>

                <div className="ai-body">
                    {children}
                </div>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; inset: 0; z-index: 99999;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s ease;
                }

                .ai-modal {
                    width: min(920px, 92vw);
                    max-width: ${maxWidth};
                    max-height: 85vh;
                    overflow-y: auto;
                    border-radius: ${vars.r};
                    background: 
                        radial-gradient(900px 420px at 85% -10%, rgba(59,130,246,.35), transparent 60%),
                        radial-gradient(700px 380px at 10% 110%, rgba(140,64,255,.25), transparent 60%),
                        linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
                    background-color: ${vars.bg}; /* Fallback base */
                    border: 1px solid ${vars.stroke};
                    box-shadow: ${vars.shadow};
                    font-family: "Tajawal","Cairo",system-ui;
                    color: ${vars.text};
                    position: relative;
                    animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .ai-header {
                    position: relative;
                    padding: 22px 24px 16px;
                    border-bottom: 1px solid rgba(255,255,255,.08);
                    text-align: right; /* Default RTL alignment */
                }
                
                .ai-header h2 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: .2px;
                    color: ${vars.text};
                }

                /* Close Button - Left aligned as per RTL spec */
                .ai-close {
                    position: absolute;
                    left: 16px; 
                    top: 14px;
                    width: 42px; height: 42px;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,.10);
                    background: rgba(255,255,255,.06);
                    color: ${vars.text};
                    font-size: 24px;
                    cursor: pointer;
                    transition: .18s ease;
                    display: flex; align-items: center; justify-content: center;
                    padding-bottom: 4px; /* Center 'x' visually */
                }
                .ai-close:hover {
                    transform: translateY(-1px) scale(1.03);
                    box-shadow: 0 10px 30px rgba(59,130,246,.25);
                    background: rgba(255,255,255,.1);
                }

                .ai-body { padding: 18px 24px 22px; direction: rtl; }

                @keyframes modalSlideUp {
                    from { transform: translateY(20px) scale(0.98); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
    );
}
