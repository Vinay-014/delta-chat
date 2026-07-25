import React, { useState } from "react";
import { DeltaReport, DeltaEntry, ChangeType } from "../types";
import { Search, Filter, Download, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, Layers, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeltaMatrixTableProps {
  report: DeltaReport;
  selectedDeltaId: string | null;
  onSelectDelta: (id: string | null) => void;
  onNavigate?: (tab: string) => void;
  isStandaloneView?: boolean;
}

export const DeltaMatrixTable: React.FC<DeltaMatrixTableProps> = ({
  report,
  selectedDeltaId,
  onSelectDelta,
  onNavigate,
  isStandaloneView = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [changeTypeFilter, setChangeTypeFilter] = useState<string>("ALL");
  const [elementTypeFilter, setElementTypeFilter] = useState<string>("ALL");
  const [showPopover, setShowPopover] = useState(false);

  const changeTypes: ChangeType[] = ["ADDED", "REMOVED", "MODIFIED", "MOVED"];

  const filteredEntries = report.entries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.element_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChangeType = changeTypeFilter === "ALL" || entry.change_type === changeTypeFilter;
    const matchesElementType = elementTypeFilter === "ALL" || entry.element_type === elementTypeFilter;

    return matchesSearch && matchesChangeType && matchesElementType;
  });

  const getBadgeStyle = (changeType: ChangeType) => {
    switch (changeType) {
      case "ADDED":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
      case "REMOVED":
        return "bg-rose-950 text-rose-400 border-rose-800";
      case "MODIFIED":
        return "bg-amber-950 text-amber-400 border-amber-800";
      case "MOVED":
        return "bg-blue-950 text-blue-400 border-blue-800";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const handleDownload = (format: "json" | "md" | "html") => {
    let content = "";
    let mimeType = "text/plain";
    let filename = `PID_Delta_Report_${report.revision_a}_vs_${report.revision_b}.${format}`;

    if (format === "json") {
      content = JSON.stringify(report, null, 2);
      mimeType = "application/json";
    } else if (format === "md") {
      content = `# P&ID Delta Report\n\nRevision ${report.revision_a} vs ${report.revision_b}\n\nTotal Changes: ${report.total_changes}\n\n` +
        report.entries.map((e) => `- [${e.change_type}] ${e.element_type}: ${e.description}`).join("\n");
      mimeType = "text/markdown";
    } else if (format === "html") {
      content = `<html><body><h1>P&ID Delta Report</h1><p>Revisions: ${report.revision_a} vs ${report.revision_b}</p></body></html>`;
      mimeType = "text/html";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="delta-matrix-section"
      className={`space-y-4 transition-all duration-200 ${
        isStandaloneView
          ? "p-5 bg-slate-900 border border-slate-800 rounded-xl"
          : ""
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                P&ID Structured Delta Matrix Report
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                Direct View
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Deterministic revision comparison ({report.revision_a} vs {report.revision_b})
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center shadow-sm">
          <div className="text-xs text-slate-400">Total Deltas</div>
          <div className="text-xl font-bold text-slate-100 font-mono mt-1">{report.total_changes}</div>
        </div>
        <div className="bg-slate-900 border border-emerald-900/40 p-3 rounded-xl text-center shadow-sm">
          <div className="text-xs text-emerald-400 font-medium">Added</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{report.added_count}</div>
        </div>
        <div className="bg-slate-900 border border-rose-900/40 p-3 rounded-xl text-center shadow-sm">
          <div className="text-xs text-rose-400 font-medium">Removed</div>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">{report.removed_count}</div>
        </div>
        <div className="bg-slate-900 border border-amber-900/40 p-3 rounded-xl text-center shadow-sm">
          <div className="text-xs text-amber-400 font-medium">Modified</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">{report.modified_count}</div>
        </div>
        <div className="bg-slate-900 border border-blue-900/40 p-3 rounded-xl text-center shadow-sm">
          <div className="text-xs text-blue-400 font-medium">Moved</div>
          <div className="text-xl font-bold text-blue-400 font-mono mt-1">{report.moved_count}</div>
        </div>
      </div>

      {/* Filter & Export Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search deltas by tag, element, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Change Type Filter */}
          <select
            value={changeTypeFilter}
            onChange={(e) => setChangeTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Changes</option>
            {changeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload("json")}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => handleDownload("md")}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {/* Delta Entries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Delta ID</th>
                <th className="px-4 py-3">Change Type</th>
                <th className="px-4 py-3">Element Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.map((entry) => {
                const isSelected = selectedDeltaId === entry.id;
                return (
                  <tr
                    key={entry.id}
                    onClick={() => onSelectDelta(entry.id)}
                    className={`cursor-pointer transition hover:bg-slate-800/50 ${
                      isSelected ? "bg-cyan-950/60 border-l-4 border-cyan-500 text-slate-100 font-medium" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{entry.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getBadgeStyle(entry.change_type)}`}>
                        {entry.change_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-200">{entry.element_type}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-md">{entry.description}</td>
                    <td className="px-4 py-3 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5">
                          <div
                            className="bg-cyan-500 h-1.5 rounded-full"
                            style={{ width: `${entry.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span>{(entry.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDelta(entry.id);
                          if (onNavigate) {
                            onNavigate("viewer");
                          }
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 hover:text-cyan-200 text-[11px] font-bold rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer"
                        title="Focus bounding box in P&ID Canvas Viewer"
                      >
                        <span>Focus Box</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
