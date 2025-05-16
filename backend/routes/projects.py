from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query

from db.database import get_db
from models.project import Project, ProjectStatus, Comment
from models.user import User
from schemas.project import (
    Project as ProjectSchema, 
    ProjectCreate, 
    ProjectUpdate, 
    ProjectStatusUpdate,
    CommentCreate,
    CommentResponse,
    ProjectLikeResponse
)
from services.auth import get_current_active_user

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

@router.get("", response_model=List[ProjectSchema])
async def get_projects(
    skip: int = 0,
    limit: int = 10,
    tech_stack: Optional[str] = Query(None, description="Filter by tech stack (comma separated)"),
    min_budget: Optional[int] = Query(None, description="Filter by minimum budget"),
    max_budget: Optional[int] = Query(None, description="Filter by maximum budget"),
    db = Depends(get_db)
):
    """
    Get all projects with optional filtering and pagination
    """
    filter_query = {}
    
    if tech_stack:
        tech_stack_list = [tech.strip() for tech in tech_stack.split(",")]
        filter_query["tech_stack"] = {"$in": tech_stack_list}
    
    budget_filter = {}
    if min_budget is not None:
        budget_filter["$gte"] = min_budget
    
    if max_budget is not None:
        budget_filter["$lte"] = max_budget
    
    if budget_filter:
        filter_query["budget"] = budget_filter
    projects_cursor = db.projects.find(filter_query).sort("created_at", -1).skip(skip).limit(limit)
    
    projects = []
    async for project in projects_cursor:
        proj = Project(**project)
        
        likes_count = len(proj.likes) if proj.likes else 0
        
        formatted_comments = []
        if proj.comments:
            for comment in proj.comments:
                user = await db.users.find_one({"id": comment.user_id})
                if user:
                    user_info = {
                        "id": user["id"],
                        "name": user["name"],
                        "image": user.get("image", None)
                    }
                    formatted_comments.append({
                        "id": comment.id,
                        "text": comment.text,
                        "created_at": comment.created_at,
                        "user": user_info
                    })
        
         
        project_data = proj.model_dump()
        project_data["likes"] = likes_count
        project_data["comments"] = formatted_comments
        projects.append(project_data)
    
    return projects

