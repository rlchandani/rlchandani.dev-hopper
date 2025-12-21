"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Monitor, Smartphone, Clock, TrendingUp } from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import { getAnalyticsData, AnalyticsEvent } from "@/lib/firebase";
import { UAParser } from "ua-parser-js";

interface AnalyticsModalProps {
    shortcutId: string;
    shortcutKey: string;
    isOpen: boolean;
    onClose: () => void;
}

type TimeRange = "today" | "7d" | "30d" | "all";

export default function AnalyticsModal({
    shortcutId,
    shortcutKey,
    isOpen,
    onClose,
}: AnalyticsModalProps) {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>("7d");

    useEffect(() => {
        if (isOpen && shortcutId) {
            setLoading(true);
            getAnalyticsData(shortcutId).then((data) => {
                setEvents(data);
                setLoading(false);
            });
        }
    }, [isOpen, shortcutId]);

    if (!isOpen) return null;

    // Filter events based on Time Range
    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.timestamp);
        const now = new Date();

        switch (timeRange) {
            case "today":
                return eventDate.toDateString() === now.toDateString();
            case "7d":
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(now.getDate() - 7);
                return eventDate >= sevenDaysAgo;
            case "30d":
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                return eventDate >= thirtyDaysAgo;
            case "all":
            default:
                return true;
        }
    });

    // 1. Clicks Over Time (Group by Date)
    const clicksByDate = filteredEvents.reduce((acc, event) => {
        const date = new Date(event.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Ensure we have data points for the range (fill gaps if needed? keeping simple for MVP)
    const timeData = Object.keys(clicksByDate).map((date) => ({
        date,
        clicks: clicksByDate[date],
    }));

    // 2. Page Views Per Hour
    const clicksByHour = filteredEvents.reduce((acc, event) => {
        const hour = new Date(event.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}h`,
        views: clicksByHour[i] || 0,
    }));

    // 3. Browsers
    const browsers = filteredEvents.reduce((acc, event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parser = new (UAParser as any)(event.userAgent);
        const browserName = parser.getBrowser().name || "Unknown";
        acc[browserName] = (acc[browserName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const browserData = Object.keys(browsers).map((name) => ({
        name,
        value: browsers[name],
    }));

    // 4. Devices
    const devices = filteredEvents.reduce((acc, event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parser = new (UAParser as any)(event.userAgent);
        const deviceType = parser.getDevice().type || "Desktop";
        const label = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const deviceData = Object.keys(devices).map((name) => ({
        name,
        clicks: devices[name],
    }));

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-5xl bg-gray-100 dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col mb-20 md:mb-0">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Analytics: /{shortcutKey}
                    </h2>

                    {/* Time Range Filter */}
                    <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                        {(["today", "7d", "30d", "all"] as TimeRange[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${timeRange === range
                                    ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    }`}
                            >
                                <span className="sm:hidden">
                                    {range === "today" ? "1D" : range === "7d" ? "7D" : range === "30d" ? "30D" : "All"}
                                </span>
                                <span className="hidden sm:inline">
                                    {range === "today" ? "Today" : range === "7d" ? "Last 7 Days" : range === "30d" ? "Last 30 Days" : "All Time"}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Top Row: Clicks Over Time (Area Chart) */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                                <div className="mb-6 text-center">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Clicks Over Time</h3>
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {filteredEvents.length} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">Clicks</span>
                                    </div>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={timeData}>
                                            <defs>
                                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                                cursor={{ stroke: "#8B5CF6", strokeWidth: 2 }}
                                            />
                                            <Area type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Middle Row: Browsers & Devices */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Browsers (Pie) */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        Browsers
                                    </h3>
                                    <div className="h-64 flex items-center">
                                        <div className="w-1/2 h-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={browserData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={40}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {browserData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="w-1/2 pl-4 space-y-2">
                                            {browserData.map((entry, index) => (
                                                <div key={entry.name} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                    <div className="text-sm">
                                                        <span className="font-medium text-gray-900 dark:text-white block">{entry.name}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-xs">{Math.round(entry.value / filteredEvents.length * 100)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Devices (Bar) */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        Devices
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={deviceData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                                <Tooltip
                                                    cursor={{ fill: "#F1F5F9" }}
                                                    contentStyle={{ borderRadius: "8px", border: "none" }}
                                                />
                                                <Bar dataKey="clicks" radius={[4, 4, 0, 0]} barSize={40}>
                                                    {deviceData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Page Views Per Hour */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    Page Views Per Hour
                                </h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={hourlyData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                            <XAxis
                                                dataKey="hour"
                                                stroke="#94A3B8"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                interval={2} // Show every 2nd label to avoid crowding
                                            />
                                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                            />
                                            <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
