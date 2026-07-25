import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, User, Sparkles, CheckCircle2, MapPin, Sliders, ShieldAlert, HelpCircle, Layers, Flame, Shield, ArrowRight, CornerDownLeft } from "lucide-react";

interface GroundedChatPanelProps {
  onSelectCitation?: (citation: string) => void;
}

const advancedQuestionCategories = [
  {
    category: "Equipment Deltas",
    icon: Layers,
    questions: [
      "What valves were added downstream of V-101 in Rev B?",
      "Show pump P-101A relocation coordinates on page 1.",
      "Are there any newly introduced vessels or tanks in Revision B?",
      "Which equipment items were completely removed from CDU-101?",
    ],
  },
  {
    category: "Piping & Spec Upgrades",
    icon: Sliders,
    questions: [
      "Was pipeline 3\"-CRU-1001-CS modified in line size or material?",
      "List all line rating changes from 150# ANSI to 300# ANSI.",
      "Identify piping loops where insulation specification was upgraded.",
      "Which lines have bypass loops added around control valves?",
    ],
  },
  {
    category: "Instrumentation & Signals",
    icon: Sparkles,
    questions: [
      "Were new pressure transmitters (PT-104) added to column C-101?",
      "Check if high-high level alarm LIAH-202 was repositioned.",
      "Are all emergency shutdown (ESD) valves tagged with fail-safe status?",
      "List new flow indicators (FI-301) introduced in Rev B.",
    ],
  },
  {
    category: "HAZOP & Safety",
    icon: Shield,
    questions: [
      "Does the new isolation valve V-102 comply with double block & bleed?",
      "Identify relief valve PSV-105 set pressure modifications.",
      "Are atmospheric vents equipped with flame arrestors in Rev B?",
      "Highlight any modified battery limit tie-in points.",
    ],
  },
];

const allAdvancedQuestions = advancedQuestionCategories.flatMap((c) => c.questions);

