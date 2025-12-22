from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger, Date, DateTime, Float
from sqlalchemy.orm import relationship, backref
from app.database import Base


# # ===================== USER =====================
class User(Base):

    __tablename__ = "users"
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
    zip_code = Column(Integer, nullable=False)
    country = Column(String(50), nullable=False)
    profile_img = Column(String(250), nullable=True)
    # role_id = Column(Integer, nullable = True)

    

    role = relationship("User_has_role", back_populates="user_role")
    # user_order = relationship("Orders", back_populates="user")
    cart = relationship('AddToCart', back_populates="user_cart")     
    # __tablename__ = "users"

    # id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # user_name = Column(String(50), nullable=False)
    # email_id = Column(String(50), nullable=False, unique=True)
    # user_password = Column(String(255), nullable=False)
    # phone_number = Column(BigInteger, nullable=False, unique=True)
    # dob = Column(Date, nullable=False)
    # gender = Column(String(50), nullable=False)
    # address = Column(String(50), nullable=False)
    # city = Column(String(50), nullable=False)
    # state = Column(String(50), nullable=False)
    # zip_code = Column(Integer, nullable=False)
    # country = Column(String(50), nullable=False)
    # profile_img = Column(String(250))

    # role = relationship( "User_has_role",back_populates="user_role" )

    # cart = relationship("AddToCart", back_populates="user_cart")


# ===================== ROLES =====================
class Roles(Base):
    __tablename__ = "role_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(250), nullable=False, unique=True)

    # SAME NAME: role_has
    role_has = relationship("User_has_role",back_populates="role_name_user" )


# ===================== USER_HAS_ROLE =====================
class User_has_role(Base):
    __tablename__ = "user_has_role"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(Integer, ForeignKey("role_data.id", ondelete="CASCADE"), nullable=False, default = 2)

    # SAME NAMES
    user_role = relationship( "User",back_populates="role",foreign_keys=[user_id])

    role_name_user = relationship( "Roles", back_populates="role_has",foreign_keys=[role_id] )


# ===================== CATEGORY =====================
class Category(Base):
    __tablename__ = "product_category"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(250), nullable=False)
    parent_id = Column(
        Integer,
        ForeignKey("product_category.category_id", ondelete="CASCADE"),
        nullable=True
    )

    subcategories = relationship(
        "Category",
        backref=backref("parent", remote_side=[category_id]),
        cascade="all, delete-orphan"
    )


# ===================== PRODUCTS =====================
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
    product_description = Column(String(100500))
    category_id = Column(Integer, ForeignKey("product_category.category_id"), nullable=False)
    thumbnail_image = Column(String(250))

    category = relationship("Category", backref="products")
    images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan"
    )
    cart_product = relationship("AddToCart", back_populates="product_cart")


# ===================== PRODUCT IMAGE =====================
class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    image_name = Column(String(250))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    product = relationship("Products", back_populates="images")


# ===================== CART =====================
class AddToCart(Base):
    __tablename__ = "product_add_to_cart"

    cart_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    product_quantity = Column(Integer, nullable=False)
    regular_price = Column(Integer, nullable=False)
    selling_price = Column(Integer, nullable=False)
    coupon_code = Column(String(500), nullable = False)

    # SAME NAMES
    user_cart = relationship("User", back_populates="cart")
    product_cart = relationship("Products", back_populates="cart_product")


# ===================== ORDERS =====================
class Orders(Base):
    __tablename__ = "customer_orders"

    order_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    product_quantity = Column(Integer, nullable=False)
    order_date = Column(DateTime, nullable=False)
    order_estimate_delivery = Column(DateTime, nullable=False)
    order_status = Column(String(250), nullable=False)
    order_billing_address = Column(String(250), nullable=False)
    coupon_id = Column(Integer, ForeignKey("coupon_code.id", ondelete="CASCADE"))
    coupon_used = Column(Integer, default=0)
    product_tax = Column(Float, nullable=False)
    product_discount_price = Column(Float)
    payment_id = Column(Integer, ForeignKey("payment_type.payment_id", ondelete="CASCADE"))
    payment_status = Column(Integer, nullable=False)


# ===================== PAYMENT =====================
class PaymentType(Base):
    __tablename__ = "payment_type"

    payment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    payment_name = Column(String(250))


# ===================== COUPON =====================
class CouponCode(Base):
    __tablename__ = "coupon_code"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(250))
    discount_price = Column(Integer)
    expires_date = Column(Date, nullable=False)
    is_active = Column(Integer)
    usage_limit = Column(Integer)
    usage_count = Column(Integer, default=0)


# ===================== PRODUCT TAX =====================
class ProductTax(Base):
    __tablename__ = "product_tax"

    tax_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tax_name = Column(String(250), nullable=False)
    tax_value = Column(Integer, nullable=False)
    tax_active = Column(Integer, nullable=False)




























# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     user_name = Column(String(50), nullable=False)
#     email_id = Column(String(50), nullable=False, unique=True)
#     user_password = Column(String(50), nullable=False, unique=True)
#     phone_number = Column(BigInteger, nullable=False, unique=True)
#     dob = Column(Date, nullable=False)
#     gender = Column(String(50), nullable=False )
#     address = Column(String(50), nullable=False)
#     city = Column(String(50), nullable=False)
#     state = Column(String(50), nullable=False)
#     zip_code = Column(Integer, nullable=False)
#     country = Column(String(50), nullable=False)
#     profile_img = Column(String(250), nullable=True)
#     # role_id = Column(Integer, nullable = True)

    

