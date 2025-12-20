import React from "react";
import { Check } from "lucide-react";
import { UserSettings } from "@/lib/firebase";

interface FallbackSearchProps {
    value: UserSettings["fallbackSearch"];
    onChange: (value: UserSettings["fallbackSearch"]) => void;
}

export default function FallbackSearch({ value, onChange }: FallbackSearchProps) {
    const fallbackOptions = [
        { id: "google", label: "Google" },
        { id: "duckduckgo", label: "DuckDuckGo" },
        { id: "bing", label: "Bing" },
        { id: "none", label: "None (show error)" },
    ];

    return (
        <section className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Fallback Search</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">When shortcut is not found</p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {fallbackOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id as UserSettings["fallbackSearch"])}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700/50"
                    >
                        <span className="text-gray-900 dark:text-white text-sm">{option.label}</span>
                        {value === option.id && (
                            <Check size={16} className="text-green-500" />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}