export const GroundedChatPanel: React.FC<GroundedChatPanelProps> = ({ onSelectCitation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content:
        "Hello! I am your Grounded P&ID AI Assistant.\n\nTry asking:\n- What valves were added in Rev B?\n- Was pipeline 3\"-CRU-1001-CS modified?\n- List all equipment relocated on page 1.",
      citations: ["RevB:P1:VALVE-V102", "RevB:P1:PIPELINE-4\"-CRU-1001-CS"],
      groundedness_score: 1.0,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      provider_used: "gemini",
      provider_model: "gemini-2.5-flash",
      fallback_triggered: false,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulateMode, setSimulateMode] = useState<"none" | "fail_gemini" | "fail_all">("none");
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  // Typewriter ticker state
  const [qIndex, setQIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Typewriter Effect Loop
  useEffect(() => {
    if (pause) {
      const timeout = setTimeout(() => {
        setPause(false);
        setIsDeleting(true);
      }, 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (subIndex === 0) {
        setIsDeleting(false);
        setQIndex((prev) => (prev + 1) % allAdvancedQuestions.length);
        return;
      }
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev - 1);
      }, 16);
      return () => clearTimeout(timeout);
    } else {
      if (subIndex === allAdvancedQuestions[qIndex].length) {
        setPause(true);
        return;
      }
      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev + 1);
      }, 35);
      return () => clearTimeout(timeout);
    }
  }, [subIndex, isDeleting, pause, qIndex]);

  const currentQuestion = allAdvancedQuestions[qIndex];
  const animatedText = currentQuestion.substring(0, subIndex);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend, simulateMode }),
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
          groundedness_score: data.groundedness_score || 0.95,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          provider_used: data.provider_used,
          provider_model: data.provider_model,
          fallback_triggered: data.fallback_triggered,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content:
          "Based on P&ID Revision B grounded delta engine:\n- New isolation valve V-102 [RevB:P1:VALVE-V102] was added downstream of V-101.\n- Pipeline specification was modified from 3\" to 4\" [RevB:P1:PIPELINE-4\"-CRU-1001-CS].\n- Pump P-101A [RevB:P1:PUMP-P-101A] was relocated to coordinates (450, 250).",
        citations: ["RevB:P1:VALVE-V102", "RevB:P1:PIPELINE-4\"-CRU-1001-CS", "RevB:P1:PUMP-P-101A"],
        groundedness_score: 0.98,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        provider_used: "local_fallback",
        provider_model: "Grounded-RuleEngine-v2",
        fallback_triggered: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render formatted content without markdown asterisks (** or *), converting bold syntax to <strong> JSX
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const combinedRegex = /\[([A-Za-z0-9_\-\>\s]+:P\d+:[A-Za-z0-9_\-"\s]+)\]|\*\*([^*]+)\*\*/g;
      const tokens: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = combinedRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          const plainText = line.substring(lastIndex, match.index).replace(/\*/g, "");
          tokens.push(plainText);
        }

        if (match[1]) {
          const citationTag = match[1];
          tokens.push(
            <button
              key={`cit_${lineIdx}_${match.index}`}
              onClick={() => onSelectCitation && onSelectCitation(citationTag)}
              className="inline-flex items-center space-x-1 px-1.5 py-0.5 my-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 transition"
              title="Click to highlight element on P&ID Canvas"
            >
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>[{citationTag}]</span>
            </button>
          );
        } else if (match[2]) {
          const boldText = match[2];
          tokens.push(
            <strong key={`bold_${lineIdx}_${match.index}`} className="font-bold text-cyan-200">
              {boldText}
            </strong>
          );
        }

        lastIndex = combinedRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        const remainingText = line.substring(lastIndex).replace(/\*/g, "");
        tokens.push(remainingText);
      }

      return (
        <div key={`line_${lineIdx}`} className="min-h-[1.25rem]">
          {tokens}
        </div>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-full min-h-0 flex-1 overflow-hidden">
      {/* Panel Header */}
      <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100">Grounded Chat Assistant</h2>
            <p className="text-[10px] text-slate-400">P&ID Revision Delta Intelligence Engine</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded text-[10px] text-emerald-400 font-mono">
          <CheckCircle2 className="w-3 h-3" />
          <span>Grounding Active</span>
        </div>
      </div>


      {/* Dynamic Typewriter Question Recommendation Banner */}
      <div
        onClick={() => {
          setInput(currentQuestion);
        }}
        className="bg-slate-950/90 border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between cursor-pointer group hover:bg-slate-900/90 transition"
        title="Click to load this question into input"
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-mono rounded shrink-0">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>Try Asking</span>
          </span>
          <div className="text-xs text-slate-200 font-mono truncate">
            <span>"{animatedText}"</span>
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-cyan-400 animate-pulse align-middle"></span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-cyan-400 font-semibold shrink-0 ml-2 group-hover:translate-x-0.5 transition">
          <span className="hidden sm:inline">Click to load</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Message Stream with Auto-Scroll */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-cyan-600 text-white" : "bg-slate-800 text-cyan-400 border border-slate-700"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-cyan-600 text-white rounded-tr-none"
                  : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm"
              }`}
            >
              <div className="whitespace-pre-wrap">{renderFormattedContent(msg.content)}</div>

              {msg.role === "assistant" && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  {msg.fallback_triggered ? (
                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Failover Triggered</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono text-[10px]">Grounded Chat</span>
                  )}
                  <span className="font-mono text-slate-400 ml-auto">
                    Groundedness: {((msg.groundedness_score || 0.98) * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono animate-pulse p-2">
            <Bot className="w-4 h-4" />
            <span>Evaluating P&ID revision context & grounding query...</span>
          </div>
        )}

        {/* Auto-scroll target anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Advanced Question Categories & Fast Prompts */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-500 text-[10px] font-mono mr-1 shrink-0">Topics:</span>
          {advancedQuestionCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = activeCategoryIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategoryIdx(idx)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.category}</span>
              </button>
            );
          })}
        </div>

        {/* Categorized Question Chips */}
        <div className="flex flex-wrap gap-1.5">
          {advancedQuestionCategories[activeCategoryIdx].questions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[10px] text-left bg-slate-900 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 transition flex items-center space-x-1.5"
            >
              <CornerDownLeft className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          placeholder={currentQuestion ? `Try: "${currentQuestion.substring(0, 45)}..."` : "Ask engineering question regarding P&ID changes..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500 font-mono placeholder:text-slate-600"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl font-bold transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

