from sqlalchemy.orm import Session
from ..backend import models, schemas

def get_device(db: Session, device_id: int):
    return db.query(models.Device).filter(models.Device.device_id == device_id).first()

def get_devices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Device).offset(skip).limit(limit).all()

def create_device(db: Session, device: schemas.DeviceCreate):
    db_device = models.Device(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def update_device(db: Session, device: schemas.Device):
    db_device = db.query(models.Device).filter(models.Device.device_id == device.device_id).first()
    db_device.device_name = device.device_name
    db_device.comments = device.comments
    db.commit()
    db.refresh(db_device)
    return db_device

def delete_device(db: Session, device_id: int):
    db_device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    db.delete(db_device)
    db.commit()
