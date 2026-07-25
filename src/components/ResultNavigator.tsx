import React, { useState } from "react";
import {
  FileDiff,
  MessageSquareCode,
  HelpCircle,
  Eye,
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ResultNavigatorProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenChat: () => void;
}

export const ResultNavigator: React.FC<ResultNavigatorProps> = ({
  activeTab,
  onNavigate,
  onOpenChat,
}) => {
  const [showGuideModal, setShowGuideModal] = useState(false);

  const resultSteps = [
    {
      id: "viewer",
      num: "1",
      title: "P&ID Canvas & BBoxes",
      subtitle: "Visual Side-by-Side Drawing Overlay",
      icon: Eye,
      action: () => onNavigate("viewer"),
    },
    {
      id: "delta",
      num: "2",
      title: "Delta Matrix Table",
      subtitle: "Line-by-Line Engineering Audit Log",
      icon: FileDiff,
      action: () => onNavigate("delta"),
    },
    {
      id: "chat",
      num: "3",
      title: "Grounded AI Chat",
      subtitle: "Interactive RAG with Spatial Citations",
      icon: MessageSquareCode,
      action: () => onOpenChat(),
    },
  ];

  return (
    <>
      {/* Sleek Minimal Results Switcher Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Active View Status Indicator */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Evaluation Views:
            </span>
            <button
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded text-[11px] transition"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>Guide</span>
            </button>
          </div>

          {/* Quick Result Switcher Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {resultSteps.map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;

              return (
                <button
                  key={step.id}
                  onClick={step.action}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-mono font-bold ${
                      isActive ? "bg-slate-950 text-cyan-400" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step.num}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guide Pop-up Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl text-slate-100 relative"
            >
              {/* Modal Header */}
              <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileDiff className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Evaluation Views Navigation
                  </h3>
                </div>

                <button
                  onClick={() => setShowGuideModal(false)}
                  className="text-slate-400 hover:text-slate-100 p-1 rounded hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Steps List */}
              <div className="p-5 space-y-2.5">
                {resultSteps.map((step) => {
                  const Icon = step.icon;
                  const isCurrent = activeTab === step.id;

                  return (
                    <div
                      key={step.id}
                      onClick={() => {
                        setShowGuideModal(false);
                        step.action();
                      }}
                      className={`cursor-pointer p-3 rounded-lg border transition flex items-center justify-between ${
                        isCurrent
                          ? "bg-slate-950 border-cyan-500 text-slate-100"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                            <span>{step.num}. {step.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{step.subtitle}</p>
                        </div>
                      </div>

                      <button className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition shrink-0 flex items-center space-x-1">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Switch anytime using top navigation or switcher.
                </span>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-3.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
