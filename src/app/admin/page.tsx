"use client";
import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardView from '@/components/admin/views/DashboardView';
import ContentView from '@/components/admin/views/ContentView';
import UsersView from '@/components/admin/views/UsersView';
import { AppearanceView, SettingsView } from '@/components/admin/views/SettingsView';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100vh', background: '#0B1026', color: 'white', overflow: 'hidden' }}>

            {/* Modular Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content Area */}
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0B1026' }}>

                {/* Header */}
                <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(11, 16, 38, 0.8)', backdropFilter: 'blur(10px)' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8em' }}>
                            {activeTab === 'dashboard' ? 'Dashboard' :
                                activeTab === 'content' ? 'Content Management' :
                                    activeTab === 'users' ? 'Users & Community' :
                                        activeTab === 'appearance' ? 'Appearance' : 'Settings'}
                        </h1>
                        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9em' }}>Welcome back, Rayan</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        {/* Search Bar */}
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input
                                type="text"
                                placeholder="Global Search..."
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 10px 10px 40px', borderRadius: '20px', color: 'white', width: '250px', fontSize: '0.9em', outline: 'none' }}
                            />
                        </div>

                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={24} color="#aaa" />
                            <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: '#FF4757', borderRadius: '50%', border: '2px solid #0B1026' }}></span>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6D4CFF, #00FFF2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2em' }}>
                            R
                        </div>
                    </div>
                </header>

                {/* Main View Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                    {activeTab === 'dashboard' && <DashboardView />}
                    {activeTab === 'content' && <ContentView />}
                    {activeTab === 'users' && <UsersView />}
                    {activeTab === 'appearance' && <AppearanceView />}
                    {activeTab === 'settings' && <SettingsView />}
                </div>

            </div>
        </div>
    );
}
