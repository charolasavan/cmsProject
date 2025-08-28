from pydantic import BaseModel
from app.schemas.category import CategoryBase


class ProductBase(BaseModel):
    product_name: str 
    product_price: int 
    product_brand: str 
    product_company: str 
    category_id: int
    thumbnail_image: str
        
    class Config:
        orm_mode = True