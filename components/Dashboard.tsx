"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { useShortcuts } from "@/hooks/useShortcuts";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import ShortcutTable from "@/components/ShortcutTable";
import AddShortcutForm from "@/components/AddShortcutForm";
import SetupGuide from "@/components/SetupGuide";
import MobileNav from "@/components/MobileNav";
import SettingsDrawer from "@/components/SettingsDrawer";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Initialize search query to empty string, ignoring URL params for filtering
    const [searchQuery, setSearchQuery] = useState("");

    const [filter, setFilter] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { shortcuts, profiles, settings, loading, remove, add, refresh } = useShortcuts();
    const [error, setError] = useState<string | null>(null);

    // Auto-open settings drawer if query param is present
    useEffect(() => {
        if (searchParams.get("settings") === "open") {
            // Small delay to ensure initial render (closed) happens first, triggering animation
            setTimeout(() => {
                setIsSettingsOpen(true);
            }, 10);
            router.replace("/", { scroll: false });
        }

        // Handle API invalid key error
        if (searchParams.get("error") === "invalid_key") {
            setError("Invalid API Key. Please regenerate it in Settings.");
        }
    }, [searchParams, router]);

    // Profile for setup guide and adding shortcuts - based on filter
    const activeProfile = filter === "all" || filter === "global" ? (profiles[0] || "personal") : filter;

    const handleAdd = async (key: string, url: string, targetProfile: string) => {
        await add(key, url, targetProfile);
    };

    // Build dynamic filters from profiles
    const filters = useMemo(() => {
        const baseFilters = [{ id: "all", label: "All" }];
        const profileFilters = profiles.map((p) => ({
            id: p,
            label: p.charAt(0).toUpperCase() + p.slice(1),
        }));
        return [...baseFilters, ...profileFilters, { id: "global", label: "Global" }];
    }, [profiles]);

    const getFilterLabel = (id: string) => {
        const f = filters.find((f) => f.id === id);
        return f ? f.label : "All";
    };

    // Filter shortcuts
    const filteredShortcuts = useMemo(() => {
        let result = shortcuts;

        if (filter !== "all") {
            result = result.filter((s) => s.profile === filter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.key.toLowerCase().includes(query) ||
                    s.url.toLowerCase().includes(query)
            );
        }

        return result;
    }, [shortcuts, filter, searchQuery]);



    const profileShortcuts = shortcuts.filter((s) => s.profile !== "global");
    const globalShortcuts = shortcuts.filter((s) => s.profile === "global");

    return (
        <div className="min-h-screen pb-24 md:pb-0 bg-gray-100 dark:bg-slate-900">
            <Header onSettingsClick={() => setIsSettingsOpen(true)} />

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
                {/* Error Toast */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}><X size={16} /></button>
                    </div>
                )}

                {/* Stats */}
                <StatsCards
                    totalShortcuts={shortcuts.length}
                    profileCount={profileShortcuts.length}
                    globalCount={globalShortcuts.length}
                />

                {/* Search & Filter Row */}
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by command or URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none text-sm"
                        />
                    </div>

                    {/* Filter Dropdown + Active Badge */}
                    <div className="flex items-center gap-3">
                        {/* Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-slate-500"
                            >
                                <span>Filter</span>
                                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isFilterOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsFilterOpen(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-2 z-50 min-w-[160px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                                        {filters.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => {
                                                    setFilter(f.id);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 ${filter === f.id
                                                    ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-medium"
                                                    : "text-gray-900 dark:text-white"
                                                    }`}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Active Filter Badge */}
                        {filter !== "all" && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-green-500 text-black rounded-xl text-sm font-medium">
                                <span>{getFilterLabel(filter)}</span>
                                <button
                                    onClick={() => setFilter("all")}
                                    className="p-0.5 hover:bg-black/10 rounded"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Count and action buttons */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Showing {filteredShortcuts.length} of {shortcuts.length} shortcuts
                    </p>
                    <div className="flex items-center gap-2">
                        <SetupGuide profile={activeProfile} />
                        <AddShortcutForm onAdd={handleAdd} currentProfile={activeProfile} />
                    </div>
                </div>

                {/* Table / Cards */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-32 rounded-2xl animate-pulse bg-white dark:bg-slate-800/50 border border-dashed border-gray-400 dark:border-slate-600"
                            />
                        ))}
                    </div>
                ) : (
                    <ShortcutTable shortcuts={filteredShortcuts} onDelete={remove} />
                )}
            </main>

            <MobileNav />

            {/* Settings Drawer */}
            <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onProfilesChange={refresh}
            />
        </div>
    );
}
