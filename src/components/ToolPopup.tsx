"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import ToolWorkspace from './Pages/ToolWorkspace'; // Reusing existing workspace

const ToolPopup = () => {
    const { showToolPopup, setShowToolPopup } = useNavigation();

    if (!showToolPopup) return null;

    return (
        <AnimatePresence>
            {showToolPopup && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 lg:p-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowToolPopup(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full h-full max-w-[1600px] bg-[#0D0D0F] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header / Controls */}
                        <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
                            <button
                                onClick={() => setShowToolPopup(false)}
                                title="إغلاق"
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors backdrop-blur-md border border-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* WORKSPACE CONTENT (Reused) */}
                        <div className="flex-1 overflow-hidden">
                            {/* We render ToolWorkspace but force it to fit the modal structure if needed */}
                            {/* Note: ToolWorkspace usually has its own layout logic. We might need to adjust it or pass a prop 'isModal' to hide sidebar toggles etc if generic layout is used within it. 
                                 However, based on previous files, ToolWorkspace seems to be a page component. 
                             */}
                            <ToolWorkspace />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ToolPopup;
