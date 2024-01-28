from pydantic import BaseModel
from typing import Optional, Dict

# ParameterClass Models
class ParameterClassBase(BaseModel):
    param_class: Optional[str]

class ParameterClassCreate(ParameterClassBase):
    param_class: str

class ParameterClassRead(ParameterClassBase):
    param_class_id: int

    class Config:
        from_attributes = True

# ParameterType Models
class ParameterTypeBase(BaseModel):
    param_type: Optional[str]

class ParameterTypeCreate(ParameterTypeBase):
    param_type: str
    param_class_id: int

class ParameterTypeRead(ParameterTypeBase):
    param_type_id: int
    param_type: str

    class Config:
        from_attributes = True

# Device Models
class DeviceBase(BaseModel):
    device_name: Optional[str]

class DeviceCreate(DeviceBase):
    device_name: str

class DeviceRead(DeviceBase):
    device_id: int

    class Config:
        orm_mode = True


# DeviceChannel Models
class DeviceChannelBase(BaseModel):
    channel_name: str

class DeviceChannelCreate(DeviceChannelBase):
    channel_name: str

class DeviceChannelRead(DeviceChannelBase):
    channel_id: int

    class Config:
        from_attributes = True

# ExperimentChannel Models
class ExperimentChannelBase(BaseModel):
    log_id: Optional[int]
    defined_channel_id: Optional[int]
    defined_param_type_id: Optional[int]

class ExperimentChannelCreate(ExperimentChannelBase):
    log_id: int
    defined_channel_id: int
    defined_param_type_id: int

class ExperimentChannelRead(ExperimentChannelBase):
    experiment_channel_id: int

    class Config:
        from_attributes = True
    
# ExperimentLog Models
class ExperimentLogBase(BaseModel):
    start_time: Optional[str]
    comments: Optional[str]
    device_id: Optional[int]

class ExperimentLogCreate(ExperimentLogBase):
    start_time: Optional[str]
    comments: Optional[str]
    device_id: int

class ExperimentLogRead(ExperimentLogBase):
    log_id: int

    class Config:
        from_attributes = True

# ExperimentParameter Models
class ExperimentParameterBase(BaseModel):
    param_type_id: Optional[int]
    log_id: Optional[int]
    param_value: Optional[str]

class ExperimentParameterCreate(ExperimentParameterBase):
    param_type_id: int
    log_id: int
    param_value: str

class ExperimentParameterRead(ExperimentParameterBase):
    experiment_param_id: int

    class Config:
        from_attributes = True


class ParameterChannelRelationshipCreate(BaseModel):
    channel_id: int
    param_type_id: int
    device_id: int


# ParameterChannelRelationship Models
class ParameterChannelRelationshipBase(BaseModel):
    relationship_id: Optional[int]
    channel_id: Optional[int]
    param_type_id: Optional[int]
    device_id: Optional[int]

class ParameterChannelRelationshipRead(BaseModel):
    channel_name: str
    param_type: str
    device_name: str

    class Config:
        from_attributes = True

# Model for validation for data_collecting.py 
class ExperimentStart(BaseModel):
    log_id: int
    sampling_rate: float
    duration_of_collection: float
    measurement_interval: float
    channel_parameters: Dict[str, str]