from pydantic import BaseModel
from typing import Optional, Dict, List, Union
from datetime import datetime

class ExperimentDetailParameters(BaseModel):
    experiment_parameters: Dict[str, str]

class ExperimentDetailChannels(BaseModel):
    channels_parameters: Dict[str, str]
    offset: float
    scale: float

class ExperimentDetailLogs(BaseModel):
    log_id: int
    notes: str
    device_name: str

class Experiment(BaseModel):
    log_id: int
    start_time: datetime

class ExperimentSampleBase(BaseModel):
    id: int
    file_name: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    experiment_log_id: Optional[int]
    sample_number: Optional[int]

class ExperimentSampleCreate(ExperimentSampleBase):
    pass

class ExperimentSampleRead(ExperimentSampleBase):
    id: int
    file_name: str

    class Config:
        from_attributes = True

class SpecificExperimentChannelRead(BaseModel):
    defined_param_type_id: int
    defined_param_type_id: int
    param_type: str
    channel_name: str
    offset: float
    scale:float

class SpecificExperimentParameterRead(BaseModel):
    param_type_id: int
    param_type: str
    param_value: int

class DeviceUsed(BaseModel):
    device_name: str

class ExperimentChannelsHeaders(BaseModel):
    channel_parameters: Dict[str, str]    

class ExperimentSelection(BaseModel):
    experiment_id: int
    start_time: datetime
    folder_name: str

class ChannelParameter(BaseModel):
    channel_id: int
    param_type_id: int
    device_id: int
    channel_name: str
    param_type: str

class ExperimentParameter(BaseModel):
    value: Union[int, str]
    parameter_name: str

class ExperimentUpdate(BaseModel):
    channel_parameters: List[ChannelParameter]
    device_id: int
    experiment_parameters: dict[int, ExperimentParameter]

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
        from_attributes = True

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
    log_id: Optional[int]
    start_time: Optional[datetime]
    comments: Optional[str]
    device_id: Optional[int]

class ExperimentLogCreate(ExperimentLogBase):
    start_time: Optional[str]
    comments: Optional[str]
    device_id: int

class ExperimentLogRead(ExperimentLogBase):
    log_id: int
    start_time: datetime

    class Config:
        from_attributes = True

# ExperimentParameter Models
class ExperimentParameterBase(BaseModel):
    param_type_id: Optional[int]
    log_id: Optional[int]
    param_value: Optional[int]
    param_type: Optional[str]

class ExperimentParameterCreate(ExperimentParameterBase):
    param_type_id: int
    log_id: int
    param_value: str

class ExperimentParameterRead(ExperimentParameterBase):
    experiment_param_id: int
    param_type: str
    param_value: int

    class Config:
        from_attributes = True

# Alone BaseModel needed for create channel parameter relationship
class ParameterChannelRelationshipCreate(BaseModel):
    channel_id: int
    param_type_id: int
    device_id: int
    offset:float
    scale:float

# Alone BaseModel needed for section for reading channel parameter relationship
class ParameterChannelRelationshipSectionRead(BaseModel):
    channel_id: int
    param_type_id: int
    device_id: int
    channel_name: str
    param_type: str
    offset: float
    scale: float

# ParameterChannelRelationship Models
class ParameterChannelRelationshipBase(BaseModel):
    relationship_id: Optional[int]
    channel_id: Optional[int]
    param_type_id: Optional[int]
    device_id: Optional[int]
    offset:Optional[float]
    scale:Optional[float]

class ParameterChannelRelationshipRead(BaseModel):
    channel_name: str
    param_type: str
    device_name: str

    class Config:
        from_attributes = True

# Model for validation for data_collecting.py 
class ChannelParameterDataCollecting(BaseModel):
    channel_id: int
    param_type_id: int
    device_id: int
    channel_name: str
    param_type: str

class ExperimentParameterDataCollecting(BaseModel):
    value: Union[int, str]
    parameter_name: str

class ExperimentStartDataCollecting(BaseModel):
    log_id: int
    channel_parameters: List[ChannelParameterDataCollecting] 
    experiment_parameters: dict[int, ExperimentParameterDataCollecting]
