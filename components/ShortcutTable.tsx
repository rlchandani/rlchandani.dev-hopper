"use client";

import React from "react";
import { Trash2, ExternalLink, Globe, ChevronRight } from "lucide-react";
import { Shortcut } from "@/lib/firebase";

interface ShortcutTableProps {
    shortcuts: Shortcut[];
    onDelete: (id: string) => void;
}

export default function ShortcutTable({ shortcuts, onDelete }: ShortcutTableProps) {
    if (shortcuts.length === 0) {
        return (
            <div className="text-center py-16 p-6 bg-white dark:bg-slate-800/50 border border-dashed border-gray-400 dark:border-slate-600 rounded-2xl">
                <p className="text-gray-500 dark:text-slate-400">No shortcuts found.</p>
                <p className="text-sm mt-1 text-gray-500 dark:text-slate-400">Create your first shortcut to get started.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden bg-white dark:bg-slate-800/50 border border-gray-400 dark:border-slate-600 rounded-2xl">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Command</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Destination URL</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Profile</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shortcuts.map((shortcut, index) => (
                            <tr
                                key={shortcut.id}
                                className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 ${index > 0 ? "border-t border-gray-200 dark:border-slate-700" : ""}`}
                            >
                                <td className="px-6 py-4">
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                                        {shortcut.key}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 max-w-md">
                                        <span
                                            className="truncate text-sm font-mono text-gray-500 dark:text-slate-400"
                                            title={shortcut.url}
                                        >
                                            {shortcut.url}
                                        </span>
                                        <a
                                            href={shortcut.url.replace("%s", "test")}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-400 shrink-0"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {shortcut.profile === "global" ? (
                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                            <Globe size={12} /> Global
                                        </span>
                                    ) : (
                                        <span className="text-sm capitalize text-gray-500 dark:text-slate-400">
                                            {shortcut.profile}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onDelete(shortcut.id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile List Style (Option 3) */}
            <div className="md:hidden bg-white dark:bg-slate-800/50 border border-gray-400 dark:border-slate-600 rounded-2xl overflow-hidden">
                {shortcuts.map((shortcut, index) => (
                    <a
                        key={shortcut.id}
                        href={shortcut.url.replace("%s", "test")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 active:bg-gray-100 dark:active:bg-slate-700 ${index > 0 ? "border-t border-gray-200 dark:border-slate-700" : ""
                            }`}
                    >
                        <div className="flex-1 min-w-0">
                            {/* Command name */}
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                    {shortcut.key}
                                </span>
                                {shortcut.profile === "global" && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                        global
                                    </span>
                                )}
                            </div>
                            {/* URL */}
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-sm text-gray-500 dark:text-slate-400 truncate">
                                    {shortcut.url.length > 40 ? shortcut.url.substring(0, 40) + "..." : shortcut.url}
                                </span>
                                {shortcut.profile !== "global" && (
                                    <span className="text-xs text-gray-400 dark:text-slate-500 capitalize shrink-0">
                                        {shortcut.profile}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right side - Delete button and chevron */}
                        <div className="flex items-center gap-2 ml-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(shortcut.id);
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                            <ChevronRight size={18} className="text-gray-400 dark:text-slate-500" />
                        </div>
                    </a>
                ))}
            </div>
        </>
    );
}
