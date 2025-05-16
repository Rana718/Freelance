import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.projects import router as projects_router
from routes.auth import router as auth_router


load_dotenv()

app = FastAPI(
    title="Flancer API",
    description="API for Flancer - A Freelance Project Marketplace",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(projects_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Flancer API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
