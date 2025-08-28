from pydantic import BaseModel
from typing import Optional, List


class CategoryBase(BaseModel):
    category_name: str
    parent_id: Optional[int] = 0

class Subcategory(CategoryBase):
    category_id: int
    children: List['Subcategory'] = [] 