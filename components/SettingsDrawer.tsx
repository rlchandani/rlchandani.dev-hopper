"use client";

import React from "react";
import { X } from "lucide-react";
import SettingsContent from "@/components/SettingsContent";

interface SettingsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onProfilesChange?: () => void;
}

export default function SettingsDrawer({ isOpen, onClose, onProfilesChange }: SettingsDrawerProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:transition-opacity md:duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto md:transition-transform md:duration-300 md:ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <SettingsContent onProfilesChange={onProfilesChange} />
                </div>
            </div>
        </>
    );
}
