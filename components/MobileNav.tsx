"use client";

import React from "react";
import { Link2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const pathname = usePathname();

    const tabs = [
        { id: "shortcuts", label: "Shortcuts", icon: Link2, href: "/" },
        { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-2 flex justify-around bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-gray-200 dark:border-slate-700">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive ? "text-green-500" : "text-gray-500 dark:text-slate-400"
                            }`}
                    >
                        <tab.icon size={22} />
                        <span className="text-xs font-medium">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
