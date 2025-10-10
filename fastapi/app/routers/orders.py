from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.product import ProductBase, ProductImageBase
from app.database import SessionLocal
import os
import uuid
from pathlib import Path
from typing import List, Optional
import shutil
router = APIRouter(prefix="/orders", tags=["Orders"])
# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  Get all products
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    products = db.query(models.Products).options(joinedload(models.Products.images)).all()
    # products = db.query(models.Products).all()
    return products



