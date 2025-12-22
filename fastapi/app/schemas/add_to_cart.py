from pydantic import BaseModel
from typing import Optional

class AddToCartBase(BaseModel):
    cart_id: int
    user_id : Optional[int]
    product_id : Optional[int]
    product_quantity : Optional[int]
    regular_price : Optional[int] 
    selling_price : Optional[int]
    coupon_code : Optional[str] = None