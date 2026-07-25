from typing import List, Dict, Any, Tuple

class EvaluationMetrics:
    """Computes Precision, Recall, F1 for Delta Engine and LLM Groundedness/Correctness scores."""

    @staticmethod
    def calculate_delta_metrics(
        predicted_deltas: List[Dict[str, Any]],
        ground_truth_deltas: List[Dict[str, Any]],
    ) -> Tuple[float, float, float]:
        """Calculate Precision, Recall, and F1 score for detected deltas."""
        if not ground_truth_deltas:
            return 1.0, 1.0, 1.0

        true_positives = 0
        for pred in predicted_deltas:
            for gt in ground_truth_deltas:
                if (
                    pred.get("change_type") == gt.get("change_type")
                    and pred.get("element_type") == gt.get("element_type")
                    and (gt.get("text") in pred.get("description", "") or pred.get("text") == gt.get("text"))
                ):
                    true_positives += 1
                    break

        precision = true_positives / max(1, len(predicted_deltas))
        recall = true_positives / max(1, len(ground_truth_deltas))
        f1 = (2 * precision * recall) / max(1e-6, (precision + recall))

        return round(precision, 4), round(recall, 4), round(f1, 4)

    @staticmethod
    def calculate_chat_correctness(answer: str, expected_keywords: List[str]) -> float:
        """Calculate correctness score based on expected keywords presence."""
        if not expected_keywords:
            return 1.0
        matched = sum(1 for kw in expected_keywords if kw.lower() in answer.lower())
        return round(matched / len(expected_keywords), 2)
