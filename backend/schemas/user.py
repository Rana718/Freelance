from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[str] = None

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    image: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        populate_by_name = True

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None

class UserImageUpdate(BaseModel):
    image_url: str