import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sunrise, Sunset, Clock, MapPin } from 'lucide-react';

interface PrayerTimes {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export default function PrayerWidget() {
    const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeLeft: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrayers = async () => {
            try {
                // Fetch Riyadh, SA
                const date = new Date();
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Riyadh&country=SA&method=4`);
                const data = await res.json();
                if (data.code === 200) {
                    setPrayers(data.data.timings);
                }
            } catch (err) {
                console.error("Prayer fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrayers();
    }, []);

    useEffect(() => {
        if (!prayers) return;

        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

            const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            let upcoming = null;

            for (const p of prayerOrder) {
                const pTime = prayers[p];
                if (pTime > timeStr.slice(0, 5)) {
                    upcoming = { name: p, time: pTime };
                    break;
                }
            }

            if (!upcoming) {
                upcoming = { name: 'Fajr', time: prayers.Fajr };
            }

            // Calculate Time Left
            const [ph, pm] = upcoming.time.split(':').map(Number);
            const target = new Date();
            target.setHours(ph, pm, 0);
            if (target < now) target.setDate(target.getDate() + 1); // Tomorrow

            const diff = target.getTime() - now.getTime();
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setNextPrayer({
                name: translatePrayer(upcoming.name),
                time: convertTo12(upcoming.time),
                timeLeft: `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            });

        }, 1000);

        return () => clearInterval(interval);
    }, [prayers]);

    const translatePrayer = (name: string) => {
        const map: Record<string, string> = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
        return map[name] || name;
    };

    const convertTo12 = (time: string) => {
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'م' : 'ص';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    if (loading) return <div className="p-4 text-center text-gray-400 flex items-center justify-center h-full">...</div>;

    return (
        <div className="h-full flex flex-col justify-end">
            {/* Content - Matches Tool widget exactly */}
            <div className="flex items-center gap-4 pb-2 relative z-10">
                <div className="min-w-[42px] h-[42px] bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20">
                    <Clock size={20} className="text-sky-300" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-0.5">{nextPrayer?.name || '...'}</h4>
                    <p className="text-[13px] text-sky-100/70 font-mono tracking-wide">
                        {nextPrayer?.timeLeft || '--:--'}
                    </p>
                </div>
            </div>
        </div>
    );
}
