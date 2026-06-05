from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from app.middleware.auth_middleware import get_current_user
from app.database import (
    users_collection,
    conversations_collection,
    journal_collection,
    messages_collection
)

router = APIRouter(tags=["Admin"])

# ── Valid moods ───────────────
VALID_MOODS = {
    "happy", "sad", "angry", "anxious", "excited",
    "tired", "neutral", "grateful", "lonely", "overwhelmed"
}


# ── Guard ─────────────────────────────────────────────────────
def require_admin(user):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


# ── Helper: safe ISO datetime string ─────────────────────────
def to_iso(value):
    """Convert datetime or string to ISO-8601 string, or return None."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, str) and value:
        return value
    return None


# ── Helper: safe ObjectId conversion ─────────────────────────
def to_object_id(value):
    """Safely convert a string to ObjectId, return None on failure."""
    if value is None:
        return None
    if isinstance(value, ObjectId):
        return value
    try:
        return ObjectId(str(value))
    except Exception:
        return None


# ── ORIGINAL: platform-wide stats ────────────────────────────
@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    require_admin(user)

    total_users         = await users_collection.count_documents({})
    total_conversations = await conversations_collection.count_documents({})
    total_journals      = await journal_collection.count_documents({})
    total_messages      = await messages_collection.count_documents({})

    return {
        "users":         total_users,
        "conversations": total_conversations,
        "journals":      total_journals,
        "messages":      total_messages,
    }


# ── NEW v2: all users — single aggregation, no N+1 ───────────
@router.get("/users")
async def get_all_users(user=Depends(get_current_user)):
    """
    Returns every registered user with per-user counts.
    Uses separate efficient count queries per user — avoids N+1
    by fetching all users first, then running batched aggregations.

    Shape per item:
      id, name, email, role, created_at (ISO), chat_count,
      journal_count, latest_mood
    """
    require_admin(user)

    # ── 1. Fetch all users (exclude password) ──────────────────
    all_users = []
    async for u in users_collection.find({}, {"password": 0}):
        all_users.append(u)

    if not all_users:
        return []

    # ── 2. Aggregate chat counts grouped by user_id ────────────
    # user_id in conversations is stored as a string of ObjectId
    chat_pipeline = [
        {"$group": {"_id": "$user_id", "count": {"$sum": 1}}}
    ]
    chat_counts = {}
    async for doc in conversations_collection.aggregate(chat_pipeline):
        if doc["_id"]:
            chat_counts[str(doc["_id"])] = doc["count"]

    # ── 3. Aggregate journal counts grouped by user_id ─────────
    journal_pipeline = [
        {"$group": {"_id": "$user_id", "count": {"$sum": 1}}}
    ]
    journal_counts = {}
    async for doc in journal_collection.aggregate(journal_pipeline):
        if doc["_id"]:
            journal_counts[str(doc["_id"])] = doc["count"]

    # ── 4. Latest mood per user — one aggregation ──────────────
    mood_pipeline = [
        {"$sort": {"created_at": -1}},
        {"$group": {
            "_id":        "$user_id",
            "latest_mood": {"$first": "$mood"}
        }}
    ]
    latest_moods = {}
    async for doc in journal_collection.aggregate(mood_pipeline):
        if doc["_id"]:
            mood = doc.get("latest_mood", "")
            # Only store valid moods
            if mood and mood.lower() in VALID_MOODS:
                latest_moods[str(doc["_id"])] = mood.lower()

    # ── 5. Assemble result ─────────────────────────────────────
    result = []
    for u in all_users:
        uid = str(u["_id"])
        result.append({
            "id":            uid,
            "name":          u.get("username", ""),
            "email":         u.get("email", ""),
            "role":          u.get("role", "user"),
            "created_at":    to_iso(u.get("created_at")),
            "chat_count":    chat_counts.get(uid, 0),
            "journal_count": journal_counts.get(uid, 0),
            "latest_mood":   latest_moods.get(uid),
        })

    return result


# ── NEW v2: mood distribution — validated moods only ─────────
@router.get("/mood-stats")
async def get_mood_stats(user=Depends(get_current_user)):
    """
    Aggregated mood counts across all journal entries.
    Invalid / dirty mood values are excluded.
    Shape: { "happy": 34, "anxious": 28, ... }
    """
    require_admin(user)

    pipeline = [
        {"$group": {"_id": "$mood", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]

    mood_counts = {}
    async for doc in journal_collection.aggregate(pipeline):
        raw = doc.get("_id", "")
        if raw and isinstance(raw, str) and raw.lower() in VALID_MOODS:
            mood_counts[raw.lower()] = doc["count"]

    return mood_counts


# ── NEW v2: activity feed — type-safe ObjectId lookup ─────────
@router.get("/activity")
async def get_activity(user=Depends(get_current_user)):
    """
    20 most recent events (conversations + journals), merged by date.
    Fixes ObjectId type-mismatch that caused 'Unknown' user names.

    Shape per item:
      type, user_name, user_email, detail, mood (journals), created_at
    """
    require_admin(user)

    events = []

    # ── Recent conversations ───────────────────────────────────
    async for conv in conversations_collection.find(
        {},
        {"user_id": 1, "title": 1, "created_at": 1}
    ).sort("created_at", -1).limit(20):

        uid_raw = conv.get("user_id")
        u = None

        # Try string match first, then ObjectId
        if uid_raw:
            u = await users_collection.find_one({"_id": to_object_id(uid_raw)})
            if not u:
                # Fallback: user_id might be stored as plain string field
                u = await users_collection.find_one({"_id": uid_raw})

        events.append({
            "type":       "chat",
            "user_name":  u.get("username", "Unknown") if u else "Unknown",
            "user_email": u.get("email", "")        if u else "",
            "detail":     conv.get("title") or "New conversation",
            "mood":       None,
            "created_at": to_iso(conv.get("created_at")),
        })

    # ── Recent journals ───────────────────────────────────────
    async for journal in journal_collection.find(
        {},
        {"user_id": 1, "title": 1, "mood": 1, "created_at": 1}
    ).sort("created_at", -1).limit(20):

        uid_raw = journal.get("user_id")
        u = None

        if uid_raw:
            u = await users_collection.find_one({"_id": to_object_id(uid_raw)})
            if not u:
                u = await users_collection.find_one({"_id": uid_raw})

        raw_mood = journal.get("mood", "")
        clean_mood = raw_mood.lower() if raw_mood and raw_mood.lower() in VALID_MOODS else None

        events.append({
            "type":       "journal",
            "user_name":  u.get("username", "Unknown") if u else "Unknown",
            "user_email": u.get("email", "")        if u else "",
            "detail":     journal.get("title") or f"Journal entry",
            "mood":       clean_mood,
            "created_at": to_iso(journal.get("created_at")),
        })

    # ── Merge, sort, trim ─────────────────────────────────────
    events.sort(key=lambda x: x["created_at"] or "", reverse=True)
    return events[:20]