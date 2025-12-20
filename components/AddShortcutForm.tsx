"use client";

import React, { useState } from "react";
import { Plus, Globe } from "lucide-react";

interface AddShortcutFormProps {
    onAdd: (key: string, url: string, profile: string) => Promise<void>;
    currentProfile: string;
}

export default function AddShortcutForm({ onAdd, currentProfile }: AddShortcutFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [key, setKey] = useState("");
    const [url, setUrl] = useState("");
    const [isGlobal, setIsGlobal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key || !url) return;

        setLoading(true);
        setError("");

        try {
            const targetProfile = isGlobal ? "global" : currentProfile;
            await onAdd(key, url, targetProfile);
            setKey("");
            setUrl("");
            setIsGlobal(false);
            setIsOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add shortcut");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-green-500 text-black hover:opacity-90 transition-opacity"
            >
                <Plus size={18} />
                <span className="hidden sm:inline">New Shortcut</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            {/* Modal - Large border radius (rounded-3xl) */}
            <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-gray-400 dark:border-slate-600 rounded-3xl">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    New Shortcut
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-slate-400">
                            Command
                        </label>
                        {/* Input pattern */}
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s/g, ""))}
                            placeholder="e.g. gh"
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-slate-400">
                            Destination URL
                        </label>
                        {/* Input pattern */}
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/search?q=%s"
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none"
                        />
                        <p className="text-xs mt-1 text-gray-500 dark:text-slate-400">
                            Use %s as a placeholder for search queries
                        </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer py-2">
                        <div
                            className={`w-11 h-6 rounded-full p-1 transition-colors ${isGlobal ? "bg-purple-500" : "bg-gray-300 dark:bg-slate-600"
                                }`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isGlobal ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </div>
                        <input
                            type="checkbox"
                            checked={isGlobal}
                            onChange={(e) => setIsGlobal(e.target.checked)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-2">
                            <Globe size={16} className={isGlobal ? "text-purple-400" : "text-gray-500 dark:text-slate-400"} />
                            <span className={isGlobal ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-slate-400"}>
                                Global Shortcut
                            </span>
                        </div>
                    </label>

                    <div className="flex gap-3 pt-2">
                        {/* Secondary button pattern */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-6 py-3 rounded-xl font-medium bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
                        >
                            Cancel
                        </button>
                        {/* Primary button pattern */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-xl font-medium bg-green-500 text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {loading ? "Adding..." : "Add Shortcut"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
