import React, { useState } from "react";
import { DocumentModel, DeltaReport, DeltaEntry, ChangeType } from "../types";
import { ZoomIn, ZoomOut, Eye, Filter, Layers, CheckCircle2, AlertCircle } from "lucide-react";

interface PIDCanvasViewerProps {
  docA: DocumentModel;
  docB: DocumentModel;
  deltaReport: DeltaReport;
  selectedDeltaId: string | null;
  onSelectDelta: (id: string | null) => void;
}

export const PIDCanvasViewer: React.FC<PIDCanvasViewerProps> = ({
  docA,
  docB,
  deltaReport,
  selectedDeltaId,
  onSelectDelta,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showBBoxes, setShowBBoxes] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [filterChangeType, setFilterChangeType] = useState<string>("ALL");

  const getBBoxColor = (changeType?: ChangeType) => {
    switch (changeType) {
      case "ADDED":
        return { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.15)", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
      case "REMOVED":
        return { stroke: "#f43f5e", fill: "rgba(244, 63, 94, 0.15)", bg: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
      case "MODIFIED":
        return { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.15)", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
      case "MOVED":
        return { stroke: "#3b82f6", fill: "rgba(59, 130, 246, 0.15)", bg: "bg-blue-500/20 text-blue-400 border-blue-500/40" };
      default:
        return { stroke: "#64748b", fill: "rgba(100, 116, 139, 0.05)", bg: "bg-slate-700/20 text-slate-400 border-slate-700" };
    }
  };

  const getDeltaForElement = (elemId: string, revision: "RevA" | "RevB"): DeltaEntry | undefined => {
    return deltaReport.entries.find((entry) => {
      if (revision === "RevA" && entry.rev_a_element?.id === elemId) return true;
      if (revision === "RevB" && entry.rev_b_element?.id === elemId) return true;
      return false;
    });
  };

  const selectedEntry = selectedDeltaId ? deltaReport.entries.find((e) => e.id === selectedDeltaId) : null;

  return (
    <div className="space-y-4">
      {/* Active Focus Notification Banner */}
      {selectedDeltaId && selectedEntry && (
        <div className="bg-cyan-950/80 border border-cyan-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-cyan-200 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center space-x-2.5 flex-1 min-w-[280px]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">Focused Delta:</span>
            <span className="font-mono text-cyan-300 font-bold px-2 py-0.5 bg-slate-900 border border-cyan-800 rounded">
              {selectedDeltaId}
            </span>
            <span className="text-slate-300 truncate max-w-md">
              {selectedEntry.description}
            </span>
          </div>
          <button
            onClick={() => onSelectDelta(null)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold px-3 py-1 rounded-lg border border-cyan-800/80 transition cursor-pointer"
          >
            Clear Focus
          </button>
        </div>
      )}

      {/* Viewer Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowBBoxes(!showBBoxes)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              showBBoxes
                ? "bg-cyan-950 text-cyan-400 border-cyan-800"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Bounding Boxes</span>
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              showLabels
                ? "bg-cyan-950 text-cyan-400 border-cyan-800"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tag Labels</span>
          </button>
        </div>

        {/* Change Type Legend */}
        <div className="flex items-center space-x-3 text-xs font-medium">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Added</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Removed</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Modified</span>
          </span>
          <span className="flex items-center space-x-1 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Moved</span>
          </span>
        </div>
      </div>

      {/* Side-by-Side Diagram Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revision A Canvas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold bg-slate-800 text-slate-200 rounded">
                REVISION A
              </span>
              <span className="text-xs text-slate-400 font-mono">{docA.filename}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{docA.elements.length} elements</span>
          </div>

          <div className="p-4 overflow-auto flex-1 min-h-[460px] bg-slate-950/80 relative">
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
              className="relative w-[800px] h-[480px] bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner"
            >
              {/* Grid background lines to mimic P&ID engineering schematic */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="gridA" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridA)" />
              </svg>

              {/* Render Elements & Bounding Boxes for Rev A */}
              <svg className="absolute inset-0 w-full h-full">
                {docA.elements.map((elem) => {
                  const delta = getDeltaForElement(elem.id, "RevA");
                  const colors = getBBoxColor(delta?.change_type);
                  const isSelected = selectedDeltaId && delta?.id === selectedDeltaId;

                  return (
                    <g
                      key={elem.id}
                      onClick={() => delta && onSelectDelta(delta.id)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {/* Bounding box rect */}
                      {showBBoxes && (
                        <>
                          {isSelected && (
                            <rect
                              x={elem.bbox.x1 - 4}
                              y={elem.bbox.y1 - 4}
                              width={elem.bbox.x2 - elem.bbox.x1 + 8}
                              height={elem.bbox.y2 - elem.bbox.y1 + 8}
                              fill="rgba(56, 189, 248, 0.25)"
                              stroke="#38bdf8"
                              strokeWidth={2.5}
                              strokeDasharray="4 2"
                              rx={6}
                            />
                          )}
                          <rect
                            x={elem.bbox.x1}
                            y={elem.bbox.y1}
                            width={elem.bbox.x2 - elem.bbox.x1}
                            height={elem.bbox.y2 - elem.bbox.y1}
                            fill={colors.fill}
                            stroke={isSelected ? "#38bdf8" : colors.stroke}
                            strokeWidth={isSelected ? 3 : 1.5}
                            strokeDasharray={delta?.change_type === "REMOVED" ? "4 2" : undefined}
                            rx={3}
                          />
                        </>
                      )}

                      {/* Tag Text Label */}
                      {showLabels && (
                        <text
                          x={elem.bbox.x1 + 4}
                          y={elem.bbox.y1 + 14}
                          fill={isSelected ? "#38bdf8" : "#f1f5f9"}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {elem.text}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Revision B Canvas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                REVISION B
              </span>
              <span className="text-xs text-slate-400 font-mono">{docB.filename}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{docB.elements.length} elements</span>
          </div>

          <div className="p-4 overflow-auto flex-1 min-h-[460px] bg-slate-950/80 relative">
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
              className="relative w-[800px] h-[480px] bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner"
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="gridB" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridB)" />
              </svg>

              {/* Render Elements & Bounding Boxes for Rev B */}
              <svg className="absolute inset-0 w-full h-full">
                {docB.elements.map((elem) => {
                  const delta = getDeltaForElement(elem.id, "RevB");
                  const colors = getBBoxColor(delta?.change_type);
                  const isSelected = selectedDeltaId && delta?.id === selectedDeltaId;

                  return (
                    <g
                      key={elem.id}
                      onClick={() => delta && onSelectDelta(delta.id)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {showBBoxes && (
                        <>
                          {isSelected && (
                            <rect
                              x={elem.bbox.x1 - 4}
                              y={elem.bbox.y1 - 4}
                              width={elem.bbox.x2 - elem.bbox.x1 + 8}
                              height={elem.bbox.y2 - elem.bbox.y1 + 8}
                              fill="rgba(56, 189, 248, 0.25)"
                              stroke="#38bdf8"
                              strokeWidth={2.5}
                              strokeDasharray="4 2"
                              rx={6}
                            />
                          )}
                          <rect
                            x={elem.bbox.x1}
                            y={elem.bbox.y1}
                            width={elem.bbox.x2 - elem.bbox.x1}
                            height={elem.bbox.y2 - elem.bbox.y1}
                            fill={colors.fill}
                            stroke={isSelected ? "#38bdf8" : colors.stroke}
                            strokeWidth={isSelected ? 3 : 1.5}
                            rx={3}
                          />
                        </>
                      )}

                      {showLabels && (
                        <text
                          x={elem.bbox.x1 + 4}
                          y={elem.bbox.y1 + 14}
                          fill={isSelected ? "#38bdf8" : "#f1f5f9"}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {elem.text}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
