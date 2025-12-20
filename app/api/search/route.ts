import { NextRequest, NextResponse } from "next/server";
import { getUserIdByApiKey, getAllShortcuts, getUserSettings } from "@/lib/firebase";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || searchParams.get("token");
    const q = searchParams.get("q") || searchParams.get("search");

    if (!key) {
        return NextResponse.json({ error: "Missing API Key. Use ?key=YOUR_KEY" }, { status: 401 });
    }

    try {
        const userId = await getUserIdByApiKey(key);

        if (!userId) {
            // Redirect to homepage with error param so user can login/regenerate
            const url = new URL("/", request.url);
            url.searchParams.set("error", "invalid_key");
            return NextResponse.redirect(url, 307);
        }

        if (!q) {
            // If no query, maybe redirect to dashboard?
            return NextResponse.redirect(new URL("/", request.url));
        }

        const shortcuts = await getAllShortcuts(userId);
        const settings = await getUserSettings(userId);

        // 1. Priority: Prefix Matches (e.g. $AMZN)
        const prefixShortcut = shortcuts.find(s => s.isPrefix && q.toLowerCase().startsWith(s.key.toLowerCase()));

        if (prefixShortcut) {
            const args = q.slice(prefixShortcut.key.length).trim();
            const url = prefixShortcut.url.replace("%s", encodeURIComponent(args));
            return NextResponse.redirect(url, 307);
        }

        // 2. Standard Space-Delimited Match
        const parts = q.trim().split(" ");
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        // Find matching shortcut
        // Note: We don't support profile scoping in API route yet, or we assume "all" profiles?
        // getAllShortcuts fetches ALL shortcuts for the user.
        // Dashboard logic: "search all (priority to personal?)"
        // Let's match exact key first.

        // Priority: Exact match
        const profileParam = searchParams.get("profile");

        const targetShortcut = shortcuts.find(s => {
            if (profileParam && s.profile !== profileParam) return false;
            return s.key.toLowerCase() === command;
        });

        if (targetShortcut) {
            let url = targetShortcut.url;
            if (url.includes("%s")) {
                url = url.replace("%s", encodeURIComponent(args));
            }
            return NextResponse.redirect(url, 307);
        } else {
            // Fallback
            let fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
            if (settings.fallbackSearch === "duckduckgo") {
                fallbackUrl = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
            } else if (settings.fallbackSearch === "bing") {
                fallbackUrl = `https://bing.com/search?q=${encodeURIComponent(q)}`;
            } else if (settings.fallbackSearch === "none") {
                return NextResponse.json({ error: "No shortcut found and fallback disabled" }, { status: 404 });
            }
            return NextResponse.redirect(fallbackUrl, 307);
        }

    } catch (error) {
        console.error("API Search Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
