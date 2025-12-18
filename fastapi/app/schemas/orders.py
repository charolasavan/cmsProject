from pydantic import BaseModel
from datetime import date
from typing import Optional

class OrderBase(BaseModel):
    order_id: int
    product_id: int
    user_id : int
    product_quantity: int
    order_date : date
    order_estimate_delivery : date
    order_status : str
    order_billing_address : str
    coupon_id : int
    coupon_used : int
    product_tax : float
    product_discount_price : float
    payment_id : int
    payment_status : int
    
    
    class Config:
        orm_mode = True