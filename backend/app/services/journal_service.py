from app.database import journal_collection
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

from app.models.journal_model import journal_helper
from app.utils.mood_templates import (
    is_valid_mood,
    get_mood_color,
    get_prompt_for_mood
)


# CREATE
async def create_journal_service(data, user_id):
    if not is_valid_mood(data.mood):
        raise HTTPException(status_code=400, detail="Invalid mood")

    journal = {
        "user_id": user_id,
        "title": data.title,
        "content": data.content,
        "mood": data.mood,
        "theme": data.theme,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await journal_collection.insert_one(journal)
    journal["_id"] = result.inserted_id

    return journal_helper(journal)


# GET ALL
async def get_all_journals_service(user_id):
    journals = []

    async for j in journal_collection.find({"user_id": user_id}).sort("created_at", -1):
        journals.append(journal_helper(j))

    return journals


# GET ONE
async def get_journal_by_id(journal_id, user_id):
    journal = await journal_collection.find_one({
        "_id": ObjectId(journal_id),
        "user_id": user_id
    })

    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")

    return journal_helper(journal)


# UPDATE
async def update_journal_service(journal_id, data, user_id):
    update_data = data.dict(exclude_unset=True)

    if "mood" in update_data and not is_valid_mood(update_data["mood"]):
        raise HTTPException(status_code=400, detail="Invalid mood")

    update_data["updated_at"] = datetime.utcnow()

    result = await journal_collection.update_one(
        {"_id": ObjectId(journal_id), "user_id": user_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Journal not found")

    return {"message": "Updated successfully"}


# DELETE
async def delete_journal_service(journal_id, user_id):
    result = await journal_collection.delete_one({
        "_id": ObjectId(journal_id),
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Journal not found")

    return {"message": "Deleted successfully"}


# CALENDAR
async def get_mood_calendar_service(user_id):
    data = {}

    async for j in journal_collection.find({"user_id": user_id}):
        date = j["created_at"].strftime("%Y-%m-%d")

        data[date] = {
            "mood": j["mood"],
            "color": get_mood_color(j["mood"])
        }

    return data