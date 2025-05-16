from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from models.project import ProjectStatus, Comment

class CommentCreate(BaseModel):
    text: str

class CommentResponse(BaseModel):
    id: str
    text: str
    created_at: datetime
    user: dict  

class ProjectBase(BaseModel):
    title: str
    description: str
    budget: int
    tech_stack: List[str]

class ProjectCreate(ProjectBase):
    images: Optional[List[str]] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[int] = None
    tech_stack: Optional[List[str]] = None
    images: Optional[List[str]] = None

class ProjectStatusUpdate(BaseModel):
    status: ProjectStatus = Field(default=ProjectStatus.COMPLETED)

class Project(ProjectBase):
    id: str
    status: ProjectStatus
    created_at: datetime
    user_id: str
    images: Optional[List[str]] = None
    likes: int = 0  
    comments: Optional[List[CommentResponse]] = None

    class Config:
        populate_by_name = True

class ProjectLikeResponse(BaseModel):
    liked: bool
    likes: int 