@router.get("/user", response_model=List[ProjectSchema])
async def get_user_projects(
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all projects created by the current user
    """
    projects_cursor = db.projects.find({"user_id": current_user.id}).sort("created_at", -1)
    
    
    projects = []
    async for project in projects_cursor:
        proj = Project(**project)
        
        likes_count = len(proj.likes) if proj.likes else 0
        
        formatted_comments = []
        if proj.comments:
            for comment in proj.comments:
                user = await db.users.find_one({"id": comment.user_id})
                if user:
                    user_info = {
                        "id": user["id"],
                        "name": user["name"],
                        "image": user.get("image", None)
                    }
                    formatted_comments.append({
                        "id": comment.id,
                        "text": comment.text,
                        "created_at": comment.created_at,
                        "user": user_info
                    })
        
        project_data = proj.model_dump()
        project_data["likes"] = likes_count
        project_data["comments"] = formatted_comments
        projects.append(project_data)
    
    return projects

@router.post("", response_model=ProjectSchema)
async def create_project(
    project: ProjectCreate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new project
    """
    new_project = Project(
        title=project.title,
        description=project.description,
        budget=project.budget,
        tech_stack=project.tech_stack,
        status=ProjectStatus.OPEN,
        user_id=current_user.id,
        images=project.images if project.images else []
    )
    
    result = await db.projects.insert_one(new_project.model_dump())
    
    created_project = await db.projects.find_one({"_id": result.inserted_id})
    proj = Project(**created_project)
    project_data = proj.model_dump()
    project_data["likes"] = 0
    project_data["comments"] = []
    
    return project_data

@router.get("/{project_id}", response_model=ProjectSchema)
async def get_project(
    project_id: str,
    db = Depends(get_db)
):
    """
    Get a specific project by ID
    """
    project_doc = await db.projects.find_one({"id": project_id})
    if project_doc is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    proj = Project(**project_doc)
    
    likes_count = len(proj.likes) if proj.likes else 0
    formatted_comments = []
    if proj.comments:
        for comment in proj.comments:
            user = await db.users.find_one({"id": comment.user_id})
            if user:
                user_info = {
                    "id": user["id"],
                    "name": user["name"],
                    "image": user.get("image", None)
                }
                formatted_comments.append({
                    "id": comment.id,
                    "text": comment.text,
                    "created_at": comment.created_at,
                    "user": user_info
                })
    
    project_data = proj.model_dump()
    project_data["likes"] = likes_count
    project_data["comments"] = formatted_comments
    
    return project_data

@router.patch("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a project
    """
    existing_project = await db.projects.find_one({"id": project_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if existing_project["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this project")
    
    update_data = {k: v for k, v in project_update.model_dump().items() if v is not None}
    
    if update_data:
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Project not updated")
    
    updated_project_doc = await db.projects.find_one({"id": project_id})
    proj = Project(**updated_project_doc)
    likes_count = len(proj.likes) if proj.likes else 0
    
    formatted_comments = []
    if proj.comments:
        for comment in proj.comments:
            user = await db.users.find_one({"id": comment.user_id})
            if user:
                user_info = {
                    "id": user["id"],
                    "name": user["name"],
                    "image": user.get("image", None)
                }
                formatted_comments.append({
                    "id": comment.id,
                    "text": comment.text,
                    "created_at": comment.created_at,
                    "user": user_info
                })
    
    project_data = proj.model_dump()
    project_data["likes"] = likes_count
    project_data["comments"] = formatted_comments
    
    return project_data

@router.patch("/{project_id}/status", response_model=ProjectSchema)
async def update_project_status(
    project_id: str,
    status_update: ProjectStatusUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Mark a project as COMPLETED
    """
    existing_project = await db.projects.find_one({"id": project_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": {"status": status_update.status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Project status not updated")
    
    updated_project_doc = await db.projects.find_one({"id": project_id})
    proj = Project(**updated_project_doc)
    
    likes_count = len(proj.likes) if proj.likes else 0
    
    formatted_comments = []
    if proj.comments:
        for comment in proj.comments:
            user = await db.users.find_one({"id": comment.user_id})
            if user:
                user_info = {
                    "id": user["id"],
                    "name": user["name"],
                    "image": user.get("image", None)
                }
                formatted_comments.append({
                    "id": comment.id,
                    "text": comment.text,
                    "created_at": comment.created_at,
                    "user": user_info
                })
    
    project_data = proj.model_dump()
    project_data["likes"] = likes_count
    project_data["comments"] = formatted_comments
    
    return project_data

@router.post("/{project_id}/like", response_model=ProjectLikeResponse)
async def toggle_project_like(
    project_id: str,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Toggle like status for a project
    """
    existing_project = await db.projects.find_one({"id": project_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = Project(**existing_project)
    
    user_id = current_user.id
    liked = False
    
    if project.likes and user_id in project.likes:
        result = await db.projects.update_one(
            {"id": project_id},
            {"$pull": {"likes": user_id}}
        )
        liked = False
    else:
        if not project.likes:
            project.likes = []
        
        result = await db.projects.update_one(
            {"id": project_id},
            {"$addToSet": {"likes": user_id}}
        )
        liked = True
    
    updated_project = await db.projects.find_one({"id": project_id})
    updated_likes = updated_project.get("likes", [])
    likes_count = len(updated_likes)
    
    return {
        "liked": liked,
        "likes": likes_count
    }

@router.get("/{project_id}/like", response_model=ProjectLikeResponse)
async def check_project_like(
    project_id: str,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Check if current user has liked a project
    """
    existing_project = await db.projects.find_one({"id": project_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = Project(**existing_project)
    
    user_id = current_user.id
    liked = project.likes and user_id in project.likes
    likes_count = len(project.likes) if project.likes else 0
    
    return {
        "liked": liked,
        "likes": likes_count
    }

@router.post("/{project_id}/comments", response_model=CommentResponse)
async def add_comment(
    project_id: str,
    comment_data: CommentCreate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Add a comment to a project
    """
    existing_project = await db.projects.find_one({"id": project_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_comment = Comment(
        user_id=current_user.id,
        text=comment_data.text
    )

    result = await db.projects.update_one(
        {"id": project_id},
        {"$push": {"comments": new_comment.model_dump()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to add comment")
    
    user_info = {
        "id": current_user.id,
        "name": current_user.name,
        "image": current_user.image
    }
    
    return {
        "id": new_comment.id,
        "text": new_comment.text,
        "created_at": new_comment.created_at,
        "user": user_info
    }

@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: str,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a project
    """
    existing_project = await db.projects.find_one({"id": project_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if existing_project["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    
    result = await db.projects.delete_one({"id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=400, detail="Project not deleted")
    
    return None 