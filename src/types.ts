export type ElementType =
  | "TEXT"
  | "DIMENSION"
  | "LABEL"
  | "VALVE"
  | "PIPELINE"
  | "PUMP"
  | "TANK"
  | "INSTRUMENT"
  | "FITTING"
  | "HEADER"
  | "SPECIALTY";

export type ChangeType = "ADDED" | "REMOVED" | "MODIFIED" | "MOVED" | "UNCHANGED";

export interface BoundingBox {
  page: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DocumentElement {
  id: string;
  text: string;
  bbox: BoundingBox;
  type: ElementType;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface DocumentModel {
  doc_id: string;
  filename: string;
  format: string;
  revision: string;
  pages: number;
  elements: DocumentElement[];
  metadata?: Record<string, any>;
}

export interface DeltaEntry {
  id: string;
  change_type: ChangeType;
  element_type: ElementType;
  rev_a_element?: DocumentElement | null;
  rev_b_element?: DocumentElement | null;
  confidence: number;
  description: string;
}

export interface DeltaReport {
  doc_a_id: string;
  doc_b_id: string;
  revision_a: string;
  revision_b: string;
  total_changes: number;
  added_count: number;
  removed_count: number;
  modified_count: number;
  moved_count: number;
  entries: DeltaEntry[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  groundedness_score?: number;
  timestamp: string;
  provider_used?: "gemini" | "groq" | "ollama" | "local_fallback";
  provider_model?: string;
  fallback_chain?: string[];
  fallback_triggered?: boolean;
}

export interface TraceSpan {
  id: string;
  name: string;
  durationMs: number;
  status: "OK" | "ERROR";
  timestamp: string;
  provider?: string;
}

export interface ProviderStats {
  gemini: number;
  groq: number;
  ollama: number;
  local_fallback: number;
  total_failovers: number;
}

export interface SystemMetrics {
  totalRequests: number;
  avgLatencyMs: number;
  totalTokensUsed: number;
  estimatedCostUsd: number;
  deltasComputed: number;
  providerStats?: ProviderStats;
}

export interface QuestionEval {
  question: string;
  answer: string;
  correctness: number;
  groundedness: number;
}

export interface EvaluationReport {
  delta_metrics: {
    precision: number;
    recall: number;
    f1_score: number;
  };
  chat_metrics: {
    average_correctness: number;
    average_groundedness: number;
    question_evaluations: QuestionEval[];
  };
}
