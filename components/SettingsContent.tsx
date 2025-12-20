"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    getProfiles,
    addProfile,
    renameProfile,
    deleteProfile,
    exportShortcuts,
    importShortcuts,
    getUserSettings,
    saveUserSettings,
    UserSettings,
    generateApiKey,
} from "@/lib/firebase";
import ApiKeySection from "./settings/ApiKeySection";
import ProfileList from "./settings/ProfileList";
import DataManagement from "./settings/DataManagement";
import FallbackSearch from "./settings/FallbackSearch";

interface SettingsContentProps {
    onProfilesChange?: () => void;
}

export default function SettingsContent({ onProfilesChange }: SettingsContentProps) {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<string[]>([]);
    const [settings, setSettings] = useState<UserSettings>({
        fallbackSearch: "google",
        profiles: ["personal", "work"],
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;

            try {
                const [fetchedProfiles, fetchedSettings] = await Promise.all([
                    getProfiles(user.uid),
                    getUserSettings(user.uid),
                ]);
                setProfiles(fetchedProfiles);
                setSettings(fetchedSettings);
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const showMessage = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAddProfile = async (newProfileName: string) => {
        if (!user) return;
        const name = newProfileName.trim().toLowerCase().replace(/\s+/g, "-");

        if (profiles.includes(name)) {
            showMessage("error", "Profile already exists");
            return;
        }

        try {
            await addProfile(user.uid, name);
            setProfiles([...profiles, name]);
            showMessage("success", `Profile "${name}" created`);
            onProfilesChange?.();
        } catch (error) {
            showMessage("error", "Failed to create profile");
        }
    };

    const handleRenameProfile = async (oldName: string, newName: string) => {
        if (!user) return;
        const sanitizedNewName = newName.trim().toLowerCase().replace(/\s+/g, "-");

        try {
            await renameProfile(user.uid, oldName, sanitizedNewName);
            setProfiles(profiles.map((p) => (p === oldName ? sanitizedNewName : p)));
            showMessage("success", `Renamed to "${sanitizedNewName}"`);
            onProfilesChange?.();
        } catch (error) {
            showMessage("error", "Failed to rename profile");
        }
    };

    const handleDeleteProfile = async (profileName: string) => {
        if (!user) return;
        if (!confirm(`Delete "${profileName}" and all its shortcuts?`)) return;

        try {
            await deleteProfile(user.uid, profileName);
            setProfiles(profiles.filter((p) => p !== profileName));
            showMessage("success", `Deleted "${profileName}"`);
            onProfilesChange?.();
        } catch (error) {
            showMessage("error", "Failed to delete profile");
        }
    };

    const handleExport = async () => {
        if (!user) return;

        try {
            const json = await exportShortcuts(user.uid);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `hopper-shortcuts-${new Date().toISOString().split("T")[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showMessage("success", "Exported successfully");
        } catch (error) {
            showMessage("error", "Export failed");
        }
    };

    const handleImport = async (file: File) => {
        if (!user) return;

        try {
            const text = await file.text();
            await importShortcuts(user.uid, text, "merge");
            showMessage("success", "Imported successfully");
            onProfilesChange?.();
        } catch (error) {
            showMessage("error", "Import failed - invalid JSON");
        }
    };

    const handleFallbackChange = async (value: UserSettings["fallbackSearch"]) => {
        if (!user) return;

        setSettings({ ...settings, fallbackSearch: value });
        try {
            await saveUserSettings(user.uid, { fallbackSearch: value });
            showMessage("success", "Settings saved");
        } catch (error) {
            showMessage("error", "Failed to save");
            // Revert state on failure
            setSettings({ ...settings });
        }
    };

    const handleGenerateKey = async () => {
        if (!user) return;

        try {
            const key = await generateApiKey(user.uid);
            setSettings({ ...settings, apiKey: key });
            showMessage("success", "API Key generated");
        } catch (e) {
            console.error(e);
            showMessage("error", "Failed to generate key");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast Message */}
            {message && (
                <div
                    className={`px-4 py-2 rounded-xl text-sm font-medium ${message.type === "success"
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <ApiKeySection
                apiKey={settings.apiKey}
                profiles={profiles}
                onGenerate={handleGenerateKey}
                onShowMessage={showMessage}
            />

            <ProfileList
                profiles={profiles}
                onAdd={handleAddProfile}
                onRename={handleRenameProfile}
                onDelete={handleDeleteProfile}
            />

            <DataManagement
                onExport={handleExport}
                onImport={handleImport}
            />

            <FallbackSearch
                value={settings.fallbackSearch}
                onChange={handleFallbackChange}
            />
        </div>
    );
}
