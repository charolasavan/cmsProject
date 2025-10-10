       
from typing import List, Optional
from pydantic import BaseModel

class ProductImageBase(BaseModel):
    id : int
    image_name: Optional[str] = None

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    id: int   
    product_name: Optional[str] = None
    product_quantity: Optional[int]
    regular_price: Optional[int]
    selling_price: Optional[int]
    product_brand: Optional[str]
    product_company: Optional[str]
    product_status: Optional[str]
    product_description: Optional[str]
    # category_id: Optional[List[int]] = []
    category_id : Optional[int]
    thumbnail_image: Optional[str] = None
    images: Optional[List[ProductImageBase] ] = None

    class Config:
        orm_mode = True
