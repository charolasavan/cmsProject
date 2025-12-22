from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from jose import JWTError, jwt
from datetime import datetime, timedelta, date
from typing import Optional
from pathlib import Path
import uuid
from sqlalchemy import or_ , select

from app import models
from app.schemas.user import UserBase, UserLogin
from app.database import SessionLocal

from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "YOUR_SECRET_KEY"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Setup
router = APIRouter(prefix="/users", tags=["Users"])
UPLOAD_FOLDER = Path("app/static/uploads/")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


# --- Dependencies ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- JWT Utilities ---
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# --- Auth Protected Dependency ---


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login/")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token)
    if not payload or "user_id" not in payload:
        raise credentials_exception
    return payload



@router.get("/")
def get_users(db: Session = Depends(get_db)):

    # db_user = db.query(models.User).all()
    user = db.query(models.User_has_role).options(
        joinedload(models.User_has_role.role_name_user),
        joinedload(models.User_has_role.user_role)
    ).all()
    return user       


@router.post("/login/")
async def login(
    # user_name : str = Form(...) ,
    email_id: str = Form(...),
    user_password: str = Form(...), 
    db: Session = Depends(get_db)
    ):

    db_user = db.query(models.User).filter(
        or_(
            # models.User.user_name == user_name,
           models.User.email_id == email_id and
           models.User.user_password == user_password
        )
        ).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid EmailId")
    
    # if db_user.user_name != user_name :
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid User Name")

    if db_user.user_password != user_password :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Password")
    
    if not db_user or db_user.user_password != user_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")


    # db_user_role = db.query(models.Roles.role_name).join(models.User_has_role).filter(models.User_has_role.user_id == db_user.id).scalar()
    db_user_role = (
    db.query(models.Roles.role_name)
    .join(models.User_has_role, models.Roles.id == models.User_has_role.role_id)
    .filter(models.User_has_role.user_id == db_user.id)
    .scalar()
)
    # return db_user_role
    
    

    token = create_access_token({"sub": db_user.email_id, "user_id": db_user.id})
    
    if not db_user_role:
        raise HTTPException(
        status_code=403,
        detail="User role not assigned"
    )


    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "user_name": db_user.user_name,
            "email_id": db_user.email_id,
            "profile_img": db_user.profile_img,
            "role" : db_user_role
        }
    }

    

@router.post("/")
async def create_user(
    user_name: str = Form(...),
    user_password: str = Form(...),
    email_id: str = Form(...),
    phone_number: int = Form(...),
    dob: str = Form(...),
    gender: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    state: str = Form(...),
    zip_code: int = Form(...),
    country: str = Form(...),
    profile_img: UploadFile = File(...),
    role_id : Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    existing = db.query(models.User).filter(       
            models.User.user_name == user_name and
            models.User.email_id == email_id and
            models.User.user_password == user_password and
            models.User.phone_number == phone_number 
        ).scalar()
    if existing :
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This User is already exitsting"
        )

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

    if role_id :
        user_role = models.User_has_role(
        user_id=db_user.id,
        role_id=role_id
    )

    if not role_id:
        
        default_role = db.query(models.Roles).filter(
        models.Roles.role_name == "user"
        ).first()

        if not default_role:
            raise HTTPException(
                status_code=500,
                detail="Default role not found"
                )
        user_role = models.User_has_role(
        user_id=db_user.id,
        role_id=default_role.id
    )    


    db.add(user_role)
    db.commit()
    db.refresh(user_role)

    return db_user



# Get User by id
@router.get("/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    # user = db.query(models.User).filter(models.User.id == user_id).first()
    user = db.query(models.User_has_role).options(
        joinedload(models.User_has_role.role_name_user),
        joinedload(models.User_has_role.user_role)
    ).filter(models.User_has_role.user_id == user_id).first()
    return user
    # if not user:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # return user 


# Update a user by ID
@router.put("/{user_id}/", response_model=UserBase)
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

@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).scalar()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="User not found")
    # return db_user
    try:

        

        db_user_role = db.query(models.User_has_role).filter(models.User_has_role.user_id == db_user.id).first()
        if not db_user_role:
            return {"User does not have role"}
        db.delete(db_user)
        db.commit()
        
        db.delete(db_user_role)
        db.commit()

        return db_user
    except:  
        raise HTTPException(
        status_code=403,
        detail="Not delete"
        )



# Seach Specific user
@router.post("/getuser/")
async def get_user(
   user_name: Optional[str] = Form(None),
    email_id: Optional[str] = Form(None),
    phone_number: Optional[int] = Form(None),
    dob: Optional[date] = Form(None),
    gender: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    state: Optional[str] = Form(None),
    zip_code: Optional[int] = Form(None),
    country: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # return user_name
    
     search_user = db.query(models.User).filter(
                or_(
                    models.User.user_name == user_name,  
                    models.User.email_id == email_id ,
                    models.User.phone_number == phone_number ,
                    models.User.dob == dob ,
                    models.User.gender == gender ,
                    models.User.address == address ,
                    models.User.city == city ,
                    models.User.state == state ,
                    models.User.zip_code == zip_code ,
                    models.User.country == country 
                )
            ).all()
     if not search_user:
         
         return {"message":"User Not Found"}
     return search_user