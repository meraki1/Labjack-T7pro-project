from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
import schemas, models
from models import ParameterTypes, DeviceChannel
from database import get_db

router = APIRouter(tags=["Channels"])

# Read for experiment_channels table
@router.get("/channels/{log_id}", response_model=List[schemas.ExperimentChannelRead])
def read_experiment_channels(log_id: int, db: Session = Depends(get_db)):
    param_channel_list = db.query(models.ExperimentChannels).filter(models.ExperimentChannels.log_id == log_id).all()
    if not param_channel_list:
        raise HTTPException(status_code=404, detail="No channels with their parameters found for this log_id")
    return param_channel_list

# Read the parameter_channel_relationship table and get paremeters and channels names
@router.get("/parameter_channel_relationship/", response_model=List[schemas.ParameterChannelRelationshipRead])
def read_parameter_channel_relationship(db: Session = Depends(get_db)):
    parameter_channel_relationship = db.query(
        models.ParameterChannelRelationships.relationship_id,
        models.ParameterChannelRelationships.channel_id,
        models.DeviceChannel.channel_name,
        models.ParameterChannelRelationships.param_type_id,
        models.ParameterTypes.param_type,
        models.ParameterChannelRelationships.device_id
    )\
    .join(models.DeviceChannel, models.ParameterChannelRelationships.channel_id == models.DeviceChannel.channel_id)\
    .join(models.ParameterTypes, models.ParameterChannelRelationships.param_type_id == models.ParameterTypes.param_type_id)\
    .all()
    if not parameter_channel_relationship:
        raise HTTPException(status_code=404, detail="No channels with their parameters found")
    return parameter_channel_relationship

# Read channels from device_channels for a dropdown menu
@router.get("/device_channels", response_model=List[schemas.DeviceChannelRead])
def read_device_channels(db: Session = Depends(get_db)):
    device_channels_list = db.query(models.DeviceChannel).all()
    if not device_channels_list:
        raise HTTPException(status_code=404, detail="No channels found")
    return device_channels_list

# Create for experiment_channels table
@router.post("/channels/")
def create_experiment_channels(experiment_channels: List[schemas.ExperimentChannelCreate], db: Session = Depends(get_db)):
    for experiment_channel in experiment_channels:
        # Check if the defined_param_type_id exists in the parameter_types table and is channel parameter
        channel_type = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_type_id == experiment_channel.defined_param_type_id).first()
        if not channel_type or channel_type.param_class_id != 1:
            raise HTTPException(status_code=400, detail="Invalid param_type_id")

        # Create a new ExperimentChannel object
        db_experiment_channel = models.ExperimentChannels(log_id=experiment_channel.log_id,
                                                          defined_channel_id=experiment_channel.defined_channel_id,
                                                          defined_param_type_id=experiment_channel.defined_param_type_id)

        # Add the new experiment channel to the database
        db.add(db_experiment_channel)
    db.commit()

    return {"detail": "Experiment channels created successfully"}







