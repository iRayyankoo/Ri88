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
                inset: 0, // Top/Left/Right/Bottom: 0
                zIndex: 99999
            }}
        >
            <div
                className="modal-window glass-panel"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    padding: '32px',
                    position: 'relative',
                    animation: 'fadeIn 0.3s ease-out'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
