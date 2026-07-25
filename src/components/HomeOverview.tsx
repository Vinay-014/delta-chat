import React, { useState } from "react";
import {
  FileDiff,
  Layers,
  Activity,
  Award,
  MessageSquareCode,
  ArrowRight,
  Workflow,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";
import { motion } from "motion/react";
import { IngestionSelector } from "./IngestionSelector";

interface HomeOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenChat: () => void;
  selectedAdapter: string;
  onSelectAdapter: (adapter: string) => void;
  onCustomFileUpload?: (fileA: File | null, fileB: File | null) => void;
  onSelectSamplePair: (pairKey: string) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  onNavigate,
  onOpenChat,
  selectedAdapter,
  onSelectAdapter,
  onCustomFileUpload,
  onSelectSamplePair,
}) => {
  const [isInitializing, setIsInitializing] = useState(false);

  const handleReinit = () => {
    setIsInitializing(true);
    setTimeout(() => {
      setIsInitializing(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 pb-6"
    >
      {/* Spacious Clean Hero Header Section (No Border Box) */}
      <div className="py-8 sm:py-12 md:py-14 text-center flex flex-col items-center justify-center max-w-5xl mx-auto space-y-8 relative">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 flex flex-col items-center text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-xs sm:text-sm text-cyan-400 font-mono shadow-sm">
            <FileDiff className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">P&ID Revision Delta Engine v1.0</span>
          </div>

          <h1 className="font-google-sans text-3xl sm:text-5xl lg:text-6xl font-normal text-slate-100 tracking-tight leading-tight max-w-4xl">
            Automated P&ID Revision Comparison & Grounded Spatial RAG
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Ingest engineering P&ID drawings (native PDF, scanned OCR, or AutoCAD DWG). Automatically extract drawing elements, align revisions, compute structured deltas, and interact via spatial AI citations.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("viewer")}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transition transform hover:-translate-y-0.5"
            >
              <Eye className="w-5 h-5" />
              <span>Launch Canvas Viewer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenChat}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-sm sm:text-base rounded-xl transition transform hover:-translate-y-0.5"
            >
              <MessageSquareCode className="w-5 h-5 text-cyan-400" />
              <span>Grounded Chat</span>
            </button>

            <button
              onClick={() => onNavigate("eval")}
              className="inline-flex items-center space-x-2.5 px-5 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl transition"
            >
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Evaluation Scorecard</span>
            </button>
          </div>
        </div>

        {/* System Pipeline Readiness Bar */}
        <div className="pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm relative z-10">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Pipeline Status:</span>
            <span className="text-emerald-400 font-mono font-medium bg-emerald-950/70 px-3 py-1 rounded-md border border-emerald-800/80 text-xs sm:text-sm">
              {isInitializing ? "Re-syncing AI Modules..." : "Ready & Grounded"}
            </span>
          </div>

          <button
            onClick={handleReinit}
            className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 font-mono transition"
          >
            <RefreshCw className={`w-4 h-4 ${isInitializing ? "animate-spin" : ""}`} />
            <span>Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Multimodal P&ID Drawing Ingestion & Upload Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 px-1">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Drawing Upload & Ingestion Workbench
          </h2>
        </div>
        <IngestionSelector
          selectedAdapter={selectedAdapter}
          onSelectAdapter={onSelectAdapter}
          onCustomFileUpload={onCustomFileUpload}
          onSelectSamplePair={onSelectSamplePair}
          onNavigate={onNavigate}
          onOpenChat={onOpenChat}
          isCollapsible={false}
          defaultExpanded={true}
        />
      </div>

      {/* Architecture & Pipeline Flow Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Ingestion Pipeline Architecture</h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Format-Agnostic Workflow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
          {/* Step 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">01. Ingestion</span>
            <h3 className="text-xs font-bold text-slate-200">Multimodal Adapters</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Resolves PID A & B bytes across PDF, OCR & DWG layers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">02. Canonical</span>
            <h3 className="text-xs font-bold text-slate-200">Intermediate Model</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Extracts bounding geometry, equipment tags & pipelines.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">03. Delta Engine</span>
            <h3 className="text-xs font-bold text-slate-200">Spatial Comparison</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Computes added, removed, modified & moved equipment.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">04. Grounded RAG</span>
            <h3 className="text-xs font-bold text-slate-200">Multi-LLM Grounding</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Spatial citations like <code className="text-[10px] text-cyan-300">[VALVE-V102]</code> auto-zoom canvas.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">05. Observability</span>
            <h3 className="text-xs font-bold text-slate-200">Tracing & Eval</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Telemetry, token cost metrics & precision scorecards.
            </p>
          </div>
        </div>
      </div>

      {/* Deliverable Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Module 1 */}
        <div
          onClick={() => onNavigate("viewer")}
          className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-4 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center mb-2.5 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition">
            1. P&ID Canvas & Delta Markup
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Side-by-side canvas overlaying color-coded bounding boxes for Rev A vs Rev B.
          </p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-cyan-400">
            <span>Explore Viewer</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Module 2 */}
        <div
          onClick={() => onNavigate("delta")}
          className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-4 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-2.5 text-blue-400">
            <FileDiff className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition">
            2. Structured Delta Matrix
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Machine-parseable JSON & Markdown audit reports listing all revision entries.
          </p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-blue-400">
            <span>Inspect Delta Matrix</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Module 3 */}
        <div
          onClick={onOpenChat}
          className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-4 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-2.5 text-purple-400">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100 group-hover:text-purple-400 transition">
            3. Grounded Spatial AI Chat
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Interactive overlay with spatial citations that highlight drawing elements on click.
          </p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-purple-400">
            <span>Open Chat Overlay</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Module 4 */}
        <div
          onClick={() => onNavigate("observability")}
          className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/60 p-4 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-2.5 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition">
            4. Tracing & Telemetry
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            Real-time latency breakdown, multi-provider failover metrics, and token costs.
          </p>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
            <span>View Observability</span>
            <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
