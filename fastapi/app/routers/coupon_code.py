from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.coupon_code import CouponCodeBase
from app.database import SessionLocal
from datetime import datetime, timedelta, date
import uuid

router = APIRouter(prefix="/coupons", tags=["Coupons"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  Get all products
@router.get("/")
def get_coupons(db: Session = Depends(get_db)):
    db_coupons = db.query(models.CouponCode).all()
    return db_coupons

# Generate  Coupon Code 

def generate_unique_coupon_code():
    return f"#{str(uuid.uuid4())[:6].upper()}"
@router.post('/', response_model = CouponCodeBase)
async def generate_coupons(
  discount_price : int = Form(...),
  expire_days : int  =  Form(...),
  is_active : bool = Form(...),
  usage_limit : int = Form(...),

  db : Session = Depends(get_db)  
):
    code = generate_unique_coupon_code()
    expire = datetime.now() + timedelta(expire_days)
    db_coupons = models.CouponCode(
        code  = code,
        discount_price = discount_price,
        expires_date = expire,
        is_active = is_active,
        usage_limit = usage_limit,
    )
    db.add(db_coupons)
    db.commit()
    db.refresh(db_coupons)
    return db_coupons


# Get Coupon Code
@router.get("/{code}/", response_model=CouponCodeBase)
async def get_coupon_code(code: str, db: Session = Depends(get_db)):
    get_coupon_code = db.query(models.CouponCode).filter(models.CouponCode.code == code).first()
    if not get_coupon_code:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
    
    return get_coupon_code 

@router.delete('/{coupon_code}', response_model= CouponCodeBase)
async def coupon_code(
    coupon_code : str,
    db: Session = Depends(get_db)
):
    get_coupon_code = db.query(models.CouponCode).filter(models.CouponCode.code == coupon_code).first()

    if not get_coupon_code:
        raise HTTPException(
            status_code=status.HTTP_404_CONFLICT,
            detail="Coupon Code not found"
        )
    db.delete(get_coupon_code)
    db.commit()
    return get_coupon_code



# Apply Coupon 
@router.put('/appy/', response_model = CouponCodeBase)
async def apply_coupon_code(
    code: str = Form(...),
    db: Session = Depends(get_db)
):
    valid_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == code).first()
    if not valid_coupon:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    if not valid_coupon.is_active:
        raise HTTPException(status_code=400, detail="Coupon is inactive")
    if valid_coupon.expires_date < datetime.now():
        raise HTTPException(status_code=400, detail="Coupon has expired")
    if valid_coupon.usage_limit and valid_coupon.usage_count >= valid_coupon.usage_limit:
        raise HTTPException(status_code=400, detail="Coupon usage limit reached")
    
    else:
        valid_coupon.usage_count += 1
        db.commit()
        db.refresh(valid_coupon)
        return valid_coupon
