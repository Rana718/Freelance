import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)
    image: Optional[str] = None
    bio: Optional[str] = None
    
    class Config:
        populate_by_name = True 