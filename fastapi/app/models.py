from app.database import SessionLocal
from sqlalchemy import Column, Integer, String,ForeignKey, BigInteger,Date, DateTime
from sqlalchemy.orm import declarative_base, relationship, backref
from app.database import SessionLocal
from app.database import Base
from sqlalchemy.orm import relationship 
from sqlalchemy import Column, Integer, String, ForeignKey, Float

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

class Category(Base):
    __tablename__ = 'product_category'
    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey('product_category.category_id', ondelete="CASCADE"), nullable=True)

    subcategories = relationship(
        "Category",
        backref=backref("parent", remote_side=[category_id]),
        cascade="all, delete-orphan"
    )


class Customer(Base):
    __tablename__ = "customer"
    customer_id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    name = Column(String(250))
    email = Column(String(250))
    phone_number = Column(Integer)
    address = Column(String(250))
    city = Column(String(250))
    state = Column(String(250))
    zip_code = Column(String(250))
    country = Column(String(250))

class Orders(Base):
    __tablename__ = "order_detail"
    order_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    # product_id = Column(Integer)
    products = Column(String(250))
    product_quantity = Column(Integer)
    product_price = Column(Integer)
    order_date = Column(Date)
    user_name = Column(String(250))
    user_address = Column(String(250))
    user_email_id = Column(String(250))
    mobile_number = Column(Integer)
    payment_type = Column(Integer)
    product_taxes = Column(Integer)
    order_status = Column(String(250))
    billing_address = Column(String(250))
    discount_code = Column(String(250))
    total_discount_price = Column(Integer)
    payment_status  = Column(String(250))
    coupon_use = Column(String(250))
    estimate_delivery_date = Column(Date)
    
    product = relationship("Products", backref="product_order")
class Products(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_name = Column(String(250))
    product_quantity = Column(Integer)
    regular_price = Column(Integer)
    selling_price = Column(Integer)
    product_brand = Column(String(250))
    product_company = Column(String(250))
    product_status = Column(String(250))
    product_description = Column(String(250))
    category_id = Column(Integer, ForeignKey("product_category.category_id"), nullable=False)
    thumbnail_image = Column(String(250))

    category = relationship("Category", backref="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order = relationship("Orders", back_populates="product") 

class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    image_name = Column(String(250))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    product = relationship("Products", back_populates="images")
    
    

    
    
class PaymentType(Base):
    __tablename__ = "payment_type"
    payment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    payment_name = Column(String(250))
    
    
class CouponCode(Base):
    __tablename__ = "coupon_code"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(250))
    discount_price = Column(Integer)
    expires_date = Column(Date, nullable=False)
    is_active = Column(Integer)
    usage_limit = Column(Integer)
    usage_count = Column(Integer, nullable = False, default = False)


