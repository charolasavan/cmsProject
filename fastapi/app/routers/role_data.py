from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.role_data import RolesBase
from app.database import SessionLocal
from datetime import datetime, timedelta, date
import uuid
from typing import  Optional

router = APIRouter(prefix="/roles", tags=["Roles"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# @router.get("/")
# def get_roles(db:Session = Depends(get_db)):
#     try:
#         db_roles = db.query(models.RolesBase).all()
#         # if not db_roles:
#             # return { "Message" : "Not Found" }
#         return { "Roles" : db_roles}
#     # except Exception as e:
#     #     raise HTTPException(
#     #         status_code=status.HTTP_404_NOT_FOUND,
#     #         detail="Not Found Roles !!!"
#     #     )



@router.get('/')
def get_roles(db: Session = Depends(get_db)):
    db_roles = db.query(models.Roles).all()
    return {"customers info" : db_roles}