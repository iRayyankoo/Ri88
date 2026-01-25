"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            className="modal-overlay active"
            onClick={onClose}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    padding: '32px',
                    position: 'relative',
                    animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: '#181926',
                    borderRadius: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                    color: 'white'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: '#8890AA',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,50,50,0.2)'; e.currentTarget.style.color = '#ff4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8890AA'; }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ direction: 'rtl' }}>
                    {children}
                </div>
            </div>
            <style jsx global>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(20px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
    );
}
