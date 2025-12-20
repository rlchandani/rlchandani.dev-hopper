"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
// Theme is now handled by generic Header component, so removing explicit theme hook usage if possible or keeping if needed elsewhere. 
// Actually we need to check if useTheme is used elsewhere. It was used for toggleTheme in the hardcoded header.
// Looking at the file content provided earlier: 
// The file used `const { theme, toggleTheme } = useTheme();` solely for the header button.
// So we can remove the hook usage and the import.
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("error") === "invalid_key") {
            setError("Invalid API Key. Please sign in to regenerate it.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard requireAuth={false}>
            <div className="min-h-dvh w-full flex flex-col bg-gray-100 dark:bg-slate-900">
                {/* Header - Modular Component */}
                <Header showLogout={false} />

                {/* Login Card */}
                <div className="flex items-center justify-center p-4 min-h-[calc(100dvh-9rem)]">
                    <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800/50 shadow-xl border border-gray-400 dark:border-slate-600 rounded-3xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="text-center mb-8">
                                <p className="text-gray-500 dark:text-slate-400 text-sm">
                                    Sign in to admin dashboard
                                </p>
                            </div>
                            {error && (
                                <div className="px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2 text-gray-500 dark:text-slate-400"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-2 text-gray-500 dark:text-slate-400"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 focus:border-gray-400 dark:focus:border-slate-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 rounded-xl font-medium bg-green-500 text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
