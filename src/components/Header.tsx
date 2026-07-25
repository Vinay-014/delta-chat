import React from "react";
import {
  FileDiff,
  MessageSquareCode,
  Activity,
  Award,
  Layers,
  ShieldCheck,
  Home
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAdapter: string;
  onOpenChatModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedAdapter,
  onOpenChatModal,
}) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "viewer", label: "P&ID Canvas", icon: Layers },
    { id: "delta", label: "Delta Matrix", icon: FileDiff },
    { id: "observability", label: "Observability", icon: Activity },
    { id: "eval", label: "Evaluation", icon: Award },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand Logo & System Title */}
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500 transition">
              <FileDiff className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight group-hover:text-cyan-400 transition">
                  P&ID Delta Chat Engine
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Engineering Revision Comparison & Grounded Spatial RAG
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="hidden md:flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenChatModal}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>Grounded Chat</span>
            </button>

            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedAdapter}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
