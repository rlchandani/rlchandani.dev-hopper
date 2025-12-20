"use client";

import React from "react";

interface StatsCardsProps {
    totalShortcuts: number;
    profileCount: number;
    globalCount: number;
}

export default function StatsCards({ totalShortcuts, profileCount, globalCount }: StatsCardsProps) {
    const stats = [
        {
            label: "Total Shortcuts",
            value: totalShortcuts,
            accent: "text-blue-500",
        },
        {
            label: "Profile",
            value: profileCount,
            accent: "text-indigo-500",
        },
        {
            label: "Global",
            value: globalCount,
            accent: "text-purple-500",
        },
    ];

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="min-w-[140px] md:min-w-0 flex-shrink-0 p-6 bg-white dark:bg-slate-800/50 border border-gray-400 dark:border-slate-600 rounded-2xl"
                >
                    <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">{stat.label}</div>
                    <div className={`text-3xl font-bold ${stat.accent}`}>{stat.value}</div>
                </div>
            ))}
        </div>
    );
}
