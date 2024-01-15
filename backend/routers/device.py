from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
from typing import Annotated, List
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

# This route returns all devices from device table. If no such device exists, it returns a 404 error.
@router.get("/devices", response_model=List[schemas.DeviceRead])
def get_all_devices(db: Session = Depends(get_db)):
    devices = db.query(models.Device).all()
    if not devices:
        raise HTTPException(status_code=404, detail="No devices found")
    return devices

# This route updates the device name in the device table
@router.put("/devices/{device_id}", response_model=schemas.DeviceBase)
def update_device(device_id: int, device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    db_device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    db_device.device_name = device.device_name
    db.commit()
    db.refresh(db_device)
    return db_device

# This route posts a new device into device table
@router.post("/devices", response_model=schemas.DeviceBase)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    db_device = models.Device(device_name=device.device_name)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device