#     role = relationship("User_has_role", back_populates="user_role")
#     # user_order = relationship("Orders", back_populates="user")
#     cart = relationship('AddToCart', back_populates="user_cart")     
#     # user_role_id = relationship("User_has_role", back_populates = "user_id_role") 
    
# class Category(Base):
#     __tablename__ = 'product_category'
#     category_id = Column(Integer, primary_key=True, index=True)
#     category_name = Column(String, nullable=False)
#     parent_id = Column(Integer, ForeignKey('product_category.category_id', ondelete="CASCADE"), nullable=True)

#     subcategories = relationship(
#         "Category",
#         backref=backref("parent", remote_side=[category_id]),
#         cascade="all, delete-orphan"
#     )


# class Customer(Base):
#     __tablename__ = "customer"
#     customer_id = Column(Integer, primary_key=True, index=True,autoincrement=True)
#     name = Column(String(250))
#     email = Column(String(250))
#     phone_number = Column(Integer)
#     address = Column(String(250))
#     city = Column(String(250))
#     state = Column(String(250))
#     zip_code = Column(String(250))
#     country = Column(String(250))

#     # Customer_order = relationship("Orders" , back_populates = "customer")


# class Products(Base):
#     __tablename__ = "products"
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     product_name = Column(String(250))
#     product_quantity = Column(Integer)
#     regular_price = Column(Integer)
#     selling_price = Column(Integer)
#     product_brand = Column(String(250))
#     product_company = Column(String(250))
#     product_status = Column(String(250))
#     product_description = Column(String(100500))
#     category_id = Column(Integer, ForeignKey("product_category.category_id"), nullable=False)
#     thumbnail_image = Column(String(250))
#     # taxes_id = Column(Integer, ForeignKey("product_tax.tax_id"), nullable=False)

#     category = relationship("Category", backref="products")
#     images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
#     # product_order = relationship("Orders", back_populates="product") 
#     # tax = relationship('ProductTax', back_populates="product_tax")    
#     cart_product = relationship('AddToCart', back_populates="product_cart")

# class ProductImage(Base):
#     __tablename__ = "product_images"
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     image_name = Column(String(250))
#     product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

#     product = relationship("Products", back_populates="images")

# class PaymentType(Base):
#     __tablename__ = "payment_type"
#     payment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     payment_name = Column(String(250))
    
#     # order_payment = relationship("Orders" , back_populates = "payment")
    
# class CouponCode(Base):
#     __tablename__ = "coupon_code"
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     code = Column(String(250))
#     discount_price = Column(Integer)
#     expires_date = Column(Date, nullable=False)
#     is_active = Column(Integer)
#     usage_limit = Column(Integer)
#     usage_count = Column(Integer, nullable = False, default = False)

#     # coupon_order = relationship("Orders" , back_populates = "coupon")


# class Orders(Base):
#     __tablename__ = "customer_orders"
#     order_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
#     user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
#     product_quantity = Column(Integer , nullable = False)
#     order_date = Column(DateTime , nullable = False)
#     order_estimate_delivery = Column(DateTime, nullable = False)
#     order_status = Column(String(250), nullable = False)
#     order_billing_address = Column(String(250), nullable = False)
#     coupon_id = Column(Integer, ForeignKey('coupon_code.id', ondelete='CASCADE'), nullable=False)
#     coupon_used = Column(Integer, nullable = False, default = 0)
#     product_tax = Column(Float, nullable = False)
#     product_discount_price = Column(Float, nullable = True) 
#     payment_id = Column(Integer, ForeignKey('payment_type.payment_id', ondelete='CASCADE'), nullable=False)
#     payment_status = Column(Integer , nullable = False)


#     # product = relationship("Products", back_populates="product_order")
#     # user = relationship("User", back_populates="user_order")
#     # coupon = relationship("CouponCode" , back_populates = "coupon_order")
#     # payment = relationship("PaymentType" , back_populates = "order_payment")   


# class Roles(Base):
#     __tablename__ = "role_data"
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     role_name = Column(String(250), nullable = False)

#     role_has = relationship("User_has_role", back_populates="role_name_user")
# class User_has_role(Base):
#     __tablename__ = "user_has_role"
#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     role_id = Column(Integer, ForeignKey('role_data.id', ondelete='CASCADE'), nullable=False)
#     user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
#     user_role = relationship("User", back_populates="role")
#     role_name_user = relationship("Roles", back_populates="role_has")
#     # user_id_role = relationship('User', back_populates="user_role_id")



# class ProductTax(Base):
#     __tablename__= "product_tax"
#     tax_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     tax_name = Column(String(250), nullable=False)
#     tax_value= Column(Integer, nullable=False)
#     tax_active=  Column(Integer, nullable= False) # 0 active 1 deActive 
#     # product_tax = relationship('Products', back_populates="tax")

# class AddToCart(Base):
#     __tablename__ = "product_add_to_cart"
#     cart_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
#     product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
#     product_quantity = Column(Integer, nullable=False)
#     regular_price = Column(Integer, nullable = False)
#     selling_price = Column(Integer, nullable = False)
#     # coupon_code = Column(String(500), nullable = False)


#     user_cart = relationship('User', back_populates="cart") 
#     product_cart = relationship('Products', back_populates="cart_product")