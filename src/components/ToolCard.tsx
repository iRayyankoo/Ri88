"use client";
import React from 'react';
import { Tool } from '@/data/tools';
import { IconMap } from './tools/IconMap';
import { Star, Box } from 'lucide-react';

import { useFavorites } from '@/context/FavoritesContext';

interface ToolCardProps {
    tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
    const IconComponent = IconMap[tool.icon] || Box;
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(tool.id);

    return (
        <div className="glass-panel tool-card animated-card">
            <div className="bg-blob"></div>
            <div className="card-content-wrapper">
                {/* Favorite Button */}
                <button 
                    aria-label={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"} 
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id, tool.titleAr || tool.title);
                    }}
                    className="fav-btn absolute top-[15px] right-[15px] bg-transparent border-none cursor-pointer z-[10] p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <Star 
                        size={20} 
                        className={`transition-colors ${isFav ? "text-yellow-400 fill-yellow-400" : "text-slate-400 hover:text-yellow-400"}`} 
                    />
                </button>

                <div className="tool-icon animated-icon">
                    <IconComponent size={32} />
                </div>

                <div>
                    <div className="tool-title">{tool.titleAr || tool.title}</div>
                    <div className="tool-desc">{tool.descAr || tool.desc}</div>
                </div>

                <div className="card-hover-reveal">
                    <button className="tool-action btn-secondary w-full p-2">
                        فتح الأداة
                    </button>
                </div>
            </div>
        </div>
    );
}
