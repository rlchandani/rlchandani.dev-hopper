import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface ProfileListProps {
    profiles: string[];
    onAdd: (name: string) => Promise<void>;
    onRename: (oldName: string, newName: string) => Promise<void>;
    onDelete: (name: string) => Promise<void>;
}

export default function ProfileList({ profiles, onAdd, onRename, onDelete }: ProfileListProps) {
    const [newProfileName, setNewProfileName] = useState("");
    const [editingProfile, setEditingProfile] = useState<string | null>(null);
    const [editedName, setEditedName] = useState("");

    const handleAdd = () => {
        if (!newProfileName.trim()) return;
        onAdd(newProfileName);
        setNewProfileName("");
    };

    const handleRename = (oldName: string) => {
        if (!editedName.trim() || editedName === oldName) {
            setEditingProfile(null);
            return;
        }
        onRename(oldName, editedName);
        setEditingProfile(null);
    };

    return (
        <section className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Profiles</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Manage your shortcut profiles</p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {profiles.map((profile) => (
                    <div key={profile} className="px-4 py-3 flex items-center justify-between">
                        {editingProfile === profile ? (
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-slate-600 focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleRename(profile);
                                        if (e.key === "Escape") setEditingProfile(null);
                                    }}
                                />
                                <button
                                    onClick={() => handleRename(profile)}
                                    className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={() => setEditingProfile(null)}
                                    className="p-1.5 text-gray-500 hover:bg-gray-500/10 rounded-lg"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="text-gray-900 dark:text-white capitalize">{profile}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingProfile(profile);
                                            setEditedName(profile);
                                        }}
                                        className="p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(profile)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* Add new profile */}
                <div className="px-4 py-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="New profile name..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm placeholder:text-gray-500 border border-gray-300 dark:border-slate-600 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        className="p-2 bg-green-500 text-black rounded-lg hover:bg-green-600"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
