from pydantic import BaseModel
from datetime import date
from typing import Optional

class PaymentBase(BaseModel):
    payment_id : int
    payment_name : str