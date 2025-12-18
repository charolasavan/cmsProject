from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.user_has_role import UserhasroleBase
from app.database import SessionLocal
# from datetime import datetime, timedelta, date
# import uuid
from typing import  Optional

router = APIRouter(prefix="/user_has_role", tags=["UserRole"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/')
def get_user_role(db: Session = Depends(get_db)):
    db_user_role = db.query(models.User_has_role).options(
        joinedload(models.User_has_role.user_role),
        joinedload(models.User_has_role.role_name_user)
    ).all()
    return db_user_role

@router.post('/')
def create_role(
    user_id : Optional[int] ,
    role_id : Optional[int] ,
    db: Session = Depends(get_db)):

    exist_user = db.query(models.User_has_role).filter(models.User_has_role.user_id == user_id).first()
    if exist_user:
        return { "Already Role Assign !!" }
    else :
        try:
            new_user = models.User_has_role(
                user_id = user_id,
                role_id = role_id
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
        except:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User Not Add")