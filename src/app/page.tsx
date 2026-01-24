"use client";
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';

import Hero from '@/components/Hero';
import ToolCard from '@/components/ToolCard';
import Modal from '@/components/Modal';
import ToolRouter from '@/components/tools/ToolRouter';
import { tools, categories, Tool } from '@/data/tools';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  // Filtering Logic
  const filteredTools = useMemo(() => {
    let res = tools;

    // Category Filter
    if (activeCat !== 'all') {
      if (activeCat === 'favorites') {
        // TODO: Implement favorites logic later
        res = [];
      } else {
        res = res.filter(t => t.cat === activeCat);
      }
    }

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter(t =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.titleAr && t.titleAr.includes(q)) ||
        (t.desc && t.desc.toLowerCase().includes(q)) ||
        (t.descAr && t.descAr.includes(q))
      );
    }

    return res;
  }, [activeCat, searchQuery]);

  const handleToolClick = (tool: Tool) => {
    // Special Redirects
    if (['sport-football', 'sport-basket', 'sport-motor', 'sport-combat', 'sport-world'].includes(tool.id)) {
      router.push('/sports');
      return;
    }
    setActiveTool(tool);
  };

  return (
    <>

      <Navbar />
      <Hero />

      <main className="categories-section" id="tools" style={{ paddingTop: '50px' }}>

        {/* Search & Header */}
        <div className="section-header" style={{ flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ fontSize: '2em' }}>
            جميع الأدوات
            <span id="totalToolsCount" style={{ fontSize: '0.6em', opacity: 0.7, marginRight: '10px' }}>
              ({filteredTools.length})
            </span>
          </h2>
          <input
            type="text"
            placeholder="ابحث عن أداة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '50px',
              width: '300px',
              outline: 'none',
              textAlign: 'right' // RTL
            }}
          />
        </div>

        {/* Categories (Horizontal/Wrap) */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className="glass-panel"
              onClick={() => setActiveCat(cat.id)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                border: activeCat === cat.id ? '1px solid var(--accent-pink)' : '1px solid var(--glass-border)',
                background: activeCat === cat.id ? 'rgba(211, 91, 255, 0.2)' : 'var(--glass-bg)',
                color: activeCat === cat.id ? 'white' : 'var(--text-secondary)',
                borderRadius: '12px',
                transition: 'all 0.2s',
                fontWeight: '600'
              }}
            >
              {cat.nameAr}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="tools-grid">
          {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
              <div key={tool.id} onClick={() => handleToolClick(tool)}>
                <ToolCard tool={tool} />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
              لا توجد أدوات مطابقة للبحث.
            </div>
          )}
        </div>

      </main>

      {/* Footer Stub */}
      <footer className="fat-footer" style={{ marginTop: '100px', padding: '50px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ textAlign: 'center', opacity: 0.6 }}>
          &copy; 2026 بوابة ريان. الإصدار Next.js v1.0
        </div>
      </footer>

      {/* Global Modal */}
      <Modal
        isOpen={!!activeTool}
        onClose={() => setActiveTool(null)}
        title={activeTool?.titleAr || activeTool?.title || ''}
      >
        {activeTool && (
          <>
            {/* Route to specific tool logic */}
            <ToolRouter tool={activeTool} />
          </>
        )}
      </Modal>
    </>
  );
}
