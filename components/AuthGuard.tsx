"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !user) {
                // Preserve current search params when redirecting to login
                const searchParams = new URLSearchParams(window.location.search);
                router.push(`/login?${searchParams.toString()}`);
            } else if (!requireAuth && user) {
                router.push("/");
            }
        }
    }, [user, loading, requireAuth, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (requireAuth && !user) return null;
    if (!requireAuth && user) return null;

    return <>{children}</>;
}
