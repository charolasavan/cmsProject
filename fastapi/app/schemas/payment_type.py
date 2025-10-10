from pydantic import BaseModel
from datetime import date
from typing import Optional

class PaymentBase(BaseModel):
    id: int
    payment_type_id : int
    payment_type : str