from app.database import SessionLocal
from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import declarative_base, relationship, backref
from app.database import SessionLocal
from app.database import Base


class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String(50), nullable=False, unique=True)
    user_email = Column(String(50), nullable=False, unique=True)
    user_password = Column(String(50), nullable=False, unique=True)
    
class Products(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    product_name = Column(String(50),  )
    product_price = Column(String(50))
    product_brand = Column(String(50),)
    product_company = Column(String(50), )
    category_id = Column(Integer, ForeignKey("product_category.category_id", ondelete="CASCADE"), nullable=False)
    thumbnail_image = Column(String(50))
    category = relationship("Category", backref="products")
    
    
class Category(Base):
    __tablename__ = 'product_category'
    category_id = Column(Integer, primary_key=True, index=True, nullable = True)
    category_name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey('product_category.category_id'), nullable=True)  # ← nullable