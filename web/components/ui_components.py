import streamlit as st

def render_header(title: str, subtitle: str):
    """Render standardized page header with branding."""
    st.markdown(
        f"""
        <div style="background-color: #1e293b; padding: 1.5rem; border-radius: 10px; border: 1px solid #334155; margin-bottom: 2rem;">
            <h1 style="color: #38bdf8; margin:0; font-size: 2rem;">PathNovo {title}</h1>
            <p style="color: #94a3b8; margin-top: 0.5rem; font-size: 1rem;">{subtitle}</p>
        </div>
        """,
        unsafe_allow_html_dict=True,
        unsafe_allow_html=True
    )

def render_metric_card(label: str, value: str, delta: str = None, color: str = "#38bdf8"):
    """Render stylized metric display box."""
    st.markdown(
        f"""
        <div style="background-color: #0f172a; padding: 1rem; border-radius: 8px; border: 1px solid #334155; text-align: center;">
            <div style="color: #94a3b8; font-size: 0.85rem;">{label}</div>
            <div style="color: {color}; font-size: 1.8rem; font-weight: bold; margin: 0.2rem 0;">{value}</div>
            {f'<div style="color: #34d399; font-size: 0.75rem;">{delta}</div>' if delta else ''}
        </div>
        """,
        unsafe_allow_html=True
    )
