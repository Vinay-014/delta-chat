import streamlit as st
import os
from src.ingest.pdf_native import PDFNativeAdapter
from web.components.ui_components import render_header

st.set_page_config(page_title="Document Ingestion | PathNovo", layout="wide")
render_header("Document Ingestion", "Upload P&ID Revision A and Revision B documents for canonical parsing.")

col1, col2 = st.columns(2)

with col1:
    st.subheader("Revision A Document")
    file_a = st.file_uploader("Upload Revision A (PDF, DWG, Image)", key="file_a")
    rev_a_code = st.text_input("Revision Code A", value="RevA")

with col2:
    st.subheader("Revision B Document")
    file_b = st.file_uploader("Upload Revision B (PDF, DWG, Image)", key="file_b")
    rev_b_code = st.text_input("Revision Code B", value="RevB")

if st.button("Process Documents & Extract Canonical Models", type="primary"):
    with st.spinner("Executing Ingestion Adapter Pipeline..."):
        adapter = PDFNativeAdapter()
        doc_a = adapter.process(file_a.name if file_a else "sample_doc_a.pdf", revision=rev_a_code)
        doc_b = adapter.process(file_b.name if file_b else "sample_doc_b.pdf", revision=rev_b_code)

        st.session_state["doc_a"] = doc_a
        st.session_state["doc_b"] = doc_b

        st.success(f"Successfully processed {len(doc_a.elements)} elements in {doc_a.revision} and {len(doc_b.elements)} elements in {doc_b.revision}.")
