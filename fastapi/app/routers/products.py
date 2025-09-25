from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.product import ProductBase, ProductImageBase
from app.database import SessionLocal
import os
import uuid
from pathlib import Path
from typing import List, Optional
import shutil
router = APIRouter(prefix="/products", tags=["Products"])

# Set Path for image
UPLOAD_FOLDER = Path("app/static/uploads/")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

UPLOAD_PRODUCTIMAGE_FOLDER = Path("app/static/uploads/product_image/")
UPLOAD_PRODUCTIMAGE_FOLDER.mkdir(parents=True, exist_ok=True)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  Get all products
@router.get("/", response_model=List[ProductBase])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(models.Products).options(joinedload(models.Products.images)).all()
    return products


@router.post("/", response_model=ProductBase)
async def create_product(
     product_name: str = Form(...),
    product_price: float = Form(...),
    product_brand: str = Form(...),
    product_company: str = Form(...),
    category_id: int = Form(...),
    thumbnail_image: UploadFile = File(...),
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Products).filter(
        models.Products.product_name == product_name,
        models.Products.category_id == category_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This product already exists."
        )

    # Save thumbnail image
    image_location = UPLOAD_FOLDER / thumbnail_image.filename
    with open(image_location, "wb") as image_file:
        image_file.write(await thumbnail_image.read())

    # Create the product and save it to the database
    db_product = models.Products(
        product_name=product_name,
        product_price=product_price,
        product_brand=product_brand,
        product_company=product_company,
        category_id=category_id,
        thumbnail_image=f"/static/uploads/{thumbnail_image.filename}"  # URL to the uploaded image
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    image_urls = []
    for image in images:
        image_path = UPLOAD_PRODUCTIMAGE_FOLDER / image.filename
        with open(image_path, "wb") as product_image:
            product_image.write(await image.read())

        db_image = models.ProductImage(
            product_id=db_product.id,
            image_name=f"/static/uploads/product_image/{image.filename}"  # URL to the uploaded image
        )
        db.add(db_image)
        image_urls.append(f"/static/uploads/product_image/{image.filename}")

    db.commit()
    db.refresh(db_product)
    
    return db_product
    # return db_product


#  Get a product by ID
@router.get("/{product_id}",  status_code=status.HTTP_200_OK, response_model = List[ProductBase])
async def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    
    products = db.query(models.Products).options(joinedload(models.Products.images)).filter(models.Products.id == product_id).all()
    if not products :
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return products



# Update Product with multiple images
@router.put("/{product_id}/", response_model=ProductBase, status_code=status.HTTP_200_OK)
async def update_product(
    product_id: int,
    product_name: str = Form(...),
    product_price: float = Form(...),
    product_brand: str = Form(...),
    product_company: str = Form(...),
    category_id: int = Form(...),
    thumbnail_image: Optional[UploadFile] = File(None),
    images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db)
):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()

    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    db_product.product_name = product_name
    db_product.product_price = product_price
    db_product.product_brand = product_brand
    db_product.product_company = product_company
    db_product.category_id = category_id
    
    if thumbnail_image:
        ext = thumbnail_image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        image_location = UPLOAD_FOLDER / unique_filename
        with open(image_location, "wb") as image_file:
            image_file.write(await thumbnail_image.read())
        db_product.thumbnail_image = f"/static/uploads/{unique_filename}"

    
    if images:
        for product_image in images:
            ext = product_image.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4().hex}.{ext}"
            image_location = UPLOAD_PRODUCTIMAGE_FOLDER / unique_filename
            with open(image_location, "wb") as image_file:
                image_file.write(await product_image.read())

            db_image = models.ProductImage(
                product_id=product_id,
                image_name=f"/static/uploads/product_image/{unique_filename}"
            )
        db.add(db_image)
    db.commit()
    return db_product

# Delete a product by ID
@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    db.delete(db_product)
    db.commit()
    return None 

@router.delete("/product_image/{image_id}/")
async def delete_product_image(image_id: int, db: Session = Depends(get_db)):
    
     db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
     if not db_image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
     image_name = os.path.basename(db_image.image_name) 
     file_path = os.path.join(UPLOAD_PRODUCTIMAGE_FOLDER, image_name)
     if os.path.exists(file_path):
        os.remove(file_path)
     else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="image Not found"
        )
     db.delete(db_image)
     db.commit()

     return {"message": "Image Deleted Successfully"}
