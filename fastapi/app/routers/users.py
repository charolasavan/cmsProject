from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models
from app.schemas.user import UserBase
from app.database import SessionLocal
from fastapi.encoders import jsonable_encoder
import jwt


router = APIRouter(prefix="/users", tags=["Users"])

SECRET_KEY = "charolasavan7374"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.post("/", response_model=UserBase)
def create_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# user login 
@router.post('/login')
def check_user(user: UserBase, db: Session = Depends(get_db)):
    data = jsonable_encoder(user)
    valid_user = db.query(models.User).filter(
        models.User.user_email == data['user_email'],
        models.User.user_password == data['user_password']
    ).first()
    
    if not valid_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )
    
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return { "token" : encoded_jwt}
    # return encoded_jwt

    

# Get User by id
@router.get("/{user_id}", response_model=UserBase)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user 


# Update User by id

@router.put("/{user_id}", response_model=UserBase)
async def update_user(user_id: int, user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    for key, value in user.dict().items():
        setattr(db_user, key, value)
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
