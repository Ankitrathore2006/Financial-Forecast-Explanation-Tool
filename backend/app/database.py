from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

client = None
db = None

import certifi

async def connect_to_mongo():
    global client, db
    if settings.MONGODB_URL:
        client = AsyncIOMotorClient(settings.MONGODB_URL, tlsCAFile=certifi.where())
        db = client.get_default_database("financial_forecast") 
        print("Connected to MongoDB!")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection.")

def get_database():
    return db
