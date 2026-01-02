from pydantic import BaseModel
from typing import Optional, List

class AddToCartBase(BaseModel):
    cart_id: int
    user_id : Optional[int]
    product_id : Optional[int]
    product_quantity : Optional[int]
    regular_price : Optional[float] 
    selling_price : Optional[int]
    coupon_code : Optional[str] = None
    sub_total_price: Optional[float]

class AddToCartWithCouponBase(BaseModel):
    items: List[AddToCartBase] 
    coupon_code : str