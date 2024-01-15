from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
from typing import Annotated
import schemas, models
from database import get_db

router = APIRouter(tags=["Device"])

#GET /devices/{device_id}: This route returns the device with the given device_id. If no such device exists, it returns a 404 error.
@router.get("/devices/", response_model=schemas.DeviceRead)
def read_device(db: Session = Depends(get_db)):
    device = db.query(models.Device).first()
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"device_name": device.device_name}