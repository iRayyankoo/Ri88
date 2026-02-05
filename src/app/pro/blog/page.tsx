
"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import { blogPosts } from '@/data/blog';

export default function BlogPage() {
    const heroPost = blogPosts.find(p => p.id === 'hero-article') || blogPosts[0];
    const bentoPosts = blogPosts.filter(p => p.id !== 'hero-article');

    return (
        <div style={{ background: '#0B1026', minHeight: '100vh', color: 'white' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '100px', maxWidth: '1400px', margin: '0 auto', paddingBottom: '100px' }}>

                {/* Creative Hero */}
                <section className="creative-hero" style={{
                    position: 'relative',
                    padding: '40px 5%',
                    marginBottom: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '40px',
                    background: 'radial-gradient(circle at 10% 20%, rgba(109, 76, 255, 0.15) 0%, transparent 40%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ maxWidth: '600px', zIndex: 2 }}>
                        <span style={{
                            background: 'rgba(255, 184, 107, 0.2)',
                            color: '#ffb86b',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '0.9em',
                            fontWeight: 700,
                            display: 'inline-block',
                            marginBottom: '16px'
                        }}>
                            ✨ Featured Story
                        </span>
                        <h1 style={{
                            fontSize: '3em',
                            fontWeight: 900,
                            lineHeight: 1.1,
                            marginBottom: '20px',
                            background: 'linear-gradient(135deg, #fff 60%, #b8c0d9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {heroPost.title}
                        </h1>
                        <p style={{ fontSize: '1.2em', opacity: 0.8, marginBottom: '30px', lineHeight: 1.6 }}>
                            {heroPost.content?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px 16px 6px 6px', borderRadius: '50px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={16} />
                                </div>
                                <span style={{ fontWeight: 700 }}>{heroPost.author}</span>
                            </div>

                            <Link href={`/blog/${heroPost.id}`}>
                                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Read Article <ArrowRight size={18} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual 3D */}
                    <div className="hero-visual" style={{ position: 'relative', width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            src={heroPost.image}
                            style={{
                                width: '300px',
                                height: '380px',
                                objectFit: 'cover',
                                borderRadius: '24px',
                                transform: 'rotate(-3deg)',
                                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        />
                    </div>
                </section>

                {/* Bento Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    padding: '0 5%'
                }}>
                    {bentoPosts.map((post, idx) => (
                        <Link href={`/blog/${post.id}`} key={idx} className="glass-panel" style={{
                            textDecoration: 'none',
                            color: 'white',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '300px',
                            position: 'relative',
                            transition: 'transform 0.3s'
                        }}>
                            <div style={{ height: '60%', overflow: 'hidden' }}>
                                <img src={post.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400/222/fff'} />
                            </div>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '1.2em', fontWeight: 700, margin: 0 }}>{post.title}</h3>
                                <div style={{ fontSize: '0.8em', opacity: 0.6, marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span>{post.author}</span>
                                    <span>•</span>
                                    <span style={{ color: 'var(--accent-pink)' }}>{post.category}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    );
}
