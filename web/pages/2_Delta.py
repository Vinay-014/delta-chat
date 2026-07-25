import streamlit as st
from src.delta.engine import DeltaEngine
from src.ingest.pdf_native import PDFNativeAdapter
from web.components.ui_components import render_header

st.set_page_config(page_title="Delta Analysis | PathNovo", layout="wide")
render_header("Delta Matrix & Comparison", "Side-by-side revision comparison and automated delta report synthesis.")

doc_a = st.session_state.get("doc_a")
doc_b = st.session_state.get("doc_b")

if not doc_a or not doc_b:
    adapter = PDFNativeAdapter()
    doc_a = adapter.process("sample_doc_a.pdf", revision="RevA")
    doc_b = adapter.process("sample_doc_b.pdf", revision="RevB")

engine = DeltaEngine()
report = engine.compare_documents(doc_a, doc_b)
st.session_state["delta_report"] = report

st.subheader("Delta Report Overview")
c1, c2, c3, c4, c5 = st.columns(5)
c1.metric("Total Diffs", report.total_changes)
c2.metric("Added", report.added_count)
c3.metric("Removed", report.removed_count)
c4.metric("Modified", report.modified_count)
c5.metric("Moved", report.moved_count)

st.subheader("Delta Entries Table")
data = []
for e in report.entries:
    data.append({
        "ID": e.id,
        "Change Type": e.change_type.value,
        "Element": e.element_type,
        "Description": e.description,
        "Confidence": f"{e.confidence:.2f}"
    })
st.dataframe(data, use_container_width=True)

st.download_button("Download JSON Report", report.to_json(), file_name="pid_delta_report.json")
st.download_button("Download Markdown Report", report.to_markdown(), file_name="pid_delta_report.md")
