"use client";
import React, { useState } from 'react';
import { ToolShell, ToolInputRow } from './ToolShell';
import { ToolButton, ToolTextarea } from './ToolUi';
import { motion } from 'framer-motion';
import { Dice5, Trophy } from 'lucide-react';

interface ToolProps {
    toolId: string;
}

// 1. Dice Roller
function DiceRoller() {
    const [value, setValue] = useState(6);
    const [rolling, setRolling] = useState(false);

    const roll = () => {
        setRolling(true);
        setTimeout(() => {
            setValue(Math.floor(Math.random() * 6) + 1);
            setRolling(false);
        }, 600);
    };

    return (
        <ToolShell description="رمي نرد عشوائي مع تأثيرات بصرية رائعة.">
            <div className="flex flex-col items-center justify-center space-y-12 py-10">
                <motion.div
                    animate={rolling ? {
                        rotate: [0, 90, 180, 270, 360],
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        y: [0, -50, 0, -20, 0]
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.1)] border-b-8 border-slate-300 relative group"
                >
                    <div className="text-6xl font-black text-black select-none">{value}</div>
                    <div className="absolute -top-1 right-2 w-3 h-3 bg-red-500 rounded-full" />
                </motion.div>

                <ToolButton
                    onClick={roll}
                    disabled={rolling}
                    className="px-12 py-6 text-xl"
                >
                    {rolling ? "جاري الرمي..." : "ارمي النرد"}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 2. Coin Flipper
function CoinFlipper() {
    const [side, setSide] = useState<'heads' | 'tails'>('heads');
    const [flipping, setFlipping] = useState(false);

    const flip = () => {
        setFlipping(true);
        setTimeout(() => {
            setSide(Math.random() > 0.5 ? 'heads' : 'tails');
            setFlipping(false);
        }, 800);
    };

    return (
        <ToolShell description="قلب عملة معدنية للاختيار بين أمرين (وجه أو ظهر).">
            <div className="flex flex-col items-center justify-center space-y-12 py-10">
                <div className="perspective-[1000px]">
                    <motion.div
                        animate={flipping ? {
                            rotateY: [0, 720, 1440],
                            y: [0, -150, 0],
                            scale: [1, 1.5, 1]
                        } : {}}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className={`w-32 h-32 rounded-full border-4 border-yellow-600 flex items-center justify-center text-3xl font-black transition-colors ${side === 'heads' ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-900' : 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-800'}`}
                    >
                        {side === 'heads' ? "وجه" : "ظهر"}
                    </motion.div>
                </div>

                <ToolButton
                    onClick={flip}
                    disabled={flipping}
                    variant="secondary"
                    className="px-12 py-6 text-xl border-yellow-500/20 text-yellow-500"
                >
                    {flipping ? "جاري القلب..." : "اقلب العملة"}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

// 3. Name Picker
function NamePicker() {
    const [input, setInput] = useState('');
    const [winner, setWinner] = useState<string | null>(null);
    const [picking, setPicking] = useState(false);

    const pick = () => {
        const names = input.split('\n').map(n => n.trim()).filter(n => n !== '');
        if (names.length < 2) return;

        setPicking(true);
        setWinner(null);

        setTimeout(() => {
            const idx = Math.floor(Math.random() * names.length);
            setWinner(names[idx]);
            setPicking(false);
        }, 1500);
    };

    return (
        <ToolShell
            description="اختر فائزاً عشوائياً من قائمة أسماء."
            results={winner && (
                <div className="text-center space-y-4">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
                    <div>
                        <p className="text-slate-400">الفائز هو</p>
                        <h2 className="text-4xl font-black text-white mt-1 uppercase tracking-widest">{winner}</h2>
                    </div>
                    <ToolButton variant="ghost" onClick={() => setWinner(null)}>إعادة المحاولة</ToolButton>
                </div>
            )}
        >
            <div className="space-y-4">
                <ToolInputRow label="قائمة الأسماء (اسم في كل سطر)">
                    <ToolTextarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="أحمد\nسارة\nفهد..."
                        className="h-48"
                    />
                </ToolInputRow>
                <ToolButton
                    onClick={pick}
                    disabled={picking || input.length < 5}
                    className="w-full h-16 text-lg"
                >
                    {picking ? "جاري السحب..." : "اختيار فائز"}
                </ToolButton>
            </div>
        </ToolShell>
    );
}

export default function GamingTools({ toolId }: ToolProps) {
    switch (toolId) {
        case 'game-dice': return <DiceRoller />;
        case 'game-coin': return <CoinFlipper />;
        case 'game-picker': return <NamePicker />;
        default: return <div className="text-center py-20 opacity-50"><Dice5 className="w-12 h-12 mx-auto mb-4" /><p>يتم العمل على هذه الأداة...</p></div>;
    }
}
