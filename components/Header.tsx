"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, LogOut, Command, Settings } from "lucide-react";

interface HeaderProps {
    onSettingsClick?: () => void;
    showLogout?: boolean;
}

export default function Header({ onSettingsClick, showLogout = true }: HeaderProps) {
    const router = useRouter();
    const { signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        // Clear query params first so AuthGuard doesn't carry them to login
        router.replace(window.location.pathname);
        // Small delay to ensure URL updates before auth state changes triggers redirect
        setTimeout(async () => {
            await signOut();
        }, 100);
    };

    return (
        <header className="bg-white dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Command size={22} className="text-gray-900 dark:text-white" />
                    <span className="font-bold text-xl text-gray-900 dark:text-white">Hopper</span>
                </Link>

                {/* Right side controls */}
                <div className="flex items-center gap-2">
                    {/* Settings - Desktop only */}
                    {onSettingsClick && (
                        <button
                            onClick={onSettingsClick}
                            className="hidden md:flex p-2 rounded-xl bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                            title="Settings"
                        >
                            <Settings size={18} />
                        </button>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Sun size={18} className="text-yellow-400" />
                        ) : (
                            <Moon size={18} className="text-blue-500" />
                        )}
                    </button>

                    {/* Logout */}
                    {showLogout && (
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
