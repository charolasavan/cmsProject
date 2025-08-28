# from fastapi import FastAPI, HTTPException, Depends, status, Request, Form, Response
# from pydantic import BaseModel
# from typing import Annotated,Optional, List
# import models
# from sqlalchemy import text, select
# from database import SessionLocal,engine
# from sqlalchemy.orm import Session
# from fastapi.templating import Jinja2Templates
# from fastapi.responses import HTMLResponse,RedirectResponse
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware




# app = FastAPI()
# models.Base.metadata.create_all(bind=engine)

# origins = [
#         "http://localhost:3000",  
#     ] 



# class UserBase(BaseModel):
#     user_name: str
#     user_email: str
#     user_password: str

# class CategoryBase(BaseModel):
#     category_name: str
#     parent_id: Optional[int] = 0

# class Subcategory(CategoryBase):
#     category_id: int
#     children: List['Subcategory'] = [] 


# class ProductBase(BaseModel):
#     product_name: str 
#     product_price: int 
#     product_brand: str 
#     product_company: str 
#     Category: CategoryBase 

    
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# app.add_middleware(
#         CORSMiddleware,
#         allow_origins=origins,
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )
# db_dependency = Annotated[Session, Depends(get_db)]

# # get all product in database

# @app.get('/products/', status_code=status.HTTP_200_OK)
# async def get_products( db: db_dependency):
#     product = db.query(models.Products).all()
#     return product

# #create Products

# @app.post("/products/", response_model=ProductBase)
# async def create_item(product: ProductBase, db: db_dependency):
#     db_product = models.Products(**product.dict())
#     db.add(db_product)
#     db.commit()
#     db.refresh(db_product)
#     return db_product

 
#  # get  Product by id
# @app.get("/products/{product_id}", response_model=ProductBase)
# async def get_products(request:Request, product_id: int, db: db_dependency):
#     product = db.query(models.Products).filter(models.Products.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
#     return product 


# # update product by id

# @app.put("/products/{product_id}", response_model=ProductBase)
# async def update_product(product_id: int, product: ProductBase, db: db_dependency):
#     db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
#     if not db_product:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

#     for key, value in product.dict().items():
#         setattr(db_product, key, value)
#     db.commit()
#     db.refresh(db_product)
#     return db_product




# # # delete Product by id
# @app.delete("/product/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_product(product_id : int, db: db_dependency):
#     db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
#     if not db_product:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="Product not found")
#     db.delete(db_product)
#     db.commit()
#     return db_product



# # Return all subcategory using recursive function
# def get_all_subcategories(data, parent_id=None):  # FIXED: use None instead of 0
#     subcategory = []
#     for category in data:
#         if category.parent_id == parent_id:
#             category_data = Subcategory(
#                 category_id=category.category_id,
#                 category_name=category.category_name,
#                 parent_id=category.parent_id,
#                 children=get_all_subcategories(data, parent_id=category.category_id)
#             )
#             subcategory.append(category_data)
#     return subcategory

# # Return all sub category 
# @app.get("/category/", response_model=List[Subcategory], status_code=status.HTTP_200_OK)
# async def get_category(db: db_dependency):
#     data = db.query(models.Category).all()
#     return get_all_subcategories(data)



# # add sub category detail
# @app.post('/category/', response_model=CategoryBase)
# def add_category(category: CategoryBase, db: db_dependency):
#     existing_category = db.query(models.Category).filter(models.Category.category_name == category.category_name).first()
#     if existing_category:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail="Category with this name already exists."
#         )

#     data = category.dict()
    
#     if data.get("parent_id") == 0:
#         data["parent_id"] = None

#     db_category = models.Category(**data)
#     db.add(db_category)
#     db.commit()
#     db.refresh(db_category)
#     return db_category

        
    
        
    
    


#  # get  Product by id
# @app.get("/category/{category_id}", response_model=CategoryBase)
# async def get_category(request:Request, category_id: int, db: db_dependency):
#     category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
#     if not category:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
#     return category 

# # update Category by id

# @app.put("/category/{category_id}", response_model=CategoryBase)
# async def update_category(category_id: int, category: CategoryBase, db: db_dependency):
#     db_category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
#     if not db_category:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

#     # Check parent id 
#     if category.parent_id:
#         if category.parent_id == category_id:
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="It Self Parent ")
#         parent_category = db.query(models.Category).filter(models.Category.category_id == category.parent_id).first()
#         if not parent_category:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent category not found")

#     # whene parentid = 0 -> parent_id = null
#     for key, value in category.dict().items():
#         if key == "parent_id" and value == 0:
#             setattr(db_category, key, None)
#         else:
#             setattr(db_category, key, value)

#     db.commit()
#     db.refresh(db_category)
#     return db_category



        
    

#  # delete Category by id
# @app.delete("/category/{category_id}")
# async def delete_category(category_id: int,  db:db_dependency):
#     db_category = db.query(models.Category).filter(models.Category.category_id == category_id).first()
#     db.delete(db_category)
#     db.commit()
#     return {"message": "Cate deleted successfully"}
   

       

# # get all users

# @app.get('/users/')
# async def get_users( db: db_dependency):
#     user = db.query(models.User).all()
#     return {"data": user}

# # create user
# @app.post("/users/", status_code=status.HTTP_201_CREATED, response_model=UserBase)
# async def create_user(user: UserBase, db: db_dependency):
#     db_user = models.User(**user.dict())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# # get  user by id

# @app.get("/users/{user_id}", response_model=UserBase)
# async def get_user(user_id: int, db: db_dependency):
#     user = db.query(models.User).filter(models.User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
#     return user 




# # update user by id

# @app.put("/users/{user_id}", response_model=UserBase)
# async def update_user(user_id: int, user: UserBase, db: db_dependency):
#     db_user = db.query(models.User).filter(models.User.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

#     for key, value in user.dict().items():
#         setattr(db_user, key, value)
#     db.commit()
#     db.refresh(db_user)
#     return db_user





# # delete user by id

# @app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_user(user_id: int, db: db_dependency):
#     db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="User not found")
#     db.delete(db_user)
#     db.commit()
#     return db_user



# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, category, products
from app import models
from app.database import engine
from fastapi.staticfiles import StaticFiles
from app.database import SessionLocal


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# Save image file in static folder 
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(category.router)
app.include_router(products.router)
