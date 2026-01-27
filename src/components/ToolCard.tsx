"use client";
import React from 'react';
import { Tool } from '@/data/tools';
import {
    Calculator, Percent, Wallet, ArrowRightLeft, Landmark, HandCoins, Bitcoin,
    Moon, CalendarClock, Timer, Globe, AlignRight, Eraser, CaseSensitive, Hash,
    Link, QrCode, Ruler, Lock, Gauge, Smartphone, PenTool, Lightbulb, SearchCheck,
    Calendar, Sun, Files, Scissors, Minimize2, Image, FileText, ListOrdered,
    RotateCw, Stamp, Unlock, FileMinus, ArrowUpDown, Crop, ImageMinus, Maximize,
    Zap, Layers, Camera, Share2, Square, EyeOff, Sliders, Activity, Flame, Droplet,
    Braces, Binary, Fingerprint, Regex, GitCompare, Key, Database, Shield, Clock,
    Terminal, Monitor, Code, GraduationCap, Languages, CheckCircle2, Trophy,
    Dribbble, Flag, Swords, TimerReset, Palette, Shuffle, Music, Mic, Smile, Wind,
    Box, Star, Grid
} from 'lucide-react';

// Map string names to Lucide components
const IconMap: { [key: string]: any } = {
    'calculator': Calculator, 'percent': Percent, 'wallet': Wallet,
    'arrow-right-left': ArrowRightLeft, 'landmark': Landmark, 'hand-coins': HandCoins,
    'bitcoin': Bitcoin, 'moon': Moon, 'calendar-clock': CalendarClock, 'timer': Timer,
    'globe': Globe, 'align-right': AlignRight, 'eraser': Eraser, 'case-sensitive': CaseSensitive,
    'hash': Hash, 'link': Link, 'link-2': Link, 'qr-code': QrCode, 'ruler': Ruler,
    'lock': Lock, 'gauge': Gauge, 'smartphone': Smartphone, 'pen-tool': PenTool,
    'lightbulb': Lightbulb, 'search-check': SearchCheck, 'calendar': Calendar, 'sun': Sun,
    'files': Files, 'scissors': Scissors, 'minimize-2': Minimize2, 'image': Image,
    'file-text': FileText, 'list-ordered': ListOrdered, 'rotate-cw': RotateCw, 'stamp': Stamp,
    'unlock': Unlock, 'file-minus': FileMinus, 'arrow-up-down': ArrowUpDown, 'crop': Crop,
    'image-minus': ImageMinus, 'maximize': Maximize, 'zap': Zap, 'layers': Layers,
    'camera': Camera, 'share-2': Share2, 'square': Square, 'eye-off': EyeOff,
    'sliders': Sliders, 'activity': Activity, 'fire': Flame, 'droplet': Droplet,
    'braces': Braces, 'binary': Binary, 'fingerprint': Fingerprint, 'regex': Regex,
    'git-compare': GitCompare, 'key': Key, 'database': Database, 'shield': Shield,
    'clock': Clock, 'terminal': Terminal, 'monitor': Monitor, 'code': Code,
    'graduation-cap': GraduationCap, 'languages': Languages, 'check-circle-2': CheckCircle2,
    'trophy': Trophy, 'dribbble': Dribbble, 'flag': Flag, 'swords': Swords,
    'timer-reset': TimerReset, 'palette': Palette, 'shuffle': Shuffle, 'music': Music,
    'mic': Mic, 'smile': Smile, 'wind': Wind, 'box': Box, 'star': Star, 'grid': Grid,
    'calendar-heart': Calendar, 'align-left': AlignRight // Fallbacks
};

interface ToolCardProps {
    tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
    const IconComponent = IconMap[tool.icon] || Box;

    return (
        <div className="glass-panel tool-card animated-card">
            <div className="bg-blob"></div>
            <div className="card-content-wrapper">
                {/* Favorite Button Stub */}
                <button aria-label="Add to favorites" className="fav-btn absolute top-[15px] right-[15px] bg-transparent border-none cursor-pointer z-[5]">
                    <Star size={20} color="rgba(255,255,255,0.3)" />
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
