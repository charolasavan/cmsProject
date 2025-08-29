from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session
from app import models
from app.schemas.user import UserBase,LoginRequest
from app.database import SessionLocal
from datetime import date
from typing import Optional
import uuid
import os
from pathlib import Path

router = APIRouter(prefix="/users", tags=["Users"])
UPLOAD_FOLDER = Path("app/static/uploads/")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# @router.post("/login")
# async def valid_user(user: LoginRequest, db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(
#         and_(
#             models.User.email_id == user.email_id,
#             models.User.user_password == user.user_password
#         )
#     ).first()

#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

#     return {
#         "message": "Login successful",
#         "user_id": db_user.id,
#         "email": db_user.email_id,
#         "name": db_user.user_name,
#         "token": "fake-jwt-token"  # Placeholder token
#     }



@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.post("/")
async def create_user(
    user_name: str = Form(...),
    user_password: str = Form(...),
    email_id: str = Form(...),
    phone_number: str = Form(...),
    dob: str = Form(...),
    gender: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zip_code: str = Form(...),
    country: str = Form(...),
    profile_img: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Save the image file
    image_location = UPLOAD_FOLDER / profile_img.filename
    with open(image_location, "wb") as image_file:
        image_file.write(await profile_img.read())

    # Create the product and save it to the database
    db_user = models.User(
        user_name=user_name,
        user_password=user_password,
        email_id=email_id,
        phone_number=phone_number,
        dob=dob,
        gender=gender,
        address=address,
        city=city,
        state=state,
        zip_code=zip_code,
        country=country,            
        profile_img=f"/static/uploads/{profile_img.filename}"  # URL to the uploaded image
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user



# Get User by id
@router.get("/{user_id}", response_model=UserBase)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user 


# Update a user by ID
@router.put("/{user_id}", response_model=UserBase)
async def update_user(
    user_id : int,
    user_name: str = Form(...),
    user_password: str = Form(...),
    email_id: str = Form(...),
    phone_number: int = Form(...),
    dob: date = Form(...),
    gender: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zip_code: int = Form(...),
    country: str = Form(...),
    profile_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
    
    db_user.user_name = user_name
    db_user.user_password = user_password
    db_user.email_id = email_id
    db_user.phone_number = phone_number
    db_user.dob = dob
    db_user.gender = gender
    db_user.address = address
    db_user.city = city
    db_user.state = state
    db_user.zip_code = zip_code
    db_user.country = country

    if profile_img:
        
        ext = profile_img.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        image_location = UPLOAD_FOLDER / unique_filename
        with open(image_location, "wb") as image_file:
            image_file.write(await profile_img.read())
        db_user.profile_img = f"/static/uploads/{unique_filename}"

    db.commit()
    db.refresh(db_user)
    return db_user



# # delete user by id

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="User not found")
    db.delete(db_user)
    db.commit()
    return db_user
