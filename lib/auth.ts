import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User
} from "firebase/auth";
import { auth } from "./firebase";

export const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = async () => {
    return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, callback);
};

export type { User };
