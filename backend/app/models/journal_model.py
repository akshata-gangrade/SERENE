from pydantic import BaseModel
from datetime import datetime

class Journal(BaseModel):
    id: str
    user_id: str
    content: str
    mood: str
    template_prompt: str | None = None
    created_at: datetime
    updated_at: datetime

def journal_helper(journal):
    return {
        "id": str(journal["_id"]),  
        "user_id": journal["user_id"],
        "title": journal.get("title"),
        "content": journal["content"],
        "mood": journal["mood"],
        "theme": journal.get("theme"),
        "template_prompt": journal.get("template_prompt"),
        "created_at": journal["created_at"],
        "updated_at": journal["updated_at"]
    }