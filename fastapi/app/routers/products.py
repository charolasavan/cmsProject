# from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
# from sqlalchemy.orm import Session
# from app import models
# from app.schemas.product import ProductBase
# from app.database import SessionLocal
# import os
# from pathlib import Path

# router = APIRouter(prefix="/products", tags=["Products"])

# # Set Path for image
# UPLOAD_FOLDER = Path("app/static/uploads/")
# UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# # Dependency to get DB session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# # Get all products
# @router.get("/", status_code=status.HTTP_200_OK)
# async def get_all_products(db: Session = Depends(get_db)):
#     products = db.query(models.Products).all()
#     return products


# # Create a new product

# @router.post("/", response_model=ProductBase, status_code=status.HTTP_201_CREATED)
# async def create_product(
#     product_name: str = Form(...),
#     product_price: float = Form(...),
#     product_brand: str = Form(...),
#     product_company: str = Form(...),
#     category_id: int = Form(...),
#     thumbnail_image: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
    
#     existing = db.query(models.Products).filter(models.Products.product_name == product_name, models.Products.category_id == category_id ).first()
#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="This Product is already exitsting"
#         )


#     # # Save the image file
#     image_location = UPLOAD_FOLDER / thumbnail_image.filename
#     with open(image_location, "wb") as image_file:
#         image_file.write(await thumbnail_image.read())

#     # Create the product and save it to the database
#     db_product = models.Products(
#         product_name=product_name,
#         product_price=product_price,
#         product_brand=product_brand,
#         product_company=product_company,
#         category_id=category_id,
#         thumbnail_image=f"/static/uploads/{thumbnail_image.filename}"  # URL to the uploaded image
#     )

#     db.add(db_product)
#     db.commit()
#     db.refresh(db_product)

#     return db_product

    

# # Get a product by ID
# @router.get("/{product_id}", response_model=ProductBase)
# async def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
#     product = db.query(models.Products).filter(models.Products.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
#     # If the product has a thumbnail image, return the image URL
#     # if product.thumbnail_image:
#     #     product.thumbnail_image = f"/static/uploads/{product.thumbnail_image}"  # Assuming image is served from a static folder
    
#     return product


# # Update a product by ID
# @router.put("/{product_id}", response_model=ProductBase)
# async def update_product(
#     product_id : int,
#     product_name: str = Form(...),
#     product_price: float = Form(...),
#     product_brand: str = Form(...),
#     product_company: str = Form(...),
#     category_id: int = Form(...),
#     thumbnail_image: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
#     if not db_product:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

#     # for key, value in product.dict().items():
#     #     setattr(db_product, key, value)
#     db_product.product_name = product_name
#     db_product.product_price = product_price
#     db_product.product_brand = product_brand
#     db_product.product_company = product_company
#     db_product.category_id = category_id
    
#     if thumbnail_image:
#         image_location = UPLOAD_FOLDER / thumbnail_image.filename
#         with open(image_location, "wb") as image_file:
#             image_file.write(await thumbnail_image.read())
#         db_product.thumbnail_image = f"/static/uploads/{thumbnail_image.filename}"

#     db.commit()
#     db.refresh(db_product)
#     return db_product


# # Delete a product by ID
# @router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_product(product_id: int, db: Session = Depends(get_db)):
#     db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
#     if not db_product:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

#     db.delete(db_product)
#     db.commit()
#     return None  # or just `return` is fine for 204


from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session
from app import models
from app.schemas.product import ProductBase
from app.database import SessionLocal
import os
from pathlib import Path

router = APIRouter(prefix="/products", tags=["Products"])

# Set Path for image
UPLOAD_FOLDER = Path("app/static/uploads/")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  Get all products
@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_products(db: Session = Depends(get_db)):
    products = db.query(models.Products).all()
    return products


#  Create a new product
@router.post("/", response_model=ProductBase, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_name: str = Form(...),
    product_price: float = Form(...),
    product_brand: str = Form(...),
    product_company: str = Form(...),
    category_id: int = Form(...),
    thumbnail_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if product already exists
    existing = db.query(models.Products).filter(
        models.Products.product_name == product_name,
        models.Products.category_id == category_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This product already exists."
        )

    # Save the image
    image_location = UPLOAD_FOLDER / thumbnail_image.filename
    with open(image_location, "wb") as image_file:
        image_file.write(await thumbnail_image.read())

    # Create product
    db_product = models.Products(
        product_name=product_name,
        product_price=product_price,
        product_brand=product_brand,
        product_company=product_company,
        category_id=category_id,
        thumbnail_image=f"/static/uploads/{thumbnail_image.filename}"
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


#  Get a product by ID
@router.get("/{product_id}",  status_code=status.HTTP_200_OK)
async def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


#  Update a product by ID
@router.put("/{product_id}", response_model=ProductBase, status_code=status.HTTP_200_OK)
async def update_product(
    product_id: int,
    product_name: str = Form(...),
    product_price: float = Form(...),
    product_brand: str = Form(...),
    product_company: str = Form(...),
    category_id: int = Form(...),
    thumbnail_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Update fields
    db_product.product_name = product_name
    db_product.product_price = product_price
    db_product.product_brand = product_brand
    db_product.product_company = product_company
    db_product.category_id = category_id

    # Update image
    if thumbnail_image:
        image_location = UPLOAD_FOLDER / thumbnail_image.filename
        with open(image_location, "wb") as image_file:
            image_file.write(await thumbnail_image.read())
        db_product.thumbnail_image = f"/static/uploads/{thumbnail_image.filename}"

    db.commit()
    db.refresh(db_product)
    return db_product


# Delete a product by ID
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
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
