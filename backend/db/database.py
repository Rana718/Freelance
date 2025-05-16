import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "flancer")

async_client = AsyncIOMotorClient(MONGO_URI)
async_db = async_client[DATABASE_NAME]
print("DB connected - Asynchronous client")


async def get_db():
    return async_db
