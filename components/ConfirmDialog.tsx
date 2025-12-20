"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    isDestructive = false,
    isLoading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-full ${isDestructive ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>

                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium rounded-xl transition-colors disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 font-medium rounded-xl text-white transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 ${isDestructive
                                    ? "bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                                }`}
                        >
                            {isLoading ? "Processing..." : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
