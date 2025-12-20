"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import SettingsContent from "@/components/SettingsContent";

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        // Check if desktop (md breakpoint = 768px)
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        // If desktop, redirect to home with settings drawer
        if (window.innerWidth >= 768) {
            router.replace("/?settings=open");
        }
    }, [router]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // On desktop, show nothing while redirecting
    if (!isMobile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 md:pb-0 bg-gray-100 dark:bg-slate-900">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

                <SettingsContent />
            </main>

            <MobileNav />
        </div>
    );
}
