from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
import schemas, models
from models import ParameterTypes, DeviceChannel
from database import get_db

router = APIRouter(tags=["Channels"])

# Read only channel parameters in general
@router.get("/channelsParameters/", response_model=List[schemas.ParameterTypeRead])
def read_channel_parameters(db: Session = Depends(get_db)):
    param_list = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_class_id == 1).all()
    if not param_list:
        raise HTTPException(status_code=404, detail="No parameters found.")
    return param_list

# Read experiment channels for experiment_channels table for specific experiment log
@router.get("/channels/{log_id}", response_model=List[schemas.SpecificExperimentChannelRead])
def read_experiment_channels_log_id(log_id: int, db: Session = Depends(get_db)):
    param_channel_list = db.query(
        models.ExperimentChannels.defined_param_type_id,
        models.ExperimentChannels.defined_param_type_id,
        models.ParameterTypes.param_type,
        models.DeviceChannel.channel_name,
        models.ParameterChannelRelationships.offset, 
        models.ParameterChannelRelationships.scale,
    ) \
    .filter(models.ExperimentChannels.log_id == log_id) \
    .join(models.ParameterTypes, models.ExperimentChannels.defined_param_type_id == models.ParameterTypes.param_type_id) \
    .join(models.DeviceChannel, models.ExperimentChannels.defined_channel_id == models.DeviceChannel.channel_id) \
    .join(models.ParameterChannelRelationships, models.ExperimentChannels.defined_channel_id == models.ParameterChannelRelationships.channel_id) \
    .all()

    if not param_channel_list:
        raise HTTPException(status_code=404, detail="No channels with their parameters found for this log_id")
    
    return param_channel_list

# Read channels from device_channels for a list
@router.get("/channels", response_model=List[schemas.DeviceChannelRead])
def read_device_channels(db: Session = Depends(get_db)):
    device_channels_list = db.query(models.DeviceChannel).all()
    if not device_channels_list:
        raise HTTPException(status_code=404, detail="No channels found")
    return device_channels_list







