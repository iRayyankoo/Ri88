
"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, Lock, User, Calendar } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { useParams } from 'next/navigation';

export default function ArticlePage() {
    const params = useParams();
    const { slug } = params;

    const post = blogPosts.find(p => p.id === slug);

    if (!post) {
        return (
            <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
                <h1>Article not found</h1>
                <Link href="/blog" style={{ color: 'var(--accent-pink)' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <div style={{ background: '#F9F7F2', minHeight: '100vh', color: '#1A1A1A', fontFamily: 'var(--font-arabic)' }}>

            {/* Custom Nav for Article (Light Mode) */}
            <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#333', fontWeight: 500 }}>
                    <ArrowRight size={20} />
                    <span>العودة للمقالات</span>
                </Link>
                <Link href="/" style={{ fontWeight: 900, fontSize: '20px', textDecoration: 'none', color: '#000' }}>
                    Ri88.
                </Link>
            </nav>

            <article style={{ maxWidth: '800px', margin: '40px auto 100px auto', padding: '0 20px' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5em', fontWeight: 700, lineHeight: 1.3, marginBottom: '20px' }}>{post.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', color: '#666', fontSize: '0.95em' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#d63031' }}>
                            <User size={18} />
                            <span>{post.author}</span>
                        </div>
                        <span>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} />
                            <span>{post.date}</span>
                        </div>
                        <span>•</span>
                        <span>{post.category}</span>
                    </div>
                </header>

                {/* Sponsor/Banner Placeholder */}
                <div style={{ background: '#111', color: 'white', padding: '15px 30px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0' }}>
                    <span>بدعم من</span>
                    <div style={{ fontFamily: 'monospace', letterSpacing: '2px', fontWeight: 'bold' }}>CINEMA</div>
                </div>

                {/* Body Content */}
                <div className="article-body" style={{ fontSize: '1.2em', lineHeight: 1.8 }}>
                    {post.content ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    ) : (
                        <p>
                            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
                        </p>
                    )}
                </div>

                {/* Premium Footer */}
                <div style={{
                    border: '2px solid #FFD700',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '60px',
                    background: 'white',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Lock color="orange" size={24} />
                        <div>
                            <strong style={{ display: 'block' }}>المزيد من المحتوى الحصري؟</strong>
                            <span style={{ background: '#FFD700', color: 'black', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold' }}>للمشتركين فقط</span>
                        </div>
                    </div>
                    <button style={{ background: 'black', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                        اشترك الآن
                    </button>
                </div>

            </article>
        </div>
    )
}
