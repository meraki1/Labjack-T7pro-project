from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi import Depends
import schemas, models
from database import get_db

router = APIRouter()

#GET /devices/{device_id}: This route returns the device with the given device_id. If no such device exists, it returns a 404 error.
@router.get("/devices/{device_id}", response_model=schemas.Device)
def read_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return device
