import React, { useEffect } from "react";
import { GroundedChatPanel } from "./GroundedChatPanel";
import { X, Sparkles, Maximize2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GroundedChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCitation?: (citation: string) => void;
}

export const GroundedChatModal: React.FC<GroundedChatModalProps> = ({
  isOpen,
  onClose,
  onSelectCitation,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-all"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden"
        >
          {/* Modal Header Bar */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xs font-bold text-slate-100 tracking-tight">Grounded P&ID Chat Overlay</h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full">
                    Screen-Coverage Mode
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Directly querying P&ID Revision A vs B delta context</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Citation-Grounded</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-100 transition"
                title="Close Chat Overlay (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body: Embedded GroundedChatPanel */}
          <div className="flex-1 overflow-hidden p-2 bg-slate-950/50 flex flex-col min-h-0">
            <GroundedChatPanel
              onSelectCitation={(citation) => {
                if (onSelectCitation) {
                  onSelectCitation(citation);
                }
                onClose(); // Close modal so user sees highlighted element on P&ID Canvas
              }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
