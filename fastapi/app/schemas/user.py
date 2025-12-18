from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    id: int
    user_name: Optional[str] = None 
    user_password: Optional[str] = None 
    email_id: Optional[str] = None 
    phone_number: Optional[int] = None 
    dob: Optional[date] = None                    
    gender: Optional[str] = None 
    address: Optional[str] = None 
    city: Optional[str] = None 
    state: Optional[str] = None 
    zip_code: Optional[int] = None 
    country: Optional[str] = None 
    profile_img: Optional[str] = None 
    # role_id : Optional[int] = None
    class Config:
        orm_mode = True

class UserLogin(BaseModel):  #whene login then use it to check details
    user_name: str
    email_id : str
    user_password: str