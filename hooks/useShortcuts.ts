import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllShortcuts, addShortcut as addFirestoreShortcut, updateShortcut as updateFirestoreShortcut, deleteShortcut as deleteFirestoreShortcut, getProfiles, getUserSettings, Shortcut, UserSettings } from '@/lib/firebase';

export function useShortcuts() {
    const { user } = useAuth();
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
    const [profiles, setProfiles] = useState<string[]>([]);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [shortcutsData, profilesData, settingsData] = await Promise.all([
                getAllShortcuts(user.uid),
                getProfiles(user.uid),
                getUserSettings(user.uid),
            ]);
            setShortcuts(shortcutsData);
            setProfiles(profilesData);
            setSettings(settingsData);
            setError(null);
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const add = async (key: string, url: string, targetProfile: string, isPrefix?: boolean) => {
        if (!user) throw new Error("Not authenticated");

        try {
            await addFirestoreShortcut(user.uid, { key, url, profile: targetProfile, isPrefix });
            await fetchData();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const remove = async (id: string) => {
        try {
            await deleteFirestoreShortcut(id);
            setShortcuts(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const update = async (id: string, key: string, url: string, profile: string, isPrefix?: boolean) => {
        if (!user) throw new Error("Not authenticated");

        try {
            await updateFirestoreShortcut(user.uid, id, { key, url, profile, isPrefix });
            await fetchData();
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    return { shortcuts, profiles, settings, loading, error, add, update, remove, refresh: fetchData };
}
