"use client";

import React, { useRef, useState } from "react";
import { X, Download, QrCode } from "lucide-react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

interface QRModalProps {
    shortcutKey: string;
    shortcutUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function QRModal({
    shortcutKey,
    shortcutUrl,
    isOpen,
    onClose,
}: QRModalProps) {
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [includeLogo, setIncludeLogo] = useState(false);
    const [renderAs, setRenderAs] = useState<"canvas" | "svg">("canvas");

    const canvasRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    // The value encoded in the QR code
    // If we want to track stats, we should probably point to the search API if possible,
    // but for now let's use the direct destination URL as it's the most reliable fallback.
    // Ideally: `${window.location.origin}/api/search?q=${shortcutKey}`
    // But we can just default to the direct URL for now or construct the search URL.
    // Let's use the direct URL to be safe, or we can use a relative URL if we want to hit the API.
    // Actually, for a QR code to be useful offline/scanned, it needs a full URL.
    // Let's stick with the raw target URL for simplicity as per plan.
    const qrValue = shortcutUrl;

    const handleDownload = (type: "png" | "svg") => {
        if (type === "png") {
            // Find the canvas inside the wrapper
            const canvas = canvasRef.current?.querySelector("canvas");
            if (canvas) {
                const url = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = url;
                a.download = `qr-${shortcutKey}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } else {
            // Find the svg inside the wrapper
            const svg = svgRef.current?.querySelector("svg");
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `qr-${shortcutKey}.svg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    };

    const imageSettings = includeLogo
        ? {
            src: "/icon.svg", // Assuming this exists in public/
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
        }
        : undefined;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <QrCode className="text-purple-500" />
                            QR Code: /{shortcutKey}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Center Preview */}
                    <div className="flex justify-center bg-gray-50 dark:bg-slate-800/50 p-8 rounded-xl border border-gray-200 dark:border-slate-700">
                        {renderAs === "canvas" ? (
                            <div ref={canvasRef}>
                                <QRCodeCanvas
                                    value={qrValue}
                                    size={200}
                                    fgColor={fgColor}
                                    bgColor={bgColor}
                                    level={"H"} // High error correction for logos
                                    imageSettings={imageSettings}
                                />
                            </div>
                        ) : (
                            <div ref={svgRef}>
                                <QRCodeSVG
                                    value={qrValue}
                                    size={200}
                                    fgColor={fgColor}
                                    bgColor={bgColor}
                                    level={"H"}
                                    imageSettings={imageSettings}
                                />
                            </div>
                        )}
                    </div>

                    {/* Customization Controls */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Foreground</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="h-10 w-10 p-1 rounded-lg border border-gray-300 dark:border-slate-600 cursor-pointer bg-white"
                                />
                                <span className="text-sm font-mono text-gray-600 dark:text-slate-300">{fgColor}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">Background</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="h-10 w-10 p-1 rounded-lg border border-gray-300 dark:border-slate-600 cursor-pointer bg-white"
                                />
                                <span className="text-sm font-mono text-gray-600 dark:text-slate-300">{bgColor}</span>
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={includeLogo}
                                onChange={(e) => setIncludeLogo(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Include App Logo</span>
                        </label>

                        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setRenderAs("canvas")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${renderAs === "canvas" ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-slate-300"}`}
                            >
                                PNG Mode
                            </button>
                            <button
                                onClick={() => setRenderAs("svg")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${renderAs === "svg" ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-slate-300"}`}
                            >
                                SVG Mode
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                        <button
                            onClick={() => handleDownload("png")}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
                        >
                            <Download size={16} />
                            Download PNG
                        </button>
                        <button
                            onClick={() => handleDownload("svg")}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                        >
                            <Download size={16} />
                            Download SVG
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
