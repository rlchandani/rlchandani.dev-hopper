"use client";

import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";

interface ShortcutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string, url: string, profile: string, isPrefix?: boolean) => Promise<void>;
    initialData?: {
        key: string;
        url: string;
        profile: string;
        isPrefix?: boolean;
    } | null;
    profiles: string[];
    defaultProfile?: string;
    title?: string;
    saveLabel?: string;
}

export default function ShortcutModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    profiles,
    defaultProfile = "personal",
    title = "New Shortcut",
    saveLabel = "Add Shortcut"
}: ShortcutModalProps) {
    const [key, setKey] = useState("");
    const [url, setUrl] = useState("");
    const [profile, setProfile] = useState(defaultProfile);
    const [isPrefix, setIsPrefix] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset or populate form when opening/changing data
    useEffect(() => {
        if (isOpen) {
            setKey(initialData?.key || "");
            setUrl(initialData?.url || "");
            setProfile(initialData?.profile || defaultProfile);
            setIsPrefix(initialData?.isPrefix || false);
            setError("");
        }
    }, [isOpen, initialData, defaultProfile]);

    // Disable prefix mode if key contains letters
    const isKeyAlphabetic = /[a-zA-Z]/.test(key);
    useEffect(() => {
        if (isKeyAlphabetic && isPrefix) {
            setIsPrefix(false);
        }
    }, [key, isKeyAlphabetic, isPrefix]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!key || !url) return;

        setLoading(true);
        setError("");

        try {
            await onSave(key, url, profile, isPrefix);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save shortcut");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            {/* Modal - Large border radius (rounded-3xl) */}
            <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 rounded-3xl shadow-2xl relative">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    {title}
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
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s/g, ""))}
                            placeholder="e.g. gh"
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-slate-400">
                            Destination URL
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/search?q=%s"
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none"
                        />
                        <p className="text-xs mt-1 text-gray-500 dark:text-slate-400">
                            Use %s as a placeholder for search queries
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-slate-400">
                            Profile
                        </label>
                        <div className="relative">
                            <select
                                value={profile}
                                onChange={(e) => setProfile(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white appearance-none focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none capitalize"
                            >
                                {profiles.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                                <option value="global">Global (All Profiles)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <Globe size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-1">
                        <label className={`flex items-center gap-3 ${isKeyAlphabetic ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                            <div
                                className={`w-11 h-6 rounded-full p-1 transition-colors ${isKeyAlphabetic
                                    ? "bg-gray-200 dark:bg-slate-700" // Disabled look
                                    : isPrefix
                                        ? "bg-blue-500"
                                        : "bg-gray-300 dark:bg-slate-600"
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isPrefix ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </div>
                            <input
                                type="checkbox"
                                checked={isPrefix}
                                onChange={(e) => !isKeyAlphabetic && setIsPrefix(e.target.checked)}
                                disabled={isKeyAlphabetic}
                                className="hidden"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={isPrefix ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-slate-400"}>
                                        Prefix Mode
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                    {isKeyAlphabetic
                                        ? "Only available for non-alphabetic keys (symbols)"
                                        : "Trigger without space (e.g. $AMZN)"}
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-medium bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-xl font-medium bg-green-500 text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {loading ? "Saving..." : saveLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
