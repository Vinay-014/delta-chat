import React, { useState } from "react";
import { Header } from "./components/Header";
import { IngestionSelector } from "./components/IngestionSelector";
import { PIDCanvasViewer } from "./components/PIDCanvasViewer";
import { DeltaMatrixTable } from "./components/DeltaMatrixTable";
import { GroundedChatPanel } from "./components/GroundedChatPanel";
import { GroundedChatModal } from "./components/GroundedChatModal";
import { HomeOverview } from "./components/HomeOverview";
import { ObservabilityPanel } from "./components/ObservabilityPanel";
import { EvaluationPanel } from "./components/EvaluationPanel";
import { ResultNavigator } from "./components/ResultNavigator";
import { DocumentModel, DeltaReport } from "./types";
import { MessageSquareCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedAdapter, setSelectedAdapter] = useState("PDFNativeAdapter");
  const [selectedDeltaId, setSelectedDeltaId] = useState<string | null>("delta_001");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Sample P&ID Documents State (CDU-101 Benchmark)
  const [docA, setDocA] = useState<DocumentModel>({
    doc_id: "doc_cdu_101_revA",
    filename: "CDU-101-RevA.pdf",
    format: "pdf_native",
    revision: "RevA",
    pages: 1,
    elements: [
      { id: "e1", text: "P&ID CDU-101 CRUDE DISTILLATION UNIT", bbox: { page: 1, x1: 50, y1: 20, x2: 450, y2: 45 }, type: "LABEL", confidence: 0.99 },
      { id: "e2", text: "3\"-CRU-1001-CS", bbox: { page: 1, x1: 80, y1: 180, x2: 280, y2: 200 }, type: "PIPELINE", confidence: 0.98 },
      { id: "e3", text: "V-101", bbox: { page: 1, x1: 300, y1: 175, x2: 340, y2: 205 }, type: "VALVE", confidence: 0.97 },
      { id: "e4", text: "P-101A", bbox: { page: 1, x1: 420, y1: 220, x2: 480, y2: 260 }, type: "PUMP", confidence: 0.99 },
      { id: "e5", text: "TK-201", bbox: { page: 1, x1: 600, y1: 150, x2: 780, y2: 320 }, type: "TANK", confidence: 0.99 },
      { id: "e6", text: "PT-101", bbox: { page: 1, x1: 180, y1: 140, x2: 220, y2: 165 }, type: "INSTRUMENT", confidence: 0.96 },
      { id: "e7", text: "150 PSI", bbox: { page: 1, x1: 230, y1: 140, x2: 270, y2: 160 }, type: "DIMENSION", confidence: 0.95 },
    ],
  });

  const [docB, setDocB] = useState<DocumentModel>({
    doc_id: "doc_cdu_101_revB",
    filename: "CDU-101-RevB.pdf",
    format: "pdf_native",
    revision: "RevB",
    pages: 1,
    elements: [
      { id: "e1_b", text: "P&ID CDU-101 CRUDE DISTILLATION UNIT", bbox: { page: 1, x1: 50, y1: 20, x2: 450, y2: 45 }, type: "LABEL", confidence: 0.99 },
      { id: "e2_b", text: "4\"-CRU-1001-CS", bbox: { page: 1, x1: 80, y1: 180, x2: 280, y2: 200 }, type: "PIPELINE", confidence: 0.98 },
      { id: "e3_b", text: "V-101", bbox: { page: 1, x1: 300, y1: 175, x2: 340, y2: 205 }, type: "VALVE", confidence: 0.97 },
      { id: "e3_new", text: "V-102", bbox: { page: 1, x1: 360, y1: 175, x2: 400, y2: 205 }, type: "VALVE", confidence: 0.98 },
      { id: "e4_b", text: "P-101A", bbox: { page: 1, x1: 450, y1: 250, x2: 510, y2: 290 }, type: "PUMP", confidence: 0.99 },
      { id: "e5_b", text: "TK-201", bbox: { page: 1, x1: 600, y1: 150, x2: 780, y2: 320 }, type: "TANK", confidence: 0.99 },
      { id: "e6_b", text: "PT-101", bbox: { page: 1, x1: 180, y1: 140, x2: 220, y2: 165 }, type: "INSTRUMENT", confidence: 0.96 },
      { id: "e7_b", text: "200 PSI", bbox: { page: 1, x1: 230, y1: 140, x2: 270, y2: 160 }, type: "DIMENSION", confidence: 0.95 },
    ],
  });

  const [deltaReport, setDeltaReport] = useState<DeltaReport>({
    doc_a_id: "doc_cdu_101_revA",
    doc_b_id: "doc_cdu_101_revB",
    revision_a: "RevA",
    revision_b: "RevB",
    total_changes: 4,
    added_count: 1,
    removed_count: 0,
    modified_count: 2,
    moved_count: 1,
    entries: [
      {
        id: "delta_001",
        change_type: "ADDED",
        element_type: "VALVE",
        rev_a_element: null,
        rev_b_element: { id: "e3_new", text: "V-102", bbox: { page: 1, x1: 360, y1: 175, x2: 400, y2: 205 }, type: "VALVE", confidence: 0.98 },
        confidence: 0.98,
        description: "New Valve 'V-102' added downstream of V-101 in Revision B",
      },
      {
        id: "delta_002",
        change_type: "MODIFIED",
        element_type: "PIPELINE",
        rev_a_element: { id: "e2", text: "3\"-CRU-1001-CS", bbox: { page: 1, x1: 80, y1: 180, x2: 280, y2: 200 }, type: "PIPELINE", confidence: 0.98 },
        rev_b_element: { id: "e2_b", text: "4\"-CRU-1001-CS", bbox: { page: 1, x1: 80, y1: 180, x2: 280, y2: 200 }, type: "PIPELINE", confidence: 0.98 },
        confidence: 0.96,
        description: "Pipeline specification upgraded from '3\"-CRU-1001-CS' to '4\"-CRU-1001-CS'",
      },
      {
        id: "delta_003",
        change_type: "MOVED",
        element_type: "PUMP",
        rev_a_element: { id: "e4", text: "P-101A", bbox: { page: 1, x1: 420, y1: 220, x2: 480, y2: 260 }, type: "PUMP", confidence: 0.99 },
        rev_b_element: { id: "e4_b", text: "P-101A", bbox: { page: 1, x1: 450, y1: 250, x2: 510, y2: 290 }, type: "PUMP", confidence: 0.99 },
        confidence: 0.94,
        description: "Pump 'P-101A' spatial position relocated 30px East, 30px South",
      },
      {
        id: "delta_004",
        change_type: "MODIFIED",
        element_type: "DIMENSION",
        rev_a_element: { id: "e7", text: "150 PSI", bbox: { page: 1, x1: 230, y1: 140, x2: 270, y2: 160 }, type: "DIMENSION", confidence: 0.95 },
        rev_b_element: { id: "e7_b", text: "200 PSI", bbox: { page: 1, x1: 230, y1: 140, x2: 270, y2: 160 }, type: "DIMENSION", confidence: 0.95 },
        confidence: 0.92,
        description: "Design pressure rating increased from '150 PSI' to '200 PSI'",
      },
    ],
  });

  const handleCustomFileUpload = async (fileA: File | null, fileB: File | null) => {
    if (fileA) {
      setDocA((prev) => ({
        ...prev,
        filename: fileA.name,
        doc_id: `custom_${fileA.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
      }));
    }
    if (fileB) {
      setDocB((prev) => ({
        ...prev,
        filename: fileB.name,
        doc_id: `custom_${fileB.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
      }));
    }

    try {
      const res = await fetch("/api/delta/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_a_name: fileA?.name,
          doc_b_name: fileB?.name,
        }),
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data && data.entries) {
          setDeltaReport(data);
        }
      }
    } catch (err) {
      console.warn("Custom delta calculation endpoint notice:", err);
    }
  };

  const handleCitationClick = (citation: string) => {
    setActiveTab("viewer");
    if (citation.includes("VALVE-V102") || citation.includes("V102")) {
      setSelectedDeltaId("delta_001");
    } else if (citation.includes("PIPELINE") || citation.includes("1001")) {
      setSelectedDeltaId("delta_002");
    } else if (citation.includes("PUMP") || citation.includes("P-101A")) {
      setSelectedDeltaId("delta_003");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {/* Top Fixed Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAdapter={selectedAdapter}
        onOpenChatModal={() => setIsChatModalOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sleek Collapsible Document Workbench Toolbar (Shown on Viewer & Delta views) */}
        {(activeTab === "viewer" || activeTab === "delta") && (
          <IngestionSelector
            selectedAdapter={selectedAdapter}
            onSelectAdapter={setSelectedAdapter}
            onCustomFileUpload={handleCustomFileUpload}
            onSelectSamplePair={(pairKey) => {
              console.log("Selected sample pair:", pairKey);
            }}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenChat={() => setIsChatModalOpen(true)}
            isCollapsible={true}
            defaultExpanded={false}
          />
        )}

        {/* Tab Sections with Animated Horizontal Switching */}
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <HomeOverview
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenChat={() => setIsChatModalOpen(true)}
                selectedAdapter={selectedAdapter}
                onSelectAdapter={setSelectedAdapter}
                onCustomFileUpload={handleCustomFileUpload}
                onSelectSamplePair={(pairKey) => {
                  console.log("Selected sample pair:", pairKey);
                }}
              />
            </motion.div>
          )}

          {activeTab === "viewer" && (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 w-full"
            >
              {/* Quick Results Navigator for Non-Tech Users */}
              <ResultNavigator
                activeTab={activeTab}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenChat={() => setIsChatModalOpen(true)}
              />

              <PIDCanvasViewer
                docA={docA}
                docB={docB}
                deltaReport={deltaReport}
                selectedDeltaId={selectedDeltaId}
                onSelectDelta={setSelectedDeltaId}
              />
            </motion.div>
          )}

          {activeTab === "delta" && (
            <motion.div
              key="delta"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 w-full"
            >
              {/* Quick Results Navigator for Non-Tech Users */}
              <ResultNavigator
                activeTab={activeTab}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenChat={() => setIsChatModalOpen(true)}
              />

              <DeltaMatrixTable
                report={deltaReport}
                selectedDeltaId={selectedDeltaId}
                onSelectDelta={setSelectedDeltaId}
                onNavigate={(tab) => setActiveTab(tab)}
                isStandaloneView={true}
              />
            </motion.div>
          )}

          {activeTab === "observability" && (
            <motion.div
              key="observability"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ObservabilityPanel />
            </motion.div>
          )}

          {activeTab === "eval" && (
            <motion.div
              key="eval"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <EvaluationPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Screen Coverage Grounded Chat Modal Overlay */}
      <GroundedChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        onSelectCitation={handleCitationClick}
      />

      {/* Floating Grounded Chat Trigger Button (Round Icon with Hover Popup) */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center">
        <div className="relative group">
          {/* Pop-up label on hover */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-out translate-x-2 group-hover:translate-x-0 whitespace-nowrap bg-slate-900 border border-slate-700 text-slate-100 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-2xl shadow-cyan-950/50 flex items-center space-x-2">
            <span>Open Grounded Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* Round Chat Icon Button */}
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="p-4 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-full shadow-2xl shadow-cyan-500/40 transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative cursor-pointer"
            aria-label="Open Grounded Chat"
          >
            <MessageSquareCode className="w-6 h-6 text-slate-950" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* System Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        P&ID Delta Chat Engine &copy; {new Date().getFullYear()} — Engineering P&ID Revision Comparison & Grounded Spatial RAG
      </footer>
    </div>
  );
}

export default App;
