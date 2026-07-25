from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ElementType(str, Enum):
    TEXT = "TEXT"
    DIMENSION = "DIMENSION"
    LABEL = "LABEL"
    VALVE = "VALVE"
    PIPELINE = "PIPELINE"
    PUMP = "PUMP"
    TANK = "TANK"
    INSTRUMENT = "INSTRUMENT"
    FITTING = "FITTING"
    HEADER = "HEADER"
    SPECIALTY = "SPECIALTY"

class BoundingBox(BaseModel):
    page: int = Field(default=1, description="1-indexed page number")
    x1: float = Field(..., description="Top-left X coordinate in points/pixels")
    y1: float = Field(..., description="Top-left Y coordinate in points/pixels")
    x2: float = Field(..., description="Bottom-right X coordinate in points/pixels")
    y2: float = Field(..., description="Bottom-right Y coordinate in points/pixels")

    @property
    def area(self) -> float:
        return max(0.0, self.x2 - self.x1) * max(0.0, self.y2 - self.y1)

    def intersection_over_union(self, other: "BoundingBox") -> float:
        if self.page != other.page:
            return 0.0
        x_left = max(self.x1, other.x1)
        y_top = max(self.y1, other.y1)
        x_right = min(self.x2, other.x2)
        y_bottom = min(self.y2, other.y2)

        if x_right < x_left or y_bottom < y_top:
            return 0.0

        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        iou = intersection_area / float(self.area + other.area - intersection_area + 1e-6)
        return max(0.0, min(1.0, iou))

class DocumentElement(BaseModel):
    id: str = Field(..., description="Unique identifier within document")
    text: str = Field(..., description="Normalized text content or symbol identifier")
    bbox: BoundingBox = Field(..., description="Spatial bounding box")
    type: ElementType = Field(default=ElementType.TEXT, description="P&ID Element Type")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Extraction confidence score")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Custom metadata (e.g., line_number, tag_id, line_size)")

class Document(BaseModel):
    doc_id: str = Field(..., description="Unique document ID")
    filename: str = Field(..., description="Original filename")
    format: str = Field(..., description="Source format (e.g. pdf_native, pdf_scanned, dwg)")
    revision: str = Field(default="RevA", description="Revision code (e.g. RevA, RevB)")
    pages: int = Field(default=1, ge=1, description="Total page count")
    elements: List[DocumentElement] = Field(default_factory=list, description="Extracted canonical elements")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document level metadata")
