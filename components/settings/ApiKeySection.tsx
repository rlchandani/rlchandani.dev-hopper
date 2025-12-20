import React, { useState } from "react";
import { Copy, RefreshCw, Key } from "lucide-react";
import RegenerateModal from "./RegenerateModal";

interface ApiKeySectionProps {
    apiKey?: string;
    profiles: string[];
    onGenerate: () => Promise<void>;
    onShowMessage: (type: "success" | "error", text: string) => void;
}

export default function ApiKeySection({ apiKey, profiles, onGenerate, onShowMessage }: ApiKeySectionProps) {
    const [urlProfile, setUrlProfile] = useState("all");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleGenerateClick = () => {
        if (apiKey) {
            setShowConfirm(true);
        } else {
            onGenerate();
        }
    };

    const confirmRegenerate = async () => {
        setShowConfirm(false);
        await onGenerate();
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">API Access</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Server-side redirect rules</p>
                </div>

                <div className="p-4 space-y-4">
                    {apiKey ? (
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Your Search URL</label>
                                    <select
                                        value={urlProfile}
                                        onChange={(e) => setUrlProfile(e.target.value)}
                                        className="text-xs bg-gray-100 dark:bg-slate-700 border-none rounded-lg px-2 py-1 text-gray-700 dark:text-slate-300 focus:ring-0 cursor-pointer"
                                    >
                                        <option value="all">All Profiles</option>
                                        {profiles.map(p => (
                                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-mono text-gray-600 dark:text-slate-300 overflow-x-auto whitespace-nowrap">
                                        {`${window.location.origin}/api/search?key=${apiKey}&q=%s${urlProfile !== "all" ? `&profile=${urlProfile}` : ""}`}
                                    </code>
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/api/search?key=${apiKey}&q=%s${urlProfile !== "all" ? `&profile=${urlProfile}` : ""}`;
                                            navigator.clipboard.writeText(url);
                                            onShowMessage("success", "URL copied");
                                        }}
                                        className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
                                        title="Copy URL"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <p className="mt-1 text-[10px] text-gray-400">
                                    {urlProfile === "all"
                                        ? "Searches all shortcuts. Use this as your default search engine."
                                        : `Searches only the '${urlProfile}' profile. Useful for profile-specific keywords.`}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Manage Key</label>
                                <div className="mt-1 flex items-center justify-between">
                                    <div className="font-mono text-sm text-gray-900 dark:text-white">
                                        {apiKey.slice(0, 8)}...{apiKey.slice(-4)}
                                    </div>
                                    <button
                                        onClick={handleGenerateClick}
                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                                    >
                                        <RefreshCw size={12} /> Regenerate
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">Generate an API key to enable instant server-side redirects.</p>
                            <button
                                onClick={handleGenerateClick}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                <Key size={16} /> Generate API Key
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {showConfirm && (
                <RegenerateModal
                    onConfirm={confirmRegenerate}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
}
