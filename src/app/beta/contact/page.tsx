"use client";
import BetaPageLayout from '@/components/BetaPageLayout';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <BetaPageLayout title="تواصل معنا">
            <p>نحن هنا لمساعدتك. إذا كان لديك أي استفسار، اقتراح، أو واجهت مشكلة، لا تتردد في التواصل معنا عبر القنوات التالية.</p>
            <br />
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                    <Mail size={24} color="#D35BFF" />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>البريد الإلكتروني</div>
                        <div style={{ fontSize: '14px', color: '#888' }}>support@ri88.info</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                    <Phone size={24} color="#00E096" />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>الهاتف (واتساب)</div>
                        <div style={{ fontSize: '14px', color: '#888' }}>+966 50 000 0000</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                    <MapPin size={24} color="#00FFF2" />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>المقر</div>
                        <div style={{ fontSize: '14px', color: '#888' }}>الرياض، المملكة العربية السعودية</div>
                    </div>
                </div>
            </div>
        </BetaPageLayout>
    );
}
