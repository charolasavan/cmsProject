from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserBase(BaseModel):
    user_name: str
    user_password: str
    email_id: str
    phone_number: int           
    dob: date                   
    gender: str
    address: str
    city: str
    state: str
    zip_code: int
    country: str
    profile_img: Optional[str] = None 