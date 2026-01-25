
"use client";
import React from 'react';
import { signIn } from "next-auth/react"
import { Github, Linkedin } from 'lucide-react';
import Modal from '@/components/Modal';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {

    const handleLogin = (provider: string) => {
        signIn(provider, { callbackUrl: '/beta' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تسجيل الدخول">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', padding: '10px' }}>
                <p style={{ color: '#aaa', textAlign: 'center', marginBottom: '20px' }}>
                    سجل دخولك لحفظ أدواتك المفضلة والوصول للميزات الحصرية.
                </p>

                <button
                    onClick={() => handleLogin('google')}
                    className="login-btn"
                    style={{ background: 'white', color: '#333' }}
                >
                    <img src="https://authjs.dev/img/providers/google.svg" width={20} height={20} alt="Google" />
                    <span>Google</span>
                </button>

                <button
                    onClick={() => handleLogin('github')}
                    className="login-btn"
                    style={{ background: '#24292e', color: 'white' }}
                >
                    <Github size={20} />
                    <span>GitHub</span>
                </button>

                <button
                    onClick={() => handleLogin('linkedin')}
                    className="login-btn"
                    style={{ background: '#0077b5', color: 'white' }}
                >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                </button>

                <style jsx>{`
                    .login-btn {
                        display: flex; alignItems: center; justify-content: center; gap: 12px;
                        width: 100%; padding: 14px; border-radius: 12px; font-weight: 600;
                        border: none; cursor: pointer; transition: transform 0.2s;
                        font-family: inherit; font-size: 16px;
                    }
                    .login-btn:hover { transform: scale(1.02); }
                    .login-btn:active { transform: scale(0.98); }
                `}</style>
            </div>
        </Modal>
    );
}
