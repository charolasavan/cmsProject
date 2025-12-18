from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.product_tax import ProductTaxBase
from app.database import SessionLocal
from typing import  Optional

router = APIRouter(prefix="/tax", tags=["tax"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get('/')
def get_tax(db: Session = Depends(get_db)):
    db_tax = db.query(models.ProductTax).all()
    if not db_tax:
        return {"Not Found !!!"}
    return db_tax

@router.post('/')
def add_tax( 
    tax_name : Optional[str] = Form(...),
    tax_value : Optional[int] = Form(...),
    tax_active: Optional[int] = Form(...),
    db: Session= Depends(get_db)
):


    db_exist = db.query(models.ProductTax).filter(models.ProductTax.tax_name == tax_name).all()
    if db_exist:
        return {"Already Exist !!!"}
    else:
        db_tax = models.ProductTax(
            tax_name = tax_name,
            tax_value = tax_value,
            tax_active = tax_active
        )
        if db_tax:
            try:
                db.add(db_tax)
                db.commit()
                db.refresh(db_tax)
                return db_tax
            except:
                raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Not Inserted !!!"
            )

    
@router.get('/{tax_id}')
def get_tax_data(tax_id: int, db: Session = Depends(get_db)):
    db_get_tax = db.query(models.ProductTax).filter(models.ProductTax.tax_id == tax_id).first()
    if not db_get_tax:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tax not found"
        )
    return db_get_tax

@router.put('/{tax_id}', response_model = ProductTaxBase)
def change_tax(tax_id : int, 
    tax_name : Optional[str] = Form(None),
    tax_values : int = Form(None),
    tax_active: int = Form(None),
    db: Session= Depends(get_db)
):
    db_tax = db.query(models.ProductTax).filter(models.ProductTax.tax_id == tax_id).first()
    if not db_tax:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tax not found"
        )

    db_tax.tax_name = tax_name
    db_tax.tax_value = tax_values
    db_tax.tax_active = tax_active
    try:
        db.commit()
        db.refresh(db_tax)
        return db_tax
    except:
        raise HTTPException(

            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Not Inserted !!!"
        )
    


@router.delete("/{tax_id}", response_model = ProductTaxBase)
async def delete_tax(tax_id: int, db: Session = Depends(get_db)):
    db_tax = db.query(models.ProductTax).filter(models.ProductTax.tax_id == tax_id).first()
    if not db_tax:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tax not found"
        )

    db.delete(db_tax)
    db.commit()
    return db_tax 