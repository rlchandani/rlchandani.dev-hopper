"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, X, Check } from "lucide-react";

import { useShortcuts } from "@/hooks/useShortcuts";
import { Shortcut } from "@/lib/firebase";

import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import ShortcutTable from "@/components/ShortcutTable";
import AddShortcutForm from "@/components/AddShortcutForm";
import SetupGuide from "@/components/SetupGuide";
import MobileNav from "@/components/MobileNav";
import SettingsDrawer from "@/components/SettingsDrawer";
import ShortcutModal from "@/components/ShortcutModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Dashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Initialize search query to empty string, ignoring URL params for filtering
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
    const [shortcutToDelete, setShortcutToDelete] = useState<string | null>(null);

    const { shortcuts, profiles, settings, loading, remove, add, update, refresh } = useShortcuts();
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
    // If multiple selected, default to first available (usually Personal)
    const activeProfile = selectedFilters.length === 1 && selectedFilters[0] !== "all" && selectedFilters[0] !== "global"
        ? selectedFilters[0]
        : (profiles[0] || "personal");

    const handleAdd = async (key: string, url: string, targetProfile: string, isPrefix?: boolean) => {
        await add(key, url, targetProfile, isPrefix);
    };

    const handleEdit = (shortcut: Shortcut) => {
        setEditingShortcut(shortcut);
    };

    const handleUpdate = async (id: string, key: string, url: string, profile: string, isPrefix?: boolean) => {
        await update(id, key, url, profile, isPrefix);
        setEditingShortcut(null);
    };

    // Handle Client-Side Redirection (e.g. from browser search engine)
    useEffect(() => {
        const q = searchParams.get("search") || searchParams.get("q");
        if (!q || loading || shortcuts.length === 0) return;

        const query = q.trim();

        // 1. Try Prefix Matches (e.g. $AMZN where key is $ and isPrefix=true)
        const prefixShortcut = shortcuts.find(s => s.isPrefix && query.toLowerCase().startsWith(s.key.toLowerCase()));

        if (prefixShortcut) {
            const args = query.slice(prefixShortcut.key.length).trim();
            const targetUrl = prefixShortcut.url.replace("%s", encodeURIComponent(args));
            window.location.replace(targetUrl);
            return;
        }

        // 2. Try Standard Command Match (e.g. g search)
        const parts = query.split(" ");
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        // Check profile validity if provided in URL (e.g. ?profile=work)
        const targetProfile = searchParams.get("profile");

        const shortcut = shortcuts.find(s => {
            if (targetProfile && s.profile !== targetProfile && s.profile !== "global") return false;
            return s.key.toLowerCase() === command;
        });

        if (shortcut) {
            const targetUrl = shortcut.url.replace("%s", encodeURIComponent(args));
            window.location.replace(targetUrl);
        } else {
            // Fallback (if configured to show dashboard, do nothing, or redirect to fallback search)
            // For now, staying on dashboard showing filtered results (which logic below handles)
        }

    }, [searchParams, shortcuts, loading]);

    const handleDeleteClick = (id: string) => {
        setShortcutToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (shortcutToDelete) {
            await remove(shortcutToDelete);
            setShortcutToDelete(null);
        }
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

    // Toggle filter logic
    const toggleFilter = (id: string) => {
        setSelectedFilters(prev => {
            if (id === "all") return ["all"];

            // If currently "all", checking specific one clears "all" and sets specific
            let newFilters = prev.includes("all") ? [] : [...prev];

            if (newFilters.includes(id)) {
                newFilters = newFilters.filter(f => f !== id);
            } else {
                newFilters.push(id);
            }

            // If nothing selected, revert to all
            return newFilters.length === 0 ? ["all"] : newFilters;
        });
    };

    // Filter shortcuts
    const filteredShortcuts = useMemo(() => {
        let result = shortcuts;

        // "all" means no filtering
        if (!selectedFilters.includes("all")) {
            result = result.filter((s) => selectedFilters.includes(s.profile));
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
    }, [shortcuts, selectedFilters, searchQuery]);



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
                                {selectedFilters.length > 0 && !selectedFilters.includes("all") && (
                                    <span className="flex items-center justify-center w-5 h-5 bg-green-500 text-black text-xs font-bold rounded-full">
                                        {selectedFilters.length}
                                    </span>
                                )}
                                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isFilterOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsFilterOpen(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-2 z-50 min-w-[200px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden p-1">
                                        {filters.map((f) => {
                                            const isSelected = selectedFilters.includes(f.id);
                                            return (
                                                <button
                                                    key={f.id}
                                                    onClick={() => {
                                                        toggleFilter(f.id);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm rounded-lg flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-900 dark:text-white"
                                                >
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected
                                                        ? "bg-green-500 border-green-500 text-white"
                                                        : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                                        }`}>
                                                        {isSelected && <Check size={12} strokeWidth={3} />}
                                                    </div>
                                                    <span>{f.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Count and action buttons */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Showing {filteredShortcuts.length} of {shortcuts.length} shortcuts
                    </p>
                    <div className="flex items-center gap-2">
                        <SetupGuide profile={activeProfile} />
                        <AddShortcutForm onAdd={handleAdd} currentProfile={activeProfile} profiles={profiles} />
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
                    <ShortcutTable
                        shortcuts={filteredShortcuts}
                        onDelete={handleDeleteClick}
                        onEdit={handleEdit}
                    />
                )}
            </main>

            <MobileNav />

            {/* Settings Drawer */}
            <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onProfilesChange={refresh}
            />

            {/* Edit Modal (Reusing ShortcutModal) */}
            <ShortcutModal
                isOpen={!!editingShortcut}
                onClose={() => setEditingShortcut(null)}
                onSave={async (key, url, profile, isPrefix) => {
                    if (editingShortcut) {
                        await handleUpdate(editingShortcut.id, key, url, profile, isPrefix);
                    }
                }}
                initialData={editingShortcut}
                profiles={profiles}
                title="Edit Shortcut"
                saveLabel="Save Changes"
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!shortcutToDelete}
                title="Delete Shortcut"
                message="Are you sure you want to delete this shortcut? This action cannot be undone."
                confirmLabel="Delete"
                isDestructive={true}
                isLoading={loading}
                onCancel={() => setShortcutToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
