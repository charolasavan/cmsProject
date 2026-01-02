from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.add_to_cart import AddToCartBase , AddToCartWithCouponBase
from app.schemas.coupon_code import CouponCodeBase
from datetime import datetime
from app.database import SessionLocal 
from typing import List, Optional   
import json

router = APIRouter(prefix="/addtocart", tags=["AddToCart"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/')
def get_cart(db: Session = Depends(get_db)):
    db_cart = db.query(models.AddToCart).options(
        joinedload(models.AddToCart.user_cart),
        joinedload(models.AddToCart.product_cart)
    ).all()
    if not db_cart:
        return {"Not Found !!!"}
    return db_cart

@router.post('/')
def add_cart( 
    user_id : Optional[int] = Form(...),
    product_id : Optional[int] = Form(...),
    product_quantity: Optional[int] = Form(None),
    coupon_code :  Optional[str] = Form(None),
    db: Session= Depends(get_db)
):
    db_cart = db.query(models.AddToCart).options(
        joinedload(models.AddToCart.user_cart),
        joinedload(models.AddToCart.product_cart)
    ).all()

    db_product = db.query(models.Products).filter(models.Products.id == product_id).first()
    db_tax = db.query(models.ProductTax).filter(models.ProductTax.tax_active == 0).all()
    db_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == coupon_code).first()
    actual_price = 0
    sell_price = 0

    total_tax = sum([tax.tax_value for tax in db_tax])
    if db_product:
        if db_product.selling_price == 0:
            final_price = db_product.regular_price + (db_product.regular_price  * (total_tax/100))
            actual_price = final_price
            if coupon_code:
                today = datetime.now().date()
                if today > db_coupon.expires_date:
                    return { "Sorry , Your Coupon was expire !!! " }
                if coupon_code != db_coupon.code:
                    return { "Sorry , Enter Valid Code !!! " }
                if db_coupon.usage_count > db_coupon.usage_limit:
                    return { "Sorry , All Coupon are Usage !!! " }

                else:

                    discount_price =  db_coupon.discount_price
                    actual_price = actual_price - discount_price
            db_add_to_cart = models.AddToCart(
                user_id = user_id,
                product_id = product_id,
                # regular_price = db_product.regular_price,
                regular_price = actual_price,
                selling_price = actual_price * (product_quantity if product_quantity else 1),
                coupon_code = coupon_code if coupon_code else ''
            )
        if db_product.selling_price != 0:   
            final_price = db_product.selling_price + (db_product.selling_price  * (total_tax/100))
            sell_price = final_price
            if coupon_code:
                today = datetime.now().date()
                if today > db_coupon.expires_date:
                    return { "Sorry , Your Coupon was expire !!! " }
                if coupon_code != db_coupon.code:
                    return { "Sorry , Enter Valid Code !!! " }
                if db_coupon.usage_count > db_coupon.usage_limit:
                    return { "Sorry , All Coupon are Usage !!! " }
                    
                else:

                    discount_price =  db_coupon.discount_price
                    sell_price = sell_price - discount_price
            db_add_to_cart = models.AddToCart(
                user_id = user_id,
                product_id = product_id,
                # regular_price = db_product.regular_price,
                regular_price = sell_price,
                selling_price = sell_price * (product_quantity if product_quantity else 1),
                coupon_code = coupon_code if coupon_code else ''
            )
        if product_quantity:
            db_add_to_cart.product_quantity = product_quantity
        if not product_quantity:
            db_add_to_cart.product_quantity = 1
        total_cart_price = sum([db_add_to_cart.selling_price])
        db_sub_total_price = total_cart_price
        # db.add(db_sub_total_price)
        db.add(db_add_to_cart)
        db.commit()
        db.refresh(db_add_to_cart)
        return db_add_to_cart



            
    if not db_cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")

    db.commit()
    db.refresh(db_cart)
    return db_cart


@router.get('/{user_id}')
def get_cart_user(user_id: int, db : Session = Depends(get_db)):
    db_cart_user = db.query(models.AddToCart).options(
        # joinedload(models.AddToCart.user_cart),
        joinedload(models.AddToCart.product_cart)
    ).filter(models.AddToCart.user_id == user_id).all()
    
    if not db_cart_user:
        return ''
        
    return db_cart_user


@router.put('/update/')
async def update_cart(items: Optional[List[AddToCartBase] ],db: Session = Depends(get_db)):
    
    
    update_new_cart = []
    sub_total_price = 0
    for  item, element in enumerate(items):
        db_cart  = db.query(models.AddToCart).filter(models.AddToCart.cart_id == element.cart_id).first()
        db_product  = db.query(models.Products).filter(models.Products.id == element.product_id).first()
        if db_cart:
            db_cart.cart_id = element.cart_id,
            db_cart.user_id = element.user_id,
            db_cart.product_id = element.product_id,
            db_cart.product_quantity = element.product_quantity,
            db_cart.regular_price = element.regular_price,
            db_cart.selling_price = element.regular_price * element.product_quantity if element.product_quantity else 1,
            sub_total_price = sub_total_price + (element.regular_price * element.product_quantity if element.product_quantity else 1)

            if element.coupon_code != '':
                db_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == element.coupon_code)
    db.commit()
    db.refresh(db_cart)

    
    return {
        "sub_total_price" : sub_total_price ,
        "new_cart": db_cart
    }


@router.put('/applycoupon')
# async def apply_coupon(code: Optional[str] = Form(None), db : Session = Depends(get_db)):
async def apply_coupon(code: AddToCartWithCouponBase,  db : Session = Depends(get_db)):
    if code.items:
        return code.items
    # return code


    db_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == code).first()

    if not db_coupon:
        return  { "Invalid Coupon Code !!!" }
    else:
        db_cart  = db.query(models.AddToCart).filter(models.AddToCart.cart_id == element.cart_id).first()



@router.delete('/{cart_id}')
async def delete_cart(
    cart_id : int,
    db: Session = Depends(get_db)
):
    get_cart = db.query(models.AddToCart).filter(models.AddToCart.cart_id == cart_id).first()

    if not get_cart:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cart Not Found"
        )
    db.delete(get_cart)
    db.commit()
    return get_cart





