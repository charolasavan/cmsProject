from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.schemas.category import CategoryBase, Subcategory
from app.database import SessionLocal

router = APIRouter(
    prefix="/category",
    tags=["category"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@router.get("/", response_model=List[Subcategory], status_code=status.HTTP_200_OK)
async def list_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    return get_all_subcategories(categories)

def get_all_subcategories(data: List[models.Category], parent_id: Optional[int] = None) -> List[Subcategory]:
    subcategories = []
    for category in data:
        if category.parent_id == parent_id:
            category_data = Subcategory(
                category_id=category.category_id,
                category_name=category.category_name,
                parent_id=category.parent_id,
                children=get_all_subcategories(data, parent_id=category.category_id)
            )
            subcategories.append(category_data)
    return subcategories
 
@router.post("/", response_model=CategoryBase, status_code=status.HTTP_201_CREATED)
async def create_category(category: CategoryBase, db: Session = Depends(get_db)):
    existing = db.query(models.Category).filter(models.Category.category_name == category.category_name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,   
            detail="Category with this name already exists."
        )

    data = category.dict()
    if data.get("parent_id") == 0:
        data["parent_id"] = None

    db_category = models.Category(**data)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/{category_id}", response_model=CategoryBase)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=CategoryBase)
async def update_category(category_id: int, category: CategoryBase, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    # Check parent id is valid or not
    if category.parent_id:
        if category.parent_id == category_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category cannot be its own parent")
        parent = db.query(models.Category).filter(models.Category.category_id == category.parent_id).first()
        if not parent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent category not found")

    # if parent id is 0 then update is null 
    for key, value in category.dict().items():
        if key == "parent_id" and value == 0:
            setattr(db_category, key, None)
        else:
            setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)
    return db_category

# @router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_category(category_id: int, db: Session = Depends(get_db)):
#     db_category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
#     if not db_category:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
#     db.query(models.Category).filter(models.Category.category_id == category_id).delete()
#     db.delete(db_category)
#     db.commit()
#     # db.refresh()
#     return None

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    db.delete(db_category)
    db.commit()
    return None