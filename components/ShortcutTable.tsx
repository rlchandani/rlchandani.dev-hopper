"use client";

import React from "react";
import { Trash2, ExternalLink, Globe, ChevronRight, Pencil, Zap, BarChart2, QrCode } from "lucide-react";
import { Shortcut } from "@/lib/firebase";
import AnalyticsModal from "./AnalyticsModal";
import QRModal from "./QRModal";

interface ShortcutTableProps {
    shortcuts: Shortcut[];
    onDelete: (id: string) => void;
    onEdit: (shortcut: Shortcut) => void;
}

export default function ShortcutTable({ shortcuts, onDelete, onEdit }: ShortcutTableProps) {
    const [analyticsShortcut, setAnalyticsShortcut] = React.useState<Shortcut | null>(null);
    const [qrShortcut, setQrShortcut] = React.useState<Shortcut | null>(null);

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
            <AnalyticsModal
                isOpen={!!analyticsShortcut}
                onClose={() => setAnalyticsShortcut(null)}
                shortcutId={analyticsShortcut?.id || ""}
                shortcutKey={analyticsShortcut?.key || ""}
            />

            <QRModal
                isOpen={!!qrShortcut}
                onClose={() => setQrShortcut(null)}
                shortcutKey={qrShortcut?.key || ""}
                shortcutUrl={qrShortcut?.url || ""}
            />

            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden bg-white dark:bg-slate-800/50 border border-gray-400 dark:border-slate-600 rounded-2xl">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Command</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Destination URL</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Profile</th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500 dark:text-slate-400">Stats</th>
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            {shortcut.key}
                                        </span>
                                        {shortcut.isPrefix && (
                                            <span
                                                title="Prefix Mode (no space required)"
                                                className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 p-1 rounded-md"
                                            >
                                                <Zap size={12} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>
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
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-xs font-medium">
                                        <BarChart2 size={12} />
                                        {shortcut.clicks || 0} clicks
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setQrShortcut(shortcut)}
                                            className="p-2 text-gray-500 hover:bg-gray-500/10 rounded-xl transition-colors"
                                            title="View QR Code"
                                        >
                                            <QrCode size={18} />
                                        </button>
                                        <button
                                            onClick={() => setAnalyticsShortcut(shortcut)}
                                            className="p-2 text-purple-500 hover:bg-purple-500/10 rounded-xl transition-colors"
                                            title="View Analytics"
                                        >
                                            <BarChart2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onEdit(shortcut)}
                                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors"
                                            title="Edit"
                                            aria-label="Edit shortcut"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(shortcut.id)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                            title="Delete"
                                            aria-label="Delete shortcut"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile List Style (Option 3) */}
            <div className="md:hidden bg-white dark:bg-slate-800/50 border border-gray-400 dark:border-slate-600 rounded-2xl overflow-hidden">
                {shortcuts.map((shortcut, index) => (
                    <div
                        key={shortcut.id}
                        className={`flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 active:bg-gray-100 dark:active:bg-slate-700 ${index > 0 ? "border-t border-gray-200 dark:border-slate-700" : ""
                            }`}
                        onClick={() => onEdit(shortcut)} // Make whole row open edit on mobile
                    >
                        <div className="flex-1 min-w-0">
                            {/* Command name */}
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                    {shortcut.key}
                                </span>
                                {shortcut.isPrefix && (
                                    <span
                                        title="Prefix Mode (no space required)"
                                        className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 p-1 rounded-md"
                                    >
                                        <Zap size={12} fill="currentColor" />
                                    </span>
                                )}
                                {shortcut.profile === "global" && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                        global
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-[10px] font-medium ml-2">
                                    <BarChart2 size={10} />
                                    {shortcut.clicks || 0}
                                </span>
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
                                    setQrShortcut(shortcut);
                                }}
                                className="p-2 text-gray-500 hover:bg-gray-500/10 rounded-lg transition-colors"
                                aria-label="View QR Code"
                            >
                                <QrCode size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setAnalyticsShortcut(shortcut);
                                }}
                                className="p-2 text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                                aria-label="View Analytics"
                            >
                                <BarChart2 size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(shortcut);
                                }}
                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                aria-label="Edit shortcut"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(shortcut.id);
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                aria-label="Delete shortcut"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
