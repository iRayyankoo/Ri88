"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function PomodoroWidget() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus'); // future proofing
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist state (simple)
    useEffect(() => {
        const saved = localStorage.getItem('ri88_pomo_time');
        if (saved) setTimeLeft(parseInt(saved));
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newValue = prev - 1;
                    localStorage.setItem('ri88_pomo_time', newValue.toString());
                    return newValue;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound if we had one
            if (audioRef.current) audioRef.current.play();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
        localStorage.setItem('ri88_pomo_time', (25 * 60).toString());
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = 100 - (timeLeft / (25 * 60)) * 100;

    return (
        <div className="pomo-container">
            <div className="pomo-display" style={{ marginTop: '20px' }}>
                <div className="time-text">{formatTime(timeLeft)}</div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="pomo-controls">
                <button onClick={toggleTimer} className={`pomo-btn ${isActive ? 'active' : ''}`}>
                    {isActive ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={resetTimer} className="pomo-btn secondary">
                    <RotateCcw size={16} />
                </button>
            </div>

            <style jsx>{`
                .pomo-container {
                    height: 100%; display: flex; flex-direction: column; justify-content: space-between;
                }
                .pomo-header {
                    display: flex; alignItems: center; gap: 8px; font-size: 14px; font-weight: 700; color: #FF6B6B;
                    margin-bottom: 20px;
                }
                .pomo-display { text-align: center; margin-bottom: 20px; }
                .time-text { font-size: 42px; font-weight: 800; font-family: monospace; letter-spacing: -2px; line-height: 1; margin-bottom: 10px; }
                
                .progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; background: #FF6B6B; transition: width 1s linear; }

                .pomo-controls { display: flex; gap: 10px; justify-content: center; }
                .pomo-btn {
                    width: 45px; height: 45px; border-radius: 50%; border: none; cursor: pointer;
                    display: flex; alignItems: center; justify-content: center; color: white;
                    background: #FF6B6B; transition: all 0.2s;
                }
                .pomo-btn:hover { transform: scale(1.1); }
                .pomo-btn.active { background: #232433; border: 2px solid #FF6B6B; color: #FF6B6B; }
                .pomo-btn.secondary { background: rgba(255,255,255,0.1); width: 35px; height: 35px; }
                .pomo-btn.secondary:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}
