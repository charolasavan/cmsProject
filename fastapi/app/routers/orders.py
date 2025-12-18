from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session, joinedload
from app import models
from datetime import datetime, timedelta, date
from app.schemas.orders import OrderBase
from app.database import SessionLocal
import os
# import uuid
# from pathlib import Path
from typing import List, Optional
# import shutil
router = APIRouter(prefix="/orders", tags=["Orders"])
# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------return Order Data --------------------------

@router.get("/")
def get_customer_order(db: Session = Depends(get_db)):
    try:
        orders = db.query(models.Orders).options(
            joinedload(models.Orders.product),
            joinedload(models.Orders.user),
            joinedload(models.Orders.coupon),
            joinedload(models.Orders.payment),
        ).all()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if orders is None:
        raise HTTPException(status_code=500, detail=str(e))
    return orders




# ------------------Create Order Data --------------------------

@router.post("/")
def create_order(
    product_id: int = Form(...),
    customer_name : str = Form(...),
    customer_email : str = Form(...),
    customer_number : int = Form(...),
    customer_address : str = Form(...),
    customer_city : str = Form(...),
    customer_state : str = Form(...),
    customer_zip_code : int = Form(...),
    customer_country: str = Form(...),
    product_quantity : int = Form(...),
    order_date : datetime = Form(...),
    order_estimate_delivery : datetime = Form(...),
    order_status : str = Form(...),
    order_billing_address : str = Form(...), 
    coupon_id : int = Form(...),
    coupon_used : int = Form(...),
    product_tax : float = Form(...),
    product_discount_price : float = Form(...),
    payment_id : int = Form(...),
    payment_status : int = Form(...),   
    db: Session = Depends(get_db)
):
    try:

        db_customer = models.Customer(
            name=customer_name,
            email=customer_email,
            address = customer_address,
            phone_number=customer_number,
            city=customer_city,
            state=customer_state,
            zip_code=customer_zip_code,
            country=customer_country
        )

        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)

        db_order = models.Orders(
            product_id=product_id,
            customer_id = db_customer.customer_id,
            product_quantity = product_quantity,
            order_date = order_date ,
            order_estimate_delivery=order_estimate_delivery,
            order_status=order_status,
            order_billing_address = order_billing_address,
            coupon_id = coupon_id,
            coupon_used=coupon_used,
            product_tax = product_tax,
            product_discount_price=product_discount_price,
            payment_id=payment_id,
            payment_status=payment_status
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return { "SuccessFully Inserted" : db_order}




# ---------------------remove order------------------------


@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session  = Depends(get_db)):
    
    try:
        db_order = db.query(models.Orders).filter(models.Orders.order_id == order_id).first()
        if not db_order:
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = "Order Not Found !!!"
            )
        db.delete(db_order)
        db.commit()
        return {" Order Deleted SuccessFully "}
    except Exception as e :
        raise HTTPException(status_code=500, detail=str(e))


# get specific order of user
@router.get('/{user_id}')
def get_order(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_order = db.query(models.Orders).options(
        joinedload(models.Orders.product),
        joinedload(models.Orders.user),
        joinedload(models.Orders.coupon),
        joinedload(models.Orders.payment)
    ).filter(models.Orders.user_id == user_id).all()
    if not db_order:
        raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = "Order Not Found !!!"
            )

    return db_order

