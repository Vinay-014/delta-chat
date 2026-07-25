import pytest
from src.canonical.model import Document, DocumentElement, BoundingBox, ElementType

@pytest.fixture
def sample_doc_rev_a():
    return Document(
        doc_id="doc_a_101",
        filename="pid_101_revA.pdf",
        format="pdf_native",
        revision="RevA",
        pages=1,
        elements=[
            DocumentElement(
                id="e1",
                text="V-101",
                bbox=BoundingBox(page=1, x1=100, y1=100, x2=150, y2=130),
                type=ElementType.VALVE,
            ),
            DocumentElement(
                id="e2",
                text="3\"-CRU-1001",
                bbox=BoundingBox(page=1, x1=160, y1=100, x2=300, y2=120),
                type=ElementType.PIPELINE,
            ),
        ],
    )

@pytest.fixture
def sample_doc_rev_b():
    return Document(
        doc_id="doc_b_101",
        filename="pid_101_revB.pdf",
        format="pdf_native",
        revision="RevB",
        pages=1,
        elements=[
            DocumentElement(
                id="e1_b",
                text="V-101",
                bbox=BoundingBox(page=1, x1=100, y1=100, x2=150, y2=130),
                type=ElementType.VALVE,
            ),
            DocumentElement(
                id="e2_b",
                text="4\"-CRU-1001", # Modified text
                bbox=BoundingBox(page=1, x1=160, y1=100, x2=300, y2=120),
                type=ElementType.PIPELINE,
            ),
            DocumentElement(
                id="e3_b",
                text="V-102", # Added valve
                bbox=BoundingBox(page=1, x1=310, y1=100, x2=360, y2=130),
                type=ElementType.VALVE,
            ),
        ],
    )
