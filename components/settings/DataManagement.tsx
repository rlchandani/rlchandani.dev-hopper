import React, { useState } from "react";
import { Download, Upload, ChevronRight } from "lucide-react";

interface DataManagementProps {
    onExport: () => Promise<void>;
    onImport: (file: File) => Promise<void>;
}

export default function DataManagement({ onExport, onImport }: DataManagementProps) {
    const [importing, setImporting] = useState(false);

    const handleImportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            await onImport(file);
        } finally {
            setImporting(false);
            e.target.value = "";
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Data</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Export or import your shortcuts</p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-slate-700">
                <button
                    onClick={onExport}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700/50"
                >
                    <div className="flex items-center gap-3">
                        <Download size={18} className="text-blue-500" />
                        <div className="text-left">
                            <div className="text-gray-900 dark:text-white font-medium text-sm">Export Shortcuts</div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">Download as JSON file</div>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                </button>

                <label className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Upload size={18} className="text-green-500" />
                        <div className="text-left">
                            <div className="text-gray-900 dark:text-white font-medium text-sm">
                                {importing ? "Importing..." : "Import Shortcuts"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">Merge from JSON file</div>
                        </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImportChange}
                        className="hidden"
                        disabled={importing}
                    />
                </label>
            </div>
        </section>
    );
}
