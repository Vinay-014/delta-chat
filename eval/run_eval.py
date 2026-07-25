import json
from eval.evaluator import SystemEvaluator
from eval.report_generator import ScorecardGenerator

def main():
    print("="*60)
    print("Executing PathNovo Delta Chat E2E Evaluation Pipeline")
    print("="*60)

    evaluator = SystemEvaluator()
    summary = evaluator.run_evaluation()

    scorecard_md = ScorecardGenerator.generate_scorecard_md(summary)

    print("\n" + scorecard_md)

    with open("eval_scorecard.md", "w") as f:
        f.write(scorecard_md)

    with open("eval_results.json", "w") as f:
        json.dump(summary, f, indent=2)

    print("\nEvaluation artifacts saved to 'eval_scorecard.md' and 'eval_results.json'.")

if __name__ == "__main__":
    main()
