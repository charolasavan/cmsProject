from pydantic import BaseModel
from datetime import date
from typing import Optional

class OrderBase(BaseModel):
    order_id: int
    product_id: int
    products : str
    product_quantity: int
    product_price : int
    order_date : date
    user_name : str
    user_address : str
    user_email_id: str
    mobile_number : int
    payment_type : int
    product_taxes : int
    order_status : str
    billing_address : str
    discount_code : str
    total_discount_price : int
    payment_status : str
    coupon_use : str
    estimate_delivery_date : date
    
    class Config:
        orm_mode = True