from fastapi import APIRouter, Depends
from app.middleware.auth_middleware import get_current_user
from app.utils.mood_templates import get_prompt_for_mood


from app.schemas.journal_schema import JournalCreate, JournalUpdate
from app.services.journal_service import (
    create_journal_service,
    get_all_journals_service,
    get_journal_by_id,
    update_journal_service,
    delete_journal_service,
    get_mood_calendar_service
)

router = APIRouter()


# CREATE JOURNAL
@router.post("/")
async def create_journal(data: JournalCreate, user=Depends(get_current_user)):
    return await create_journal_service(data, user["user_id"])


# GET ALL JOURNALS
@router.get("/")
async def get_all(user=Depends(get_current_user)):
    return await get_all_journals_service(user["user_id"])


# IMPORTANT: keep this BEFORE /{id}
@router.get("/calendar")
async def calendar(user=Depends(get_current_user)):
    return await get_mood_calendar_service(user["user_id"])


# GET PROMPT FOR MOOD
@router.get("/prompt/{mood}")
async def get_prompt(mood: str):
    return {"prompt": get_prompt_for_mood(mood)}


# GET SINGLE JOURNAL
@router.get("/{id}")
async def get_one(id: str, user=Depends(get_current_user)):
    return await get_journal_by_id(id, user["user_id"])


# UPDATE JOURNAL
@router.put("/{id}")
async def update(id: str, data: JournalUpdate, user=Depends(get_current_user)):
    return await update_journal_service(id, data, user["user_id"])


# DELETE JOURNAL
@router.delete("/{id}")
async def delete(id: str, user=Depends(get_current_user)):
    return await delete_journal_service(id, user["user_id"])


