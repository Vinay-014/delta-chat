import os
import uuid
from typing import Optional, Callable
from src.ingest.base import FormatAdapter
from src.canonical.model import Document, DocumentElement, BoundingBox, ElementType

class DWGAdapter(FormatAdapter):
    """Adapter for AutoCAD DWG / DXF binary drawing files (stubbed with real interface)."""

    def supports(self, file_path: str, mime_type: Optional[str] = None) -> bool:
        ext = os.path.splitext(file_path)[1].lower()
        return ext in [".dwg", ".dxf"] or (mime_type is None or "dwg" in mime_type or "autocad" in mime_type)

    def process(
        self,
        file_path: str,
        revision: str = "RevA",
        progress_callback: Optional[Callable[[float, str], None]] = None,
    ) -> Document:
        filename = os.path.basename(file_path)
        doc_id = f"doc_dwg_{uuid.uuid4().hex[:8]}"

        if progress_callback:
            progress_callback(0.2, "Parsing AutoCAD DWG Block Entities & CAD Layers")

        # Extraction simulation for DWG blocks (Valves, Pipes, Instruments)
        if progress_callback:
            progress_callback(0.6, "Extracting DWG MText and Attribute Tags")

        elements = [
            DocumentElement(
                id=f"dwg_block_1_{revision}",
                text="DWG-VALVE-V201",
                bbox=BoundingBox(page=1, x1=110, y1=130, x2=170, y2=160),
                type=ElementType.VALVE,
                confidence=0.99,
                metadata={"dwg_layer": "PID_VALVES", "handle": "0x4A21"}
            ),
            DocumentElement(
                id=f"dwg_block_2_{revision}",
                text="6\"-OIL-3001-CS",
                bbox=BoundingBox(page=1, x1=180, y1=135, x2=320, y2=155),
                type=ElementType.PIPELINE,
                confidence=0.99,
                metadata={"dwg_layer": "PID_PIPES", "handle": "0x4A22"}
            ),
            DocumentElement(
                id=f"dwg_block_3_{revision}",
                text="TK-501",
                bbox=BoundingBox(page=1, x1=350, y1=100, x2=500, y2=250),
                type=ElementType.TANK,
                confidence=0.99,
                metadata={"dwg_layer": "PID_EQUIPMENT", "handle": "0x4A23"}
            ),
        ]

        if progress_callback:
            progress_callback(1.0, "DWG CAD conversion finished")

        return Document(
            doc_id=doc_id,
            filename=filename,
            format="dwg",
            revision=revision,
            pages=1,
            elements=elements,
            metadata={"adapter": "DWGAdapter", "cad_version": "AutoCAD 2024"}
        )
