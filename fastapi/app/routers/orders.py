from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.orders import OrderBase
from app.database import SessionLocal
import os
# import uuid
# from pathlib import Path
from typing import List, Optional
# import shutil
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
def get_order(db: Session = Depends(get_db)):
    db_order = db.query(models.Orders).all()
    return db_order

# insert order
# @router.post("/")
# def insert_order(
#     product_id: int = Form(...),
#     products: str = Form(...),
#     product_quantity : int = Form(...),
#     product_price : int = Form(...),
#     order_date : int = Form(...),
#     user_name : str = Form(...),
#     user_address : str = Form(...),
#     user_email_id : str = Form(...),
#     mobile_number : int = Form(...),
#     payment_type : int = Form(...),


#     db:Session = Depends(get_db)
# ):
