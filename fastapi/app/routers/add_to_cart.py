from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.add_to_cart import AddToCartBase
from datetime import datetime
from app.database import SessionLocal 
from typing import  Optional
import json

router = APIRouter(prefix="/add_to_cart", tags=["AddToCart"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/')
def get_cart(db: Session = Depends(get_db)):
    db_cart = db.query(models.AddToCart).all()
    if not db_cart:
        return {"Not Found !!!"}
    return db_cart

@router.post('/')
def add_cart( 
    user_id : Optional[int] = Form(...),
    product_id : Optional[int] = Form(...),
    product_quantity: Optional[int] = Form(...),
    # coupon_code :  Optional[str] = Form(None),
    db: Session= Depends(get_db)
):
    db_cart = db.query(models.AddToCart).options(
        joinedload(models.AddToCart.user_cart),
        joinedload(models.AddToCart.product_cart)
    ).all()
    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    db_tax = db.query(models.ProductTax).filter(models.ProductTax.tax_active == 0).all()
    # db_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == coupon_code).first()
    actual_price = 0
    sell_price = 0

    if not db_cart:
        return { "Not Found" }
    # if  models.User.id != user_id :
    #     return { "Not Valid User" }
    # if product_id != models.Products.id:
    #     return { "Not Valid Product" }
    # if coupon_code != models.CouponCode.code:
    #     return { "Not Valid Product" }

    if db_product:
        if db_product.regular_price and db_product.selling_price == 0:
            if db_tax:
                newPrice = []
                for tax in db_tax:
                    final_price = (db_product.regular_price + (db_product.regular_price  * (tax.tax_value/100))) * product_quantity
                    newPrice.append(final_price)
                    total_price = sum(newPrice)
                actual_price = total_price
                # if coupon_code:
                #         # return db_coupon
                #     today = datetime.now().date()
                #     if today > db_coupon.expires_date:
                #         return { "Sorry , Your Coupon was expire !!! " }
                #     if coupon_code != db_coupon.code:
                #         return { "Sorry , Enter Valid Code !!! " }
                #     if db_coupon.usage_count > db_coupon.usage_limit:
                #         return { "Sorry , All Coupon are Usage !!! " }
                        
                #     else:

                #         discount_price =  db_coupon.discount_price
                #         total_price = total_price - discount_price
    
        if db_product.selling_price != 0:
            if db_tax:

                newPrice = []
                for tax in db_tax:
                    final_price = (db_product.selling_price + (db_product.selling_price  * (tax.tax_value/100))) * product_quantity
                    newPrice.append(final_price)
                    total_price = sum(newPrice)
                sell_price = total_price
                # if coupon_code:
                #     today = datetime.now().date()
                #     if today > db_coupon.expires_date:
                #         return { "Sorry , Your Coupon was expire !!! " }
                #     if coupon_code != db_coupon.code:
                #         return { "Sorry , Enter Valid Code !!! " }
                #     if db_coupon.usage_count > db_coupon.usage_limit:
                #         return { "Sorry , All Coupon are Usage !!! " }
                        
                #     else:

                #         discount_price =  db_coupon.discount_price
                #         total_price = total_price - discount_price

    db_add_to_cart = models.AddToCart(
        user_id = user_id,
        product_id = product_id,
        product_quantity = product_quantity,
        regular_price = actual_price,
        selling_price = sell_price,
        # coupon_code = coupon_code
    )
    # db.add(db_add_to_cart)
    # db.commit()
    # db.refresh(db_add_to_cart)
    return db_add_to_cart

