from pydantic import BaseModel
from datetime import date
from typing import Optional

class CustomerBase(BaseModel):
    customer_id: int
    name : Optional[int]
    email : Optional[str]
    phone_number : Optional[int]
    address : Optional[str] 
    city : Optional[str] 
    state : Optional[str] 
    zip_code : Optional[int] 
    country : Optional[str] 
    