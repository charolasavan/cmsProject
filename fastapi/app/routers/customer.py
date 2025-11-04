from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.customer import CustomerBase
from app.database import SessionLocal
from datetime import datetime, timedelta, date
import uuid
from typing import  Optional

router = APIRouter(prefix="/customer", tags=["Customer"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/')
def get_customer_detail(db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).all()
    return {"customers info" : db_customer}

@router.post('/', response_model = CustomerBase)
def add_customet_info(
    name = Form(...),
    email = Form(...),
    phone_number = Form(...),
    address = Form(...),
    city = Form(...),
    state = Form(...),
    zip_code = Form(...),
    country = Form(...),
    db: Session = Depends(get_db)): 
    db_cunstomer = db.query(models.Customer).filter(models.Customer.email == email).first()

