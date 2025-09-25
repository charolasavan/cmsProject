       
from typing import List, Optional
from pydantic import BaseModel

class ProductImageBase(BaseModel):
    id : int
    image_name: Optional[str] = None

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    id: int   
    product_name: str
    product_price: float
    product_brand: str
    product_company: str
    category_id: Optional[int] = None 
    thumbnail_image: Optional[str] = None
    images: Optional[List[ProductImageBase] ] = None

    class Config:
        orm_mode = True
