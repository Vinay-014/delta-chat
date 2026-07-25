import React, { useState, useRef } from "react";
import {
  FileText,
  Cpu,
  Layers,
  Upload,
  CheckCircle2,
  FileUp,
  Sparkles,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  SlidersHorizontal,
  FileCheck2,
  X,
  ArrowRight,
  Eye,
  MessageSquareCode,
  FileDiff,
  HelpCircle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IngestionSelectorProps {
  selectedAdapter: string;
  onSelectAdapter: (adapter: string) => void;
  onSelectSamplePair: (pairKey: string) => void;
  onCustomFileUpload?: (fileA: File | null, fileB: File | null) => void;
  onNavigate?: (tab: string) => void;
  onOpenChat?: () => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

export const IngestionSelector: React.FC<IngestionSelectorProps> = ({
  selectedAdapter,
  onSelectAdapter,
  onSelectSamplePair,
  onCustomFileUpload,
  onNavigate,
  onOpenChat,
  isCollapsible = true,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedPair, setSelectedPair] = useState<string>("cdu_101");
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [showInstructionModal, setShowInstructionModal] = useState<boolean>(false);

  const fileInputARef = useRef<HTMLInputElement>(null);
  const fileInputBRef = useRef<HTMLInputElement>(null);

  const adapters = [
    {
      id: "PDFNativeAdapter",
      name: "PDF Native Adapter",
      desc: "Direct vector path & font parsing",
      badge: "Vector High-Precision",
      icon: FileText,
    },
    {
      id: "PDFScannedAdapter",
      name: "PDF Scanned Adapter",
      desc: "OCR text + OpenCV layout vision",
      badge: "Raster Neural OCR",
      icon: Cpu,
    },
    {
      id: "DWGAdapter",
      name: "AutoCAD DWG Adapter",
      desc: "CAD entity layers & block attributes",
      badge: "Native CAD DXF/DWG",
      icon: Layers,
    },
  ];

  const samplePairs = [
    {
      id: "cdu_101",
      title: "Crude Distillation Unit (CDU-101)",
      subtitle: "Rev A vs Rev B Benchmark",
      desc: "+1 Valve V-102, expanded line 3\"➔4\", moved P-101A",
    },
    {
      id: "fcc_202",
      title: "Fluid Catalytic Cracker (FCC-202)",
      subtitle: "Rev A vs Rev B Benchmark",
      desc: "TK-201 design specs modified, added pressure transmitter",
    },
  ];

  const handleFileAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileA(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleFileBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileB(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleRunCustomAnalysis = async () => {
    if (!fileA && !fileB) return;
    setIsProcessing(true);
    setUploadSuccess(false);

    try {
      if (onCustomFileUpload) {
        await onCustomFileUpload(fileA, fileB);
      }
      setUploadSuccess(true);
      setShowInstructionModal(true);
    } catch (err) {
      console.error("Ingestion failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentAdapterObj = adapters.find((a) => a.id === selectedAdapter) || adapters[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Sleek Enterprise Workspace Top Bar */}
      <div className="bg-slate-950 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <FolderOpen className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-100">P&ID Document Workbench</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full font-bold">
                {fileA || fileB ? "Custom Multimodal Files" : selectedPair === "cdu_101" ? "CDU-101 Test Pair" : "FCC-202 Test Pair"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Ingestion Strategy: <strong className="text-cyan-300 font-mono">{currentAdapterObj.name}</strong> ({currentAdapterObj.badge})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {(fileA || fileB) && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunCustomAnalysis}
                disabled={isProcessing}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing Drawings...</span>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    <span>Delta Re-Computed</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Delta Analysis</span>
                  </>
                )}
              </button>

              {uploadSuccess && (
                <button
                  onClick={() => setShowInstructionModal(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition"
                  title="View Next Steps Instructions"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How to View Results?</span>
                </button>
              )}
            </div>
          )}

          {isCollapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isExpanded ? "Collapse Ingestion Lab" : "Upload Files & Adapter Settings"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Workbench Body */}
      <AnimatePresence>
        {(!isCollapsible || isExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 bg-slate-900/90 space-y-5 border-t border-slate-800/60">
              {/* Multimodal File Upload Zone */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                      Multimodal P&ID Drawing Upload Dropzone
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Supports PDF, PNG, JPG, DWG</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Rev A Card */}
                  <div
                    onClick={() => fileInputARef.current?.click()}
                    className={`border border-dashed rounded-xl p-4 cursor-pointer transition flex flex-col items-center justify-center text-center ${
                      fileA
                        ? "border-cyan-500 bg-cyan-950/20"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputARef}
                      onChange={handleFileAChange}
                      accept=".pdf,.png,.jpg,.jpeg,.dwg"
                      className="hidden"
                    />
                    <FileUp className={`w-5 h-5 mb-2 ${fileA ? "text-cyan-400" : "text-slate-500"}`} />
                    <div className="text-xs font-bold text-slate-200">
                      {fileA ? fileA.name : "Upload Revision A Drawing (Baseline)"}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {fileA ? `${(fileA.size / 1024 / 1024).toFixed(2)} MB • Baseline Ready` : "Click or drag & drop baseline P&ID document"}
                    </p>
                  </div>

                  {/* Rev B Card */}
                  <div
                    onClick={() => fileInputBRef.current?.click()}
                    className={`border border-dashed rounded-xl p-4 cursor-pointer transition flex flex-col items-center justify-center text-center ${
                      fileB
                        ? "border-amber-500 bg-amber-950/20"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputBRef}
                      onChange={handleFileBChange}
                      accept=".pdf,.png,.jpg,.jpeg,.dwg"
                      className="hidden"
                    />
                    <FileUp className={`w-5 h-5 mb-2 ${fileB ? "text-amber-400" : "text-slate-500"}`} />
                    <div className="text-xs font-bold text-slate-200">
                      {fileB ? fileB.name : "Upload Revision B Drawing (Modified)"}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {fileB ? `${(fileB.size / 1024 / 1024).toFixed(2)} MB • Revision Ready` : "Click or drag & drop revised P&ID document"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Adapter Strategy & Sample Benchmark Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Adapter Selector */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Ingestion Adapter Strategy</span>
                  </h3>

                  <div className="space-y-2">
                    {adapters.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedAdapter === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectAdapter(item.id)}
                          className={`cursor-pointer p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                            isSelected
                              ? "bg-cyan-950/60 border-cyan-500 text-slate-100 shadow-md shadow-cyan-500/10"
                              : "bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-400"}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-200">{item.name}</div>
                              <div className="text-[10px] text-slate-400">{item.desc}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {item.badge}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preset Benchmark Pairs */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                      <FileCheck2 className="w-4 h-4 text-cyan-400" />
                      <span>Preset Benchmark Test Pairs</span>
                    </h3>
                    <span className="text-[10px] bg-cyan-950/80 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-800/80 font-semibold">
                      Pre-Loaded Demo
                    </span>
                  </div>

                  {/* Instructional Text without inner box border */}
                  <div className="px-1 py-0.5 text-[11px] leading-relaxed space-y-1">
                    <p className="font-semibold text-cyan-300 flex items-center space-x-1.5 text-[12px]">
                      <span>💡 Pre-Loaded Sample Datasets</span>
                    </p>
                    <p className="text-slate-300 text-[11px] leading-snug">
                      These are pre-loaded engineering drawing comparisons (P&amp;ID Revision A vs. Revision B) designed for instant testing and demonstration without requiring you to upload your own CAD or PDF files.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {samplePairs.map((pair) => {
                      const isSelected = selectedPair === pair.id;
                      return (
                        <div
                          key={pair.id}
                          onClick={() => {
                            setSelectedPair(pair.id);
                            onSelectSamplePair(pair.id);
                          }}
                          className={`cursor-pointer p-3 rounded-xl border text-xs transition ${
                            isSelected
                              ? "bg-cyan-950/60 border-cyan-500 text-slate-100 shadow-md shadow-cyan-500/10"
                              : "bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-200">{pair.title}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <p className="text-[10px] text-cyan-300 font-mono mb-1">{pair.subtitle}</p>
                          <p className="text-[11px] text-slate-400">{pair.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-Up Instruction Guide Modal after uploading drawing files */}
      <AnimatePresence>
        {showInstructionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl shadow-cyan-950/80 text-slate-100 relative"
            >
              {/* Modal Top Header */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
                      <span>P&ID Revision Delta Computed!</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold">
                        Analysis Ready
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Your uploaded Rev A & Rev B drawings have been parsed & aligned.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInstructionModal(false)}
                  className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawing Summary Banner */}
              <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
                <div className="text-slate-300">
                  <span className="text-slate-500">Rev A:</span> <strong className="text-cyan-400">{fileA?.name || "Baseline Drawing"}</strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">Rev B:</span> <strong className="text-amber-400">{fileB?.name || "Modified Drawing"}</strong>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Adapter: <span className="text-cyan-300 font-bold">{currentAdapterObj.name}</span>
                </div>
              </div>

              {/* Instructions Steps */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Next Steps: How to View & Evaluate Your Delta Results</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Step 1: P&ID Canvas Viewer */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 hover:border-cyan-500/50 transition flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                          <span>1. P&ID Viewer & Bounding Boxes</span>
                          <span className="text-[10px] text-cyan-400 font-mono">Side-by-Side</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Visually inspect color-coded bounding boxes overlaying added, modified, relocated & deleted items on the drawing canvas.
                        </p>
                      </div>
                    </div>
                    {onNavigate && (
                      <button
                        onClick={() => {
                          setShowInstructionModal(false);
                          onNavigate("viewer");
                        }}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition shrink-0 flex items-center space-x-1"
                      >
                        <span>Canvas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Step 2: Delta Matrix Table */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 hover:border-cyan-500/50 transition flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <FileDiff className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                          <span>2. Delta Matrix Table</span>
                          <span className="text-[10px] text-blue-400 font-mono">Structured Audit</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Review line-by-line engineering delta entries with element types, confidence scores, and exportable audit logs.
                        </p>
                      </div>
                    </div>
                    {onNavigate && (
                      <button
                        onClick={() => {
                          setShowInstructionModal(false);
                          onNavigate("delta");
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-lg transition shrink-0 flex items-center space-x-1 border border-slate-700"
                      >
                        <span>Matrix</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Step 3: Grounded AI Chat */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 hover:border-cyan-500/50 transition flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <MessageSquareCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                          <span>3. Grounded Spatial AI Chat</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Citations</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Ask AI questions about drawing modifications. Click citation tags like <code className="text-cyan-300 font-mono bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800">[VALVE-V102]</code> to auto-zoom bounding boxes.
                        </p>
                      </div>
                    </div>
                    {onOpenChat && (
                      <button
                        onClick={() => {
                          setShowInstructionModal(false);
                          onOpenChat();
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-lg transition shrink-0 flex items-center space-x-1 shadow-md shadow-cyan-500/20"
                      >
                        <span>Chat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Tip: You can re-open these instructions anytime from the document toolbar.
                </span>
                <button
                  onClick={() => setShowInstructionModal(false)}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-lg transition"
                >
                  Got It, Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
