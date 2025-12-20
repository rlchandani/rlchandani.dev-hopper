import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, where, writeBatch, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Data Types
export interface Shortcut {
  id: string;
  key: string;
  url: string;
  profile: string;
  userId: string; // User-scoped shortcuts
}

export interface UserSettings {
  fallbackSearch: "google" | "duckduckgo" | "bing" | "none";
  profiles: string[];
  apiKey?: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  fallbackSearch: "google",
  profiles: ["personal", "work"],
};

// ============================================
// USER SETTINGS (per-user profiles & settings)
// ============================================

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    const docRef = doc(db, "users", userId, "settings", "preferences");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as UserSettings;
    }
  } catch (error) {
    console.error("Error fetching user settings:", error);
  }
  return DEFAULT_SETTINGS;
};

export const saveUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
  const docRef = doc(db, "users", userId, "settings", "preferences");
  await setDoc(docRef, settings, { merge: true });
};

// ============================================
// PROFILES (stored in user settings)
// ============================================

export const getProfiles = async (userId: string): Promise<string[]> => {
  const settings = await getUserSettings(userId);
  return settings.profiles;
};

export const addProfile = async (userId: string, profileName: string) => {
  const settings = await getUserSettings(userId);
  if (!settings.profiles.includes(profileName)) {
    settings.profiles.push(profileName);
    await saveUserSettings(userId, { profiles: settings.profiles });
  }
};

export const removeProfile = async (userId: string, profileName: string) => {
  const settings = await getUserSettings(userId);
  settings.profiles = settings.profiles.filter((p) => p !== profileName);
  await saveUserSettings(userId, { profiles: settings.profiles });
};

export const renameProfile = async (userId: string, oldName: string, newName: string) => {
  const batch = writeBatch(db);

  // Update profile list
  const settings = await getUserSettings(userId);
  settings.profiles = settings.profiles.map((p) => (p === oldName ? newName : p));
  const settingsRef = doc(db, "users", userId, "settings", "preferences");
  batch.set(settingsRef, { profiles: settings.profiles }, { merge: true });

  // Get all shortcuts with the old profile name for this user
  const q = query(
    collection(db, "shortcuts"),
    where("userId", "==", userId),
    where("profile", "==", oldName)
  );
  const querySnapshot = await getDocs(q);

  // Update each shortcut
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data() as Shortcut;
    const oldId = docSnap.id;
    const newId = `${userId}_${newName}_${data.key}`;

    batch.delete(doc(db, "shortcuts", oldId));
    batch.set(doc(db, "shortcuts", newId), {
      ...data,
      id: newId,
      profile: newName,
    });
  }

  await batch.commit();
};

export const deleteProfile = async (userId: string, profileName: string) => {
  const batch = writeBatch(db);

  // Remove from profile list
  const settings = await getUserSettings(userId);
  settings.profiles = settings.profiles.filter((p) => p !== profileName);
  const settingsRef = doc(db, "users", userId, "settings", "preferences");
  batch.set(settingsRef, { profiles: settings.profiles }, { merge: true });

  // Delete all shortcuts for this profile
  const q = query(
    collection(db, "shortcuts"),
    where("userId", "==", userId),
    where("profile", "==", profileName)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    batch.delete(doc(db, "shortcuts", docSnap.id));
  });

  await batch.commit();
};

// ============================================
// SHORTCUTS (user-scoped)
// ============================================

export const getShortcuts = async (userId: string, profile: string): Promise<Shortcut[]> => {
  const shortcuts: Shortcut[] = [];
  try {
    const q = query(
      collection(db, "shortcuts"),
      where("userId", "==", userId),
      where("profile", "in", [profile, "global"])
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      shortcuts.push({ id: doc.id, ...doc.data() } as Shortcut);
    });
  } catch (error) {
    console.error("Error fetching shortcuts:", error);
  }
  return shortcuts;
};

export const getAllShortcuts = async (userId: string): Promise<Shortcut[]> => {
  const shortcuts: Shortcut[] = [];
  try {
    const q = query(
      collection(db, "shortcuts"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      shortcuts.push({ id: doc.id, ...doc.data() } as Shortcut);
    });
  } catch (error) {
    console.error("Error fetching all shortcuts:", error);
  }
  return shortcuts;
};

export const addShortcut = async (userId: string, shortcut: Omit<Shortcut, "id" | "userId">) => {
  const id = `${userId}_${shortcut.profile}_${shortcut.key}`;
  await setDoc(doc(db, "shortcuts", id), { ...shortcut, id, userId });
};

export const deleteShortcut = async (id: string) => {
  await deleteDoc(doc(db, "shortcuts", id));
};

// ============================================
// IMPORT/EXPORT (user-scoped)
// ============================================

export const exportShortcuts = async (userId: string): Promise<string> => {
  const shortcuts = await getAllShortcuts(userId);
  // Export without userId for portability
  const exportData = shortcuts.map(({ id, userId, ...rest }) => rest);
  return JSON.stringify(exportData, null, 2);
};

export const importShortcuts = async (userId: string, jsonString: string, mode: "merge" | "replace" = "merge") => {
  const shortcuts: Omit<Shortcut, "id" | "userId">[] = JSON.parse(jsonString);

  if (mode === "replace") {
    const existing = await getAllShortcuts(userId);
    const batch = writeBatch(db);
    existing.forEach((s) => batch.delete(doc(db, "shortcuts", s.id)));
    await batch.commit();
  }

  for (const shortcut of shortcuts) {
    await addShortcut(userId, {
      key: shortcut.key,
      url: shortcut.url,
      profile: shortcut.profile,
    });
  }
};
// ============================================
// API KEYS (server-side redirect access)
// ============================================

export const generateApiKey = async (userId: string): Promise<string> => {
  // Generate a random key (simple alphanumeric)
  const key = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Get current key to delete if exists
  const settings = await getUserSettings(userId);
  const oldKey = settings.apiKey;

  const batch = writeBatch(db);

  // 1. Delete old key mapping if exists
  if (oldKey) {
    batch.delete(doc(db, "apiKeys", oldKey));
  }

  // 2. Add new key mapping
  batch.set(doc(db, "apiKeys", key), { userId });

  // 3. Update user settings
  const settingsRef = doc(db, "users", userId, "settings", "preferences");
  batch.set(settingsRef, { apiKey: key }, { merge: true });

  await batch.commit();
  return key;
};

export const getUserIdByApiKey = async (apiKey: string): Promise<string | null> => {
  try {
    const docRef = doc(db, "apiKeys", apiKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().userId;
    }
  } catch (error) {
    console.error("Error looking up API key:", error);
  }
  return null;
};
