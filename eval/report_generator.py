from typing import Dict, Any

class ScorecardGenerator:
    """Generates evaluation scorecard markdown & HTML outputs."""

    @staticmethod
    def generate_scorecard_md(eval_summary: Dict[str, Any]) -> str:
        dm = eval_summary["delta_metrics"]
        cm = eval_summary["chat_metrics"]

        md = [
            "# PathNovo System Benchmark Scorecard",
            "## Delta Engine Performance",
            f"- **Precision**: {dm['precision'] * 100:.1f}%",
            f"- **Recall**: {dm['recall'] * 100:.1f}%",
            f"- **F1-Score**: {dm['f1_score'] * 100:.1f}%\n",
            "## Grounded Chat & QA Performance",
            f"- **Average Correctness**: {cm['average_correctness'] * 100:.1f}%",
            f"- **Average Groundedness**: {cm['average_groundedness'] * 100:.1f}%\n",
            "### Detailed Question Analysis",
        ]
        for q in cm["question_evaluations"]:
            md.append(f"**Q**: {q['question']}")
            md.append(f"> **A**: {q['answer']}")
            md.append(f"*Correctness*: {q['correctness']:.2f} | *Groundedness*: {q['groundedness']:.2f}\n")

        return "\n".join(md)
