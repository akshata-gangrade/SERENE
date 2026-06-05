from app.database import users_collection
from app.utils.password_hash import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from datetime import datetime


async def register_user(user_data):
    # Check if user already exists
    existing = await users_collection.find_one({"email": user_data.email})
    if existing:
        return None

    # Hash password
    hashed_pw = hash_password(user_data.password)

    user = {
        "username": user_data.username,
        "email": user_data.email,
        "password_hash": hashed_pw,
        "role": "user",
        "created_at": datetime.utcnow()
    }

    await users_collection.insert_one(user)
    return user


async def login_user(user_data):
    # Find user
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        return None

    # Verify password
    if not verify_password(user_data.password, user["password_hash"]):
        return None

    # Generate token
    token = create_access_token({"user_id": str(user["_id"]),
                                 "role": user.get("role", "user")
                                 })

    return token