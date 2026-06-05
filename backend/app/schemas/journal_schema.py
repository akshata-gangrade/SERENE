from pydantic import BaseModel
from typing import Optional

class JournalCreate(BaseModel):
    title: Optional[str] = None
    content: str
    mood: str
    theme: Optional[str] = None

class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: str
    mood: str
    theme: Optional[str] = None