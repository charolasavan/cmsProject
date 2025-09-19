# from pydantic import BaseModel
# from app.schemas.category import CategoryBase
# from typing import List

# class ProductImagesBase(BaseModel):
#     image_name : List[str] = []
#     product_id : int
        
#     class Config:
#         orm_mode = True

# class ProductBase(BaseModel):
#     product_name: str
#     product_price: float
#     product_brand: str
#     product_company: str
#     category_id: int
#     thumbnail_image: str
#     images: List[ProductImagesBase] = []

#     class Config:
#         orm_mode = True
        
from typing import List, Optional
from pydantic import BaseModel

class ProductImageBase(BaseModel):
    id : int
    image_name: str

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    id: int   
    product_name: str
    product_price: float
    product_brand: str
    product_company: str
    category_id: Optional[int] = None 
    thumbnail_image: str
    images: List[ProductImageBase] = [str]

    class Config:
        orm_mode = True
