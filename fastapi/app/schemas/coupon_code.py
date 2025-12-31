from pydantic import BaseModel
from datetime import date
from typing import Optional

class CouponCodeBase(BaseModel):
    id: int
    product_id : Optional[int]
    code : Optional[str]
    discount_price : Optional[int]
    expires_date : Optional[date]
    is_active : Optional[bool] = True
    usage_limit : Optional[int]
    usage_count : Optional[int] = 0 
    