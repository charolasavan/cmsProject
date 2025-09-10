from app.database import SessionLocal
from sqlalchemy import Column, Integer, String,ForeignKey, BigInteger,Date
from sqlalchemy.orm import declarative_base, relationship, backref
from app.database import SessionLocal
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name = Column(String(50), nullable=False)
    email_id = Column(String(50), nullable=False, unique=True)
    user_password = Column(String(50), nullable=False, unique=True)
    phone_number = Column(BigInteger, nullable=False, unique=True)
    dob = Column(Date, nullable=False)
    gender = Column(String(50), nullable=False )
    address = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(50), nullable=False)
    country = Column(String(50), nullable=False)
    profile_img = Column(String(250), nullable=True)
    
class Products(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    product_name = Column(String(50),  )
    product_price = Column(String(50))
    product_brand = Column(String(50),)
    product_company = Column(String(50), )
    category_id = Column(Integer, ForeignKey("product_category.category_id"), nullable=False)
    thumbnail_image = Column(String(50))
    category = relationship("Category", backref="products")
    
    
# class Category(Base):
#     __tablename__ = 'product_category'
#     category_id = Column(Integer, primary_key=True, index=True, nullable = True)
#     category_name = Column(String, nullable=False)
#     parent_id = Column(Integer, ForeignKey('product_category.category_id', ondelete="CASCADE"), nullable=True)  

class Category(Base):
    __tablename__ = 'product_category'
    category_id = Column(Integer, primary_key=True, nullable=False, index=True)
    category_name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey('product_category.category_id', ondelete="CASCADE"), nullable=True)

    subcategories = relationship(
        "Category",
        backref=backref("parent", remote_side=[category_id]),
        cascade="all, delete-orphan"
    )