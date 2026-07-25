import streamlit as st
from src.chat.llm_client import LLMClient
from src.chat.indexer import VectorIndexer
from src.chat.retriever import HybridRetriever
from src.chat.answer import AnswerGenerator
from src.ingest.pdf_native import PDFNativeAdapter
from src.delta.engine import DeltaEngine
from web.components.ui_components import render_header

st.set_page_config(page_title="Grounded Chat | PathNovo", layout="wide")
render_header("Grounded P&ID Chat", "Ask engineering questions across P&ID revisions with spatial citations.")

if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

# Index sample or loaded docs
if "indexer" not in st.session_state:
    adapter = PDFNativeAdapter()
    doc_a = adapter.process("sample_doc_a.pdf", revision="RevA")
    doc_b = adapter.process("sample_doc_b.pdf", revision="RevB")
    report = DeltaEngine().compare_documents(doc_a, doc_b)

    indexer = VectorIndexer()
    indexer.index_document(doc_a)
    indexer.index_document(doc_b)
    indexer.index_delta_report(report)

    retriever = HybridRetriever(indexer)
    llm = LLMClient()
    st.session_state.answer_gen = AnswerGenerator(retriever, llm)

for msg in st.session_state.chat_messages:
    st.chat_message(msg["role"]).write(msg["content"])

user_query = st.chat_input("Ask a question about P&ID changes (e.g. 'What valves were added in Rev B?'):")

if user_query:
    st.session_state.chat_messages.append({"role": "user", "content": user_query})
    st.chat_message("user").write(user_query)

    with st.spinner("Retrieving context and generating grounded response..."):
        ans_text, chunks, groundedness = st.session_state.answer_gen.answer_question(user_query)
        full_response = f"{ans_text}\n\n*Groundedness Score: {groundedness:.2f}*"

        st.session_state.chat_messages.append({"role": "assistant", "content": full_response})
        st.chat_message("assistant").write(full_response)
