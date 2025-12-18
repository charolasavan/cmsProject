       
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
    product_quantity: Optional[int] = None
    regular_price: Optional[int] = None
    selling_price: Optional[int] = None
    product_brand: Optional[str] = None
    product_company: Optional[str] = None
    product_status: Optional[str] = None
    product_description: Optional[str] = None
    category_id : Optional[int] = None
    thumbnail_image: Optional[str] = None
    images: Optional[List[ProductImageBase] ] = None
    # taxes_id: Optional[int] = None

    class Config:
        orm_mode = True
