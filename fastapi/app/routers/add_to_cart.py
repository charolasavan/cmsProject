from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.add_to_cart import AddToCartBase
from datetime import datetime
from app.database import SessionLocal 
from typing import  Optional
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
                regular_price = db_product.regular_price,
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
                regular_price = db_product.regular_price,
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


@router.put('/{cart_id}')
def update_cart(
    cart_id : int,
    user_id: Optional[int] = Form(None), 
    product_quantity: Optional[int] = Form(None),
    coupon_code: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    get_cart = db.query(models.AddToCart).filter(models.AddToCart.cart_id == cart_id).first()
    # get_coupon_code = db.query(models.CouponCode).filter(models.CouponCode.code == coupon_code).first()
    db_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == coupon_code).first()
    db_product = db.query(models.Products).filter(models.Products.id == get_cart.product_id).first()

    # return get_cart
    if not get_cart:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Cart Not Found"
        )
    else:
        get_cart.product_quantity = product_quantity if product_quantity else get_cart.product_quantity
        get_cart.coupon_code = coupon_code if coupon_code else get_cart.coupon_code

    if coupon_code:
        # return db_coupon
        if not db_coupon:
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = "Coupon Not Found"
            )
        if db_coupon.product_id == get_cart.product_id:
            if db_coupon.usage_count > db_coupon.usage_limit:
                return { "Sorry , ALl Coupon are Usage !!!"}
            else:
                get_cart.selling_price = (get_cart.selling_price * (product_quantity if product_quantity else 1) ) - db_coupon.discount_price 
                get_cart.coupon_code = db_coupon.code
                db_coupon.usage_count = db_coupon.usage_count + 1
                total_cart_price = sum([get_cart.selling_price])
                get_cart.sub_total_price = total_cart_price
                db.commit()
                # return total_cart_price

        else:
            if coupon_code:
                total_cart_price = sum([get_cart.selling_price])
                get_cart.sub_total_price = total_cart_price - db_coupon.discount_price 
                get_cart.selling_price = get_cart.selling_price * (product_quantity if product_quantity else 1)
                get_cart.coupon_code = db_coupon.code
                db_coupon.usage_count = db_coupon.usage_count + 1
                db.commit()
        
        update_cart = models.AddToCart(
            user_id = user_id,
            product_quantity = product_quantity,
            selling_price = get_cart.selling_price,
            sub_total_price = get_cart.sub_total_price,
            product_id = get_cart.product_id,
            regular_price = get_cart.regular_price,
            coupon_code = get_cart.coupon_code
        )

        return update_cart
                
                
                

                # db.commit()

        
    #     update_cart = models.AddToCart(
    #         user_id = user_id,
    #         product_quantity = product_quantity,
    #         coupon_code = coupon_code,
    #         sub_total_price = total_cart_price,
    #         selling_price = get_cart.selling_price * (product_quantity if product_quantity else 1),
    #         product_id = get_cart.product_id
    #     )
    #     db.commit()
    #     db.refresh(update_cart)
        return update_cart
        
            
    # db_product = db.query(models.Products).filter(models.Products.id == get_cart.product_id).first()
    # db_coupon = db.query(models.CouponCode).all() 
    # db_specific_coupon = db.query(models.CouponCode).filter(models.CouponCode.product_id == get_cart.product_id).first()
    # return db_specific_coupon
    return get_cart
    # total_cart_price = sum([get_cart.selling_price])
    # return total_cart_price
    if not get_cart:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Cart Not Found"
        )
    if product_quantity <= db_product.product_quantity:
        get_cart.product_quantity = product_quantity
    if coupon_code:
        # if get_cart.product_id == db_coupon.product_id:
        #     if coupon_code.usage_count > db_coupon.usage_limit:
        #         return { "Sorry , All Coupon are Usage !!! " }
        #     else:
        #         db_specific_coupon = db.query(models.CouponCode).filter(models.CouponCode.product_id == get_cart.product_id).first()
        #         # return db_specific_coupon
        #         get_cart.selling_price = get_cart.sell_price - db_specific_coupon.discount_price
        #         get_cart.coupon_code = db_specific_coupon.code
        #         db_specific_coupon.usage_count +=1
        # else:
            total_cart_price = sum([get_cart.selling_price])
            return total_cart_price




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
