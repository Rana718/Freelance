import uuid
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class ProjectStatus(str, Enum):
    OPEN = "OPEN"
    COMPLETED = "COMPLETED"

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    text: str
    created_at: datetime = Field(default_factory=datetime.now)

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    budget: int
    tech_stack: List[str]
    status: ProjectStatus = ProjectStatus.OPEN
    created_at: datetime = Field(default_factory=datetime.now)
    user_id: str
    images: List[str] = Field(default_factory=list)
    likes: List[str] = Field(default_factory=list)  
    comments: List[Comment] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True 