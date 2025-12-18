from pydantic import BaseModel
from datetime import date
from typing import Optional

class RolesBase(BaseModel):
    id: int
    role_name: str
    
    
    
    class Config:

        orm_mode = True