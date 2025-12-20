"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import ShortcutModal from "./ShortcutModal";

interface AddShortcutFormProps {
    onAdd: (key: string, url: string, profile: string, isPrefix?: boolean) => Promise<void>;
    currentProfile: string;
    profiles: string[];
}

export default function AddShortcutForm({ onAdd, currentProfile, profiles }: AddShortcutFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-500 text-black hover:opacity-90 transition-opacity"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">New Shortcut</span>
            </button>

            <ShortcutModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSave={onAdd}
                profiles={profiles}
                defaultProfile={currentProfile === "global" ? "personal" : currentProfile}
                title="New Shortcut"
                saveLabel="Add Shortcut"
            />
        </>
    );
}
