from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.payment_type import PaymentBase
from app.database import SessionLocal

router = APIRouter(prefix="/payment", tags=["Payment"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#  Get all products
@router.get("/")
async def get_payment_type(db: Session = Depends(get_db)):
    db_coupons = db.query(models.PaymentType).all()
    return db_coupons

# Add Payment Method (Type)
@router.post('/', response_model = PaymentBase)
async def add_payment_type(
    payment_type_id : int = Form(...),
    payment_type : str = Form(...),
    db: Session = Depends(get_db)
):
    existing = db.query(models.PaymentType).filter(models.PaymentType.payment_type_id == payment_type_id).all()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This Payment Type already exists."
        )
        
    db_payment = models.PaymentType(
        payment_type_id = payment_type_id,
        payment_type = payment_type
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment
    
    
# Get Payment Type By ID

@router.get('/{id}/', response_model = PaymentBase)
async def get_payment_type(id :int, db : Session = Depends(get_db)):
    db_payment = db.query(models.PaymentType).filter(models.PaymentType.payment_type_id == id).first()
    return db_payment
    
    
    
# Update Payment Type
@router.put("/{id}/", response_model=PaymentBase)
async def update_payment_type(
    id : int,
    payment_type_id: int = Form(...),
    payment_type: str = Form(...),
    
    db: Session = Depends(get_db)
):
    db_payment_type = db.query(models.PaymentType).filter(models.PaymentType.payment_type_id == id).first()
    if not db_payment_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment Type not found")
    
    existing = db.query(models.PaymentType).filter(models.PaymentType.payment_type == payment_type).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This Payment Type already exists."
        )
    
    db_payment_type.payment_type_id = payment_type_id
    db_payment_type.payment_type = payment_type
    

    db.commit()
    db.refresh(db_payment_type)
    return db_payment_type


# Delete Payment Type

@router.delete('/{id}/', response_model = PaymentBase)
async def delete_payment_type(id: int, db: Session = Depends(get_db)):
    db_payment_type = db.query(models.PaymentType).filter(models.PaymentType.payment_type_id == id).first()
    if not db_payment_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment Type not found"
            ) 
    db.delete(db_payment_type)
    db.commit()
    
    return db_payment_type