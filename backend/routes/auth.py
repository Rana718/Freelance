from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from db.database import get_db
from models.user import User
from schemas.user import UserCreate, User as UserSchema, UserProfileUpdate, UserImageUpdate
from services.auth import authenticate_user, create_access_token, get_password_hash, get_current_active_user

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@router.post("/register", response_model=UserSchema)
async def register_user(user: UserCreate, db = Depends(get_db)):
    db_user = await db.users.find_one({"email": user.email})
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    
    result = await db.users.insert_one(new_user.model_dump())
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return User(**created_user)

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user 

@router.patch("/profile", response_model=UserSchema)
async def update_profile(
    profile_update: UserProfileUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    if not update_data:
        return current_user
    result = await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Profile not updated")
    updated_user = await db.users.find_one({"id": current_user.id})
    return User(**updated_user)

@router.patch("/profile/image", response_model=UserSchema)
async def update_profile_image(
    image_update: UserImageUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"image": image_update.image_url}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Profile image not updated")
    updated_user = await db.users.find_one({"id": current_user.id})
    return User(**updated_user)
