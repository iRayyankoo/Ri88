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

      <main className="categories-section" id="tools">
        {/* Search & Header */}
        <div className="section-header">
          <h2>
            جميع الأدوات
            <span id="totalToolsCount" className="total-count">
              ({filteredTools.length})
            </span>
          </h2>
          <input
            type="text"
            className="search-input"
            placeholder="ابحث عن أداة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories (Horizontal/Wrap) */}
        <div className="categories-wrapper">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`glass-panel category-btn ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
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
            <div className="no-results">
              لا توجد أدوات مطابقة للبحث.
            </div>
          )}
        </div>

      </main>



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

      <style jsx>{`
        .categories-section { padding-top: 50px; }
        .section-header { display: flex; flex-wrap: wrap; gap: 20px; }
        .section-header h2 { font-size: 2em; }
        .total-count { font-size: 0.6em; opacity: 0.7; margin-right: 10px; }
        
        .search-input {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          width: 300px;
          outline: none;
          text-align: right;
        }

        .categories-wrapper { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 40px; }
        
        .category-btn {
          padding: 10px 20px;
          cursor: pointer;
          border: 1px solid var(--glass-border);
          background: var(--glass-bg);
          color: var(--text-secondary);
          border-radius: 12px;
          transition: all 0.2s;
          font-weight: 600;
        }
        .category-btn.active {
          border: 1px solid var(--accent-pink);
          background: rgba(211, 91, 255, 0.2);
          color: white;
        }

        .no-results { grid-column: 1/-1; text-align: center; padding: 50px; color: #888; }
      `}</style>
    </>
  );
}
