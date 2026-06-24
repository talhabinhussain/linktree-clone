# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from app.database.user import engine
from .routers import profile, link

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your Vercel URL once deployed
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(profile.router)
app.include_router(link.router)


@app.on_event("startup")
def on_startup():
    # Create tables if they don't exist (useful for development)
    SQLModel.metadata.create_all(engine)


@app.get("/health")
def check_health():
    return {"message": "API is Healthy"}
