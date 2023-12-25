from pydantic import BaseModel

class DeviceBase(BaseModel):
    device_name: Optional[str] = None
    comments: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    device_id: int

    class Config:
        orm_mode = True

# DeviceBase is a base model that includes the fields that can be written (device_name and comments). 
# DeviceCreate is used when creating a new Device, and Device is used when reading a Device.