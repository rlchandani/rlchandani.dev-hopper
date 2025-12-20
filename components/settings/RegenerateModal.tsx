import React from "react";

interface RegenerateModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function RegenerateModal({ onConfirm, onCancel }: RegenerateModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-sm p-6 bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-gray-400 dark:border-slate-600 rounded-3xl shadow-2xl">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Regenerate API Key?
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                    This will invalidate your current API key immediately. Any scripts or integrations using the old key will stop working.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-white dark:bg-slate-800/50 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Regenerate
                    </button>
                </div>
            </div>
        </div>
    );
}
