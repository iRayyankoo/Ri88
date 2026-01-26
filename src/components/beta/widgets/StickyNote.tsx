"use client";
import React, { useState, useEffect } from 'react';
import { StickyNote as NoteIcon } from 'lucide-react';

export default function StickyNoteWidget() {
    const [note, setNote] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('ri88_note_content');
        if (saved) setNote(saved);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setNote(val);
        localStorage.setItem('ri88_note_content', val);
    };

    return (
        <div className="note-container">
            <textarea
                className="note-area"
                placeholder="اكتب أفكارك هنا..."
                style={{ marginTop: '20px' }}
                value={note}
                onChange={handleChange}
                spellCheck={false}
            ></textarea>

            <style jsx>{`
                .note-container {
                    height: 100%; display: flex; flex-direction: column;
                }
                .note-header {
                    display: flex; alignItems: center; gap: 8px; font-size: 14px; font-weight: 700; color: #F59E0B;
                    margin-bottom: 10px;
                }
                .note-area {
                    flex: 1; width: 100%; background: rgba(245, 158, 11, 0.1);
                    border: none; border-radius: 12px; padding: 15px;
                    color: #fff; font-family: inherit; font-size: 14px; line-height: 1.6;
                    resize: none; outline: none; transition: background 0.2s;
                }
                .note-area:focus { background: rgba(245, 158, 11, 0.15); }
                .note-area::placeholder { color: rgba(255,255,255,0.3); }
            `}</style>
        </div>
    );
}
