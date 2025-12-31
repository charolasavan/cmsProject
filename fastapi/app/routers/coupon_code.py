from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.coupon_code import CouponCodeBase
from app.database import SessionLocal
from datetime import datetime, timedelta, date
import uuid
from typing import  Optional

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
    # db_coupons = db.query(models.CouponCode).all()
    db_coupon = db.query(models.CouponCode).options(
        joinedload(models.CouponCode.product)
    ).all()
    if not db_coupon:
        return { "Not found" }
    return db_coupon

# Generate  Coupon Code 

def generate_unique_coupon_code():
    return f"#{str(uuid.uuid4())[:6].upper()}"

@router.post('/', response_model = CouponCodeBase)
async def generate_coupons(
  code : Optional[str] = Form(None),
  discount_price : int = Form(...),
  expires_date : str  =  Form(...),
  is_active : bool = Form(...),
  usage_limit : int = Form(...),
  product_id : Optional[int]= Form(None),
  db : Session = Depends(get_db)  
):



    if code:
        existing_coupon = db.query(models.CouponCode).filter(models.CouponCode.code == code).first()
        if existing_coupon:
            return {"error": "Coupon code already exists"}
    else:
        code = generate_unique_coupon_code()

    today = datetime.now().date()
    try:
        expire = datetime.strptime(expires_date, "%Y-%m-%d") 
    except ValueError:
        return {"error": "Invalid expiration date format. Please use YYYY-MM-DD."}
    if expire.date() < today:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Date Must be Greate To Now")



    else:
        is_active = True
        db_coupons = models.CouponCode(
        code  = code,
        discount_price = discount_price,
        expires_date = expire,
        is_active = is_active,
        usage_limit = usage_limit,
        product_id = product_id
    )
    db.add(db_coupons)
    db.commit()
    db.refresh(db_coupons)
    return db_coupons


# Get Coupon Code
@router.get("/{id}", response_model=CouponCodeBase)
async def get_coupon_code(id: int, db: Session = Depends(get_db)):
    get_coupon_code = db.query(models.CouponCode).filter(models.CouponCode.id == id).first()
    if not get_coupon_code:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon not found")
    
    return get_coupon_code 

# Update Coupon Data
@router.put("/{id}", response_model=CouponCodeBase)
async def update_couponcode(
    id : int,
   code: Optional[str] = Form(None),
    discount_price: Optional[int] = Form(None),
    expires_date: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    usage_limit: Optional[int] = Form(None),
   db: Session = Depends(get_db)
):
    db_coupons = db.query(models.CouponCode).filter(models.CouponCode.id == id).first()
    if not db_coupons:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coupon Code not found")
    if code and db_coupons.code != code:

        existing = db.query(models.CouponCode).filter(models.CouponCode.code == code).first()
        if existing:
            
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This Coupon code already exists."
            )
    
  
    if code:
        db_coupons.code = code
    if discount_price is not None:
        db_coupons.discount_price = discount_price
    if expires_date:
        db_coupons.expires_date = expires_date
    if is_active is not None:
        db_coupons.is_active = is_active
    if usage_limit is not None:
        db_coupons.usage_limit = usage_limit

    db.commit()
    db.refresh(db_coupons)
    return db_coupons

# Delete Coupon code 

@router.delete('/{id}', response_model= CouponCodeBase)
async def coupon_code(
    id : int,
    db: Session = Depends(get_db)
):
    get_coupon_code = db.query(models.CouponCode).filter(models.CouponCode.id == id).first()

    if not get_coupon_code:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
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
    if valid_coupon.expires_date < datetime.now().date():
        raise HTTPException(status_code=400, detail="Coupon has expired")
    if valid_coupon.usage_limit and valid_coupon.usage_count >= valid_coupon.usage_limit:
        raise HTTPException(status_code=400, detail="Coupon usage limit reached")
    
    else:
        valid_coupon.usage_count += 1
        db.commit()
        db.refresh(valid_coupon)
        return valid_coupon
