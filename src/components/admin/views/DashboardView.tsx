import React from 'react';
import { Map as MapIcon, ArrowUpRight, ArrowDownRight, Activity, Users, Globe, Smartphone } from 'lucide-react';

function StatCard({ title, value, change, isPositive, icon: Icon, color }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '20px', opacity: 0.1 }}>
                <Icon size={40} color={color} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#8890AA' }}>{title}</h3>
            <div style={{ fontSize: '2em', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85em', color: isPositive ? '#00E096' : '#FF4757' }}>
                {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{change} vs last week</span>
            </div>
        </div>
    );
}

export default function DashboardView() {
    return (
        <div className="animate-fade-in">
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard
                    title="Total Visitors"
                    value="12,450"
                    change="+12.5%"
                    isPositive={true}
                    icon={Users}
                    color="#6D4CFF"
                />
                <StatCard
                    title="Active Tools Usage"
                    value="8,234"
                    change="+5.2%"
                    isPositive={true}
                    icon={Activity}
                    color="#00FFF2"
                />
                <StatCard
                    title="Avg. Time on Site"
                    value="4m 32s"
                    change="-1.5%"
                    isPositive={false}
                    icon={Globe}
                    color="#FFB86B"
                />
                <StatCard
                    title="Mobile Users"
                    value="68%"
                    change="+8.4%"
                    isPositive={true}
                    icon={Smartphone}
                    color="#D35BFF"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main Activity Map/Chart Area */}
                <div style={{ background: 'rgba(25, 25, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', height: '400px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>Live Regional Traffic</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: '#aaa' }}>Real-time</span>
                        </div>
                    </div>

                    {/* Mock Map Visual */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px', background: '#0f0f13', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Saudi Map Placeholder */}
                        <div style={{ position: 'relative' }}>
                            <MapIcon size={100} color="#333" />
                            {/* Live Pings */}
                            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                            <div className="absolute bottom-10 left-4 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
                        </div>
                        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#666', fontSize: '12px' }}>
                            Most Active Region: Riyadh
                        </div>
                    </div>
                </div>

                {/* Right Column - Top Tools */}
                <div style={{ background: 'rgba(25, 25, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'white' }}>Top Performing Tools</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { name: 'VAT Calculator', count: '2.4k', growth: '+15%' },
                            { name: 'Speed Test', count: '1.8k', growth: '+40%' },
                            { name: 'YouTube Downloader', count: '1.2k', growth: '+5%' },
                            { name: 'CV Builder', count: '980', growth: '+12%' },
                            { name: 'Hijri Converter', count: '850', growth: '-2%' },
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', textAlign: 'center', fontSize: '12px', lineHeight: '24px', color: '#aaa' }}>{idx + 1}</div>
                                    <span style={{ color: '#ddd', fontSize: '0.95em' }}>{item.name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'white', fontWeight: 'bold' }}>{item.count}</div>
                                    <div style={{ fontSize: '11px', color: item.growth.startsWith('+') ? '#00E096' : '#FF4757' }}>{item.growth}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
