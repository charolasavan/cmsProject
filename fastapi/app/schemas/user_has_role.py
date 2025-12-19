from pydantic import BaseModel
from datetime import date
from typing import Optional

class UserhasroleBase(BaseModel):
    id: int
    user_id: int
    role_id: int = 2
    
    
    class Config:

        orm_mode = True