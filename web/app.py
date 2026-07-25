import streamlit as st
from web.components.ui_components import render_header, render_metric_card

st.set_page_config(
    page_title="PathNovo Delta Chat",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

render_header(
    "P&ID Revision Delta Engine",
    "Production-grade document comparison, spatial alignment, and grounded chat with citations."
)

col1, col2, col3, col4 = st.columns(4)
with col1:
    render_metric_card("Ingestion Adapters", "3 Formats", "PDF, Scanned, DWG")
with col2:
    render_metric_card("Delta Engine", "Active", "Spatial + Embedding Match")
with col3:
    render_metric_card("Retrieval", "Hybrid", "Vector + BM25")
with col4:
    render_metric_card("Grounded LLM", "Gemini 3.6", "Free Tier API")

st.divider()

st.subheader("System Overview")
st.markdown(
    """
    Welcome to **PathNovo Delta Chat** — the intelligent engineering workbench for P&ID document revision control.

    ### Core Capabilities:
    1. **Format Adapters**: Native PDF text/symbol parser, Scanned PDF OCR layout analyzer, and AutoCAD DWG entity extractor.
    2. **Canonical Representation**: Uniform schema capturing text, bounding box coordinates, element types (Valves, Pipes, Pumps, Tanks), and confidence scores.
    3. **Delta Engine**: Computes exact diffs between Revision A and Revision B (ADDED, REMOVED, MODIFIED, MOVED) with confidence scoring.
    4. **Grounded Chat**: Hybrid context retrieval with Gemini 3.6 Flash LLM and spatial citations `[Revision:Page:ElementType]`.
    5. **Observability**: OpenTelemetry tracing, Prometheus metrics, structured JSON logging, and token cost tracking.
    """
)
