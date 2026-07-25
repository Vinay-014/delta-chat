import json
from typing import List, Dict, Any, Optional
from jinja2 import Template
from pydantic import BaseModel, Field
from src.canonical.model import DocumentElement
from src.delta.classifier import ChangeType

class DeltaEntry(BaseModel):
    id: str
    change_type: ChangeType
    element_type: str
    rev_a_element: Optional[DocumentElement] = None
    rev_b_element: Optional[DocumentElement] = None
    confidence: float
    description: str

class DeltaReport(BaseModel):
    doc_a_id: str
    doc_b_id: str
    revision_a: str
    revision_b: str
    total_changes: int
    added_count: int
    removed_count: int
    modified_count: int
    moved_count: int
    entries: List[DeltaEntry]

    def to_json(self) -> str:
        return self.model_dump_json(indent=2)

    def to_markdown(self) -> str:
        md = [
            f"# P&ID Revision Delta Report",
            f"**Revision A**: {self.revision_a} ({self.doc_a_id})  ",
            f"**Revision B**: {self.revision_b} ({self.doc_b_id})  ",
            f"**Total Changes**: {self.total_changes} | **Added**: {self.added_count} | **Removed**: {self.removed_count} | **Modified**: {self.modified_count} | **Moved**: {self.moved_count}\n",
            "| ID | Type | Element | Description | Confidence | Coordinates (Rev B) |",
            "|---|---|---|---|---|---|",
        ]
        for e in self.entries:
            coord = f"P{e.rev_b_element.bbox.page}:({e.rev_b_element.bbox.x1:.0f},{e.rev_b_element.bbox.y1:.0f})" if e.rev_b_element else "N/A"
            md.append(
                f"| `{e.id}` | **{e.change_type.value}** | {e.element_type} | {e.description} | {e.confidence:.2f} | {coord} |"
            )
        return "\n".join(md)

    def to_html(self) -> str:
        template_str = """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>P&ID Delta Report: {{ revision_a }} vs {{ revision_b }}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
            .card { background: #1e293b; border-radius: 12px; padding: 1.5rem; border: 1px solid #334155; margin-bottom: 2rem; }
            h1 { margin-top: 0; color: #38bdf8; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 0.8rem; }
            .ADDED { background: #065f46; color: #34d399; }
            .REMOVED { background: #881337; color: #f43f5e; }
            .MODIFIED { background: #78350f; color: #fbbf24; }
            .MOVED { background: #1e3a8a; color: #60a5fa; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #334155; }
            th { background: #0f172a; color: #94a3b8; text-transform: uppercase; font-size: 0.75rem; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>P&ID Revision Delta Report</h1>
            <p>Comparing <strong>{{ revision_a }}</strong> vs <strong>{{ revision_b }}</strong></p>
            <div>
              <span class="badge ADDED">Added: {{ added_count }}</span>
              <span class="badge REMOVED">Removed: {{ removed_count }}</span>
              <span class="badge MODIFIED">Modified: {{ modified_count }}</span>
              <span class="badge MOVED">Moved: {{ moved_count }}</span>
            </div>
          </div>
          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Change</th>
                  <th>Element Type</th>
                  <th>Description</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {% for entry in entries %}
                <tr>
                  <td><code>{{ entry.id }}</code></td>
                  <td><span class="badge {{ entry.change_type.value }}">{{ entry.change_type.value }}</span></td>
                  <td>{{ entry.element_type }}</td>
                  <td>{{ entry.description }}</td>
                  <td>{{ "%.2f"|format(entry.confidence) }}</td>
                </tr>
                {% endfor %}
              </tbody>
            </table>
          </div>
        </body>
        </html>
        """
        template = Template(template_str)
        return template.render(
            revision_a=self.revision_a,
            revision_b=self.revision_b,
            added_count=self.added_count,
            removed_count=self.removed_count,
            modified_count=self.modified_count,
            moved_count=self.moved_count,
            entries=self.entries,
        )
