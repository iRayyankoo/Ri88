import React, { useState } from 'react';
import { tools } from '@/data/tools';
import { Search, Edit, Trash2, Eye, Plus, FileText } from 'lucide-react';

export default function ContentView() {
    const [tab, setTab] = useState<'tools' | 'blog'>('tools');
    const [search, setSearch] = useState('');

    const filteredTools = tools.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.titleAr.includes(search)
    );

    return (
        <div className="animate-fade-in">
            {/* Sub-Tabs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0' }}>
                <button
                    onClick={() => setTab('tools')}
                    style={{ padding: '10px 0', background: 'none', border: 'none', color: tab === 'tools' ? 'white' : '#666', borderBottom: tab === 'tools' ? '2px solid var(--accent-pink)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600 }}
                >
                    Tools Inventory ({tools.length})
                </button>
                <button
                    onClick={() => setTab('blog')}
                    style={{ padding: '10px 0', background: 'none', border: 'none', color: tab === 'blog' ? 'white' : '#666', borderBottom: tab === 'blog' ? '2px solid var(--accent-pink)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600 }}
                >
                    Blog Posts (Mock)
                </button>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        placeholder={tab === 'tools' ? "Search tools..." : "Search posts..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 10px 10px 40px', borderRadius: '8px', color: 'white', outline: 'none' }}
                    />
                </div>
                <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Add New {tab === 'tools' ? 'Tool' : 'Post'}
                </button>
            </div>

            {/* Content List */}
            {tab === 'tools' ? (
                <div style={{ background: 'rgba(25, 25, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', color: '#888', fontSize: '0.85em', textTransform: 'uppercase' }}>
                            <tr>
                                <th style={{ padding: '16px 24px' }}>Tool Name</th>
                                <th style={{ padding: '16px' }}>Category</th>
                                <th style={{ padding: '16px' }}>ID</th>
                                <th style={{ padding: '16px' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTools.slice(0, 10).map((tool, idx) => (
                                <tr key={tool.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95em' }}>
                                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {/* Lucide Dynamic Icon placeholder or just generic */}
                                            <FileText size={16} color="#aaa" />
                                        </div>
                                        <div>
                                            <div style={{ color: 'white', fontWeight: 500 }}>{tool.title}</div>
                                            <div style={{ fontSize: '0.85em', color: '#666' }}>{tool.titleAr}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(109, 76, 255, 0.1)', color: '#D35BFF', fontSize: '0.85em' }}>
                                            {tool.cat}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#666', fontFamily: 'monospace' }}>{tool.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00E096', borderRadius: '50%', marginRight: '8px' }}></span>
                                        Active
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                            <button style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa' }}><Edit size={16} /></button>
                                            <button style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa' }}><Eye size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '0.9em', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        Showing top 10 of {filteredTools.length} tools
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#666', border: '2px dashed #333', borderRadius: '16px' }}>
                    <div style={{ marginBottom: '16px', opacity: 0.5 }}><FileText size={48} /></div>
                    <h3>Blog Module is Empty</h3>
                    <p>No posts created yet. Start writing your first article!</p>
                </div>
            )}
        </div>
    );
}
