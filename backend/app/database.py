from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DB_NAME

# Create MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Select database
db = client[DB_NAME]

# Collections
users_collection = db["users"]
chat_collection = db["chats"]
journal_collection = db["journals"]
conversations_collection = db["conversations"]
messages_collection = db["messages"]