from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class CouponCodeBase(BaseModel):
    id: int
    code : Optional[str]
    discount_price : Optional[int]
    expires_date : Optional[datetime]
    is_active : Optional[bool] = True
    usage_limit : Optional[int]
    usage_count : Optional[int] = 0 
    