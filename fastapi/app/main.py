
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, category, products , orders, coupon_code , payment_type
from app import models
from app.database import engine
from fastapi.staticfiles import StaticFiles
from app.database import SessionLocal
from pathlib import Path

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# Save image file in static folder 
app.mount("/static", StaticFiles(directory="app/static"), name="static")
UPLOAD_FOLDER = Path("app/static/uploads")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(category.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(coupon_code.router)
app.include_router(payment_type.router)

    