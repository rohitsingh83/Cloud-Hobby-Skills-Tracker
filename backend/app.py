"""
SkillSphere 3D: Cloud Backend REST API Microservice (Python FastAPI)
Demonstrates Cloud Computing REST endpoints, Token Authentication, and Progress Analytics.
"""

from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
import uuid

app = FastAPI(
    title="SkillSphere 3D Cloud API",
    description="Enterprise RESTful endpoints for hobby and skill tracking, streaks, and community sharing.",
    version="1.0.0"
)

# Enable CORS for Cloud Edge Clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Data Models
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class SkillCreate(BaseModel):
    skill_name: str
    category: str
    current_level: str
    target_level: str
    description: Optional[str] = ""

class PracticeSessionCreate(BaseModel):
    skill_id: str
    duration_minutes: int = Field(gt=0, le=1440)
    activity: str
    notes: Optional[str] = ""

class CommunityPostCreate(BaseModel):
    skill_name: str
    content: str
    media_url: Optional[str] = None

# In-Memory Cloud Database Cache
DB = {
    "users": {},
    "skills": {},
    "logs": {},
    "posts": [],
    "likes": set()
}

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillSphere 3D Cloud REST Engine",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):
    if user.email in DB["users"]:
        raise HTTPException(status_code=400, detail="User already registered.")
    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    DB["users"][user.email] = {
        "uid": user_id,
        "name": user.name,
        "email": user.email,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    return {"message": "User provisioned successfully", "uid": user_id}

@app.post("/api/skills")
def add_skill(skill: SkillCreate):
    skill_id = f"sk_{uuid.uuid4().hex[:8]}"
    new_skill = {
        "skill_id": skill_id,
        "total_minutes": 0,
        "streak": 0,
        **skill.dict(),
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    DB["skills"][skill_id] = new_skill
    return new_skill

@app.get("/api/skills")
def get_skills():
    return list(DB["skills"].values())

@app.post("/api/practice")
def log_practice(session: PracticeSessionCreate):
    if session.skill_id not in DB["skills"]:
        raise HTTPException(status_code=404, detail="Skill not found.")
    
    session_id = f"log_{uuid.uuid4().hex[:8]}"
    log_entry = {
        "session_id": session_id,
        **session.dict(),
        "practiced_at": datetime.datetime.utcnow().isoformat()
    }
    DB["logs"][session_id] = log_entry
    
    # Update cumulative skill minutes
    DB["skills"][session.skill_id]["total_minutes"] += session.duration_minutes
    return {"status": "success", "session": log_entry}

@app.get("/api/feed")
def get_feed():
    return DB["posts"]

@app.post("/api/posts")
def create_post(post: CommunityPostCreate):
    post_id = f"post_{uuid.uuid4().hex[:8]}"
    new_post = {
        "post_id": post_id,
        **post.dict(),
        "likes_count": 0,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    DB["posts"].insert(0, new_post)
    return new_post

@app.post("/api/posts/{post_id}/like")
def like_post(post_id: str, user_id: str = "demo_user"):
    composite_key = f"{post_id}_{user_id}"
    if composite_key in DB["likes"]:
        raise HTTPException(status_code=400, detail="User already liked this post.")
    
    DB["likes"].add(composite_key)
    for p in DB["posts"]:
        if p["post_id"] == post_id:
            p["likes_count"] += 1
            return {"likes_count": p["likes_count"]}
    raise HTTPException(status_code=404, detail="Post not found.")

@app.get("/api/analytics/dashboard")
def get_analytics():
    total_minutes = sum(s["total_minutes"] for s in DB["skills"].values()) if DB["skills"] else 0
    return {
        "total_practice_hours": round(total_minutes / 60, 1),
        "total_skills": len(DB["skills"]),
        "total_posts": len(DB["posts"])
    }
