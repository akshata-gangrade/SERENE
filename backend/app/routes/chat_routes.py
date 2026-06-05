from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId

from app.middleware.auth_middleware import get_current_user
from app.services.chatbot_service import generate_response, generate_chat_title  # ✅ added
from app.database import conversations_collection, messages_collection
from app.schemas.chat_schema import ChatRequest

router = APIRouter()


# SEND MESSAGE
@router.post("/send")
async def send_message(data: ChatRequest, user=Depends(get_current_user)):

    message = data.message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    try:
        user_id = user["user_id"]

        # UPDATED: AI-generated title
        if not data.conversation_id:
            title = await generate_chat_title(message)  

            convo = {
                "user_id": user_id,
                "title": title,  
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            result = await conversations_collection.insert_one(convo)
            conversation_id = str(result.inserted_id)
        else:
            conversation_id = data.conversation_id

        # Save user message
        await messages_collection.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": "user",
            "content": message,
            "timestamp": datetime.utcnow()
        })

        # Generate AI response
        response = await generate_response(message, conversation_id)

        # Save AI response
        await messages_collection.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": "assistant",
            "content": response,
            "timestamp": datetime.utcnow()
        })

        # Update conversation timestamp
        await conversations_collection.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )

        return {
            "conversation_id": conversation_id,
            "response": response
        }

    except Exception as e:
        print("CHAT ERROR:", e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat"
        )


# GET ALL CONVERSATIONS (Sidebar)
@router.get("/conversations")
async def get_conversations(user=Depends(get_current_user)):

    try:
        convos = []

        cursor = conversations_collection.find(
            {"user_id": user["user_id"]}
        ).sort("updated_at", -1)

        async for convo in cursor:
            convo["_id"] = str(convo["_id"])
            convos.append(convo)

        return {
            "count": len(convos),
            "data": convos
        }

    except Exception as e:
        print("CONVERSATIONS ERROR:", e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch conversations"
        )


# GET MESSAGES
@router.get("/messages/{conversation_id}")
async def get_messages(conversation_id: str, user=Depends(get_current_user)):

    try:
        messages = []

        cursor = messages_collection.find(
            {
                "conversation_id": conversation_id,
                "user_id": user["user_id"]
            }
        ).sort("timestamp", 1)

        async for msg in cursor:
            msg["_id"] = str(msg["_id"])
            messages.append(msg)

        return {
            "count": len(messages),
            "data": messages
        }

    except Exception as e:
        print("MESSAGES ERROR:", e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch messages"
        )


# DELETE CONVERSATION
@router.delete("/conversation/{conversation_id}")
async def delete_conversation(conversation_id: str, user=Depends(get_current_user)):

    try:
        await conversations_collection.delete_one({
            "_id": ObjectId(conversation_id),
            "user_id": user["user_id"]
        })

        await messages_collection.delete_many({
            "conversation_id": conversation_id,
            "user_id": user["user_id"]
        })

        return {"message": "Conversation deleted successfully"}

    except Exception as e:
        print("DELETE ERROR:", e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete conversation"
        )