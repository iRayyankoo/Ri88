"use client";
import React, { useEffect } from 'react';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Moyasar: any;
    }
}

interface MoyasarPaymentProps {
    amount: number; // Amount in Halalas (e.g., 1000 = 10 SAR)
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onComplete?: (payment: any) => void;
}

const MoyasarPayment: React.FC<MoyasarPaymentProps> = ({ amount, description, onComplete }) => {
    useEffect(() => {
        // Dynamically load Moyasar library and styles
        const script = document.createElement('script');
        script.src = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.js';
        script.async = true;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.moyasar.com/mpf/1.14.0/moyasar.css';

        document.head.appendChild(link);
        document.body.appendChild(script);

        script.onload = () => {
            if (window.Moyasar) {
                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: amount,
                    currency: 'SAR',
                    description: description,
                    publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
                    callback_url: window.location.href, // Or custom success page
                    methods: ['creditcard', 'stcpay', 'applepay'],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    on_completed: function (payment: any) {
                        return new Promise<void>((resolve) => {
                            if (onComplete) onComplete(payment);
                            resolve();
                        });
                    }
                });
            }
        };

        return () => {
            if (document.head.contains(link)) document.head.removeChild(link);
            if (document.body.contains(script)) document.body.removeChild(script);
        };
    }, [amount, description]);

    return (
        <div className="w-full">
            <style jsx global>{`
                /* Container */
                .mysr-form {
                    max-width: 100% !important;
                    font-family: 'Inter', sans-serif !important;
                }

                /* Input Names/Labels */
                .mysr-form label {
                    color: #94A3B8 !important; /* text-slate-400 */
                    font-size: 0.875rem !important;
                    font-weight: 500 !important;
                    margin-bottom: 0.5rem !important;
                }

                /* Inputs Fields */
                .mysr-form input[type="text"],
                .mysr-form input[type="email"],
                .mysr-form input[type="tel"],
                .mysr-form input[type="number"],
                .mysr-form select {
                    background-color: #0D0D0F !important; /* bg-[#0D0D0F] aka site background */
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    height: 48px !important;
                    border-radius: 12px !important;
                    transition: border-color 0.2s, box-shadow 0.2s !important;
                }

                .mysr-form input[type="text"]:focus,
                .mysr-form input[type="email"]:focus,
                .mysr-form input[type="tel"]:focus,
                .mysr-form input[type="number"]:focus,
                .mysr-form select:focus {
                    border-color: #059669 !important; /* brand-primary */
                    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2) !important;
                    outline: none !important;
                }

                .mysr-form input::placeholder {
                    color: #475569 !important; /* text-slate-600 */
                }

                /* Button */
                .mysr-form button {
                    background-color: #059669 !important; /* brand-primary */
                    color: white !important;
                    height: 50px !important;
                    border-radius: 9999px !important; /* Rounded Full */
                    font-weight: 700 !important;
                    font-size: 1rem !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                    transition: all 0.2s !important;
                    border: none !important;
                    margin-top: 1rem !important;
                }

                .mysr-form button:hover {
                    background-color: #047857 !important; /* emerald-700 */
                    transform: translateY(-1px) !important;
                }

                /* Payment Methods Group (Credit Card / Apple Pay icons) */
                .mysr-payment-methods {
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 12px !important;
                    overflow: hidden !important;
                }
                
                .mysr-payment-methods > div {
                    background-color: #13131A !important;
                    border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
                }

                .mysr-payment-methods > div:last-child {
                    border-right: none !important;
                }

                .mysr-payment-methods > div.active {
                    background-color: rgba(5, 150, 105, 0.1) !important; /* brand-primary/10 */
                    color: #059669 !important;
                }
            `}</style>

            <div className="mysr-form" dir="ltr">
                {/* Moyasar form will be injected here */}
            </div>
        </div>
    );
};

export default MoyasarPayment;
