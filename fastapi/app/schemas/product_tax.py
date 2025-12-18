from pydantic import BaseModel
from datetime import date
from typing import Optional

class ProductTaxBase(BaseModel):
    tax_id: Optional[int] = None
    tax_name: Optional[str] = None
    tax_value : Optional[int] = None
    tax_active : Optional[int] = None


    
    class Config:
        orm_mode = True