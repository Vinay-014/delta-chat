import json
import os
from typing import Dict, Any
from src.ingest.pdf_native import PDFNativeAdapter
from src.delta.engine import DeltaEngine
from src.chat.indexer import VectorIndexer
from src.chat.retriever import HybridRetriever
from src.chat.llm_client import LLMClient
from src.chat.answer import AnswerGenerator
from eval.metrics import EvaluationMetrics

class SystemEvaluator:
    """End-to-End Evaluation Harness for PathNovo System."""

    def __init__(self, ground_truth_path: str = "eval/datasets/ground_truth.json"):
        self.ground_truth_path = ground_truth_path

    def run_evaluation(self) -> Dict[str, Any]:
        """Execute evaluation over benchmark datasets."""
        with open(self.ground_truth_path, "r") as f:
            gt_data = json.load(f)

        adapter = PDFNativeAdapter()
        engine = DeltaEngine()

        doc_a = adapter.process("sample_doc_a.pdf", revision="RevA")
        doc_b = adapter.process("sample_doc_b.pdf", revision="RevB")
        report = engine.compare_documents(doc_a, doc_b)

        indexer = VectorIndexer()
        indexer.index_document(doc_a)
        indexer.index_document(doc_b)
        indexer.index_delta_report(report)

        retriever = HybridRetriever(indexer)
        llm = LLMClient()
        answer_gen = AnswerGenerator(retriever, llm)

        pred_entries = [
            {
                "change_type": e.change_type.value,
                "element_type": e.element_type,
                "description": e.description,
            }
            for e in report.entries
        ]

        gt_deltas = gt_data[0]["expected_deltas"]
        precision, recall, f1 = EvaluationMetrics.calculate_delta_metrics(pred_entries, gt_deltas)

        chat_results = []
        for q_item in gt_data[0]["eval_questions"]:
            q = q_item["question"]
            ans, chunks, groundedness = answer_gen.answer_question(q)
            corr = EvaluationMetrics.calculate_chat_correctness(ans, q_item["expected_answer_contains"])
            chat_results.append({
                "question": q,
                "answer": ans,
                "correctness": corr,
                "groundedness": groundedness
            })

        avg_corr = sum(c["correctness"] for c in chat_results) / len(chat_results)
        avg_ground = sum(c["groundedness"] for c in chat_results) / len(chat_results)

        return {
            "delta_metrics": {
                "precision": precision,
                "recall": recall,
                "f1_score": f1,
            },
            "chat_metrics": {
                "average_correctness": avg_corr,
                "average_groundedness": avg_ground,
                "question_evaluations": chat_results,
            },
        }
