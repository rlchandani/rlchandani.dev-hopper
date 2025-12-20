"use client";

import React, { useState } from "react";
import { X, Copy, Check, Settings, Chrome, Globe } from "lucide-react";

interface SetupGuideProps {
    profile: string;
}

export default function SetupGuide({ profile }: SetupGuideProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<"chrome" | "firefox" | "safari">("chrome");

    const origin = typeof window !== "undefined" ? window.location.origin : "https://hopper.yourdomain.com";
    const url = `${origin}/?profile=${profile}&search=%s`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500"
            >
                <Settings size={16} />
                <span className="hidden sm:inline">Browser Setup</span>
            </button>
        );
    }

    const browsers = [
        { id: "chrome", label: "Chrome / Edge / Brave" },
        { id: "firefox", label: "Firefox" },
        { id: "safari", label: "Safari" },
    ] as const;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 pb-20 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-600 rounded-3xl shadow-2xl my-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Browser Setup</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Add Hopper (<strong className="text-gray-900 dark:text-white">{profile}</strong>) as a custom search engine.
                    </p>

                    {/* URL Box */}
                    <div className="bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                        <div className="text-xs uppercase text-gray-500 dark:text-slate-500 font-bold tracking-wider mb-2">
                            Search Engine URL
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <code className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-blue-500 font-mono text-xs break-all">
                                {url}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 rounded-xl bg-green-500 text-black font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shrink-0"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Browser Tabs */}
                    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-900 rounded-xl">
                        {browsers.map((browser) => (
                            <button
                                key={browser.id}
                                onClick={() => setActiveTab(browser.id)}
                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === browser.id
                                        ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                                    }`}
                            >
                                {browser.label}
                            </button>
                        ))}
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3">
                        {activeTab === "chrome" && (
                            <>
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Chrome / Edge / Brave</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-slate-400">
                                    <li>Open <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded text-xs">chrome://settings/searchEngines</span></li>
                                    <li>Under "Site search", click <strong>Add</strong></li>
                                    <li><strong>Name:</strong> Hopper ({profile})</li>
                                    <li><strong>Shortcut:</strong> h (or any keyword)</li>
                                    <li><strong>URL:</strong> Paste the URL above</li>
                                    <li>Click "Add" to save</li>
                                </ol>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                    Usage: Type <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">h</kbd> then <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">Tab</kbd> in address bar, then your query.
                                </p>
                            </>
                        )}

                        {activeTab === "firefox" && (
                            <>
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Firefox</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-slate-400">
                                    <li>Create a bookmark with the URL above</li>
                                    <li>Right-click the bookmark → Properties</li>
                                    <li><strong>Keyword:</strong> h (or any keyword)</li>
                                    <li>Click Save</li>
                                </ol>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                    Usage: Type <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs">h query</kbd> in address bar.
                                </p>
                            </>
                        )}

                        {activeTab === "safari" && (
                            <>
                                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Safari (macOS)</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-slate-400">
                                    <li>Safari doesn't support custom search engines natively</li>
                                    <li>Install the <strong>Keyword Search</strong> extension from Mac App Store</li>
                                    <li>Add a new keyword with the URL above</li>
                                </ol>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                    Alternative: Use Chrome or Firefox for custom search engine support.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2.5 rounded-xl font-medium bg-green-500 text-black hover:bg-green-600 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
