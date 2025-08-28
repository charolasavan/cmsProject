from pydantic import BaseModel

class UserBase(BaseModel):
    user_name: str
    user_email: str
    user_password: str
