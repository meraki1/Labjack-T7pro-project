from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas, models

router = APIRouter(tags=["Relationships"])

# Save or rewrite the relationship into the parameter_channel_relationships table for a specific device
@router.post("/relationships", response_model=List[schemas.ParameterChannelRelationshipBase])
def create_relationship(relationships: List[schemas.ParameterChannelRelationshipCreate], db: Session = Depends(get_db)):
    db_relationships = []
    device_id = None
    for relationship in relationships:
        # No need to look up IDs based on names, as they are provided directly from the frontend
        # Ensure the provided device_id, channel_id, and param_type_id exist in the database

        device = db.query(models.Device).filter_by(device_id=relationship.device_id).first()
        channel = db.query(models.DeviceChannel).filter_by(channel_id=relationship.channel_id).first()
        parameter = db.query(models.ParameterTypes).filter_by(param_type_id=relationship.param_type_id).first()

        if not device or not channel or not parameter:
            raise HTTPException(status_code=404, detail="Device, channel, or parameter not found")

        # Delete any existing relationships for the device
        if device_id != device.device_id:
            db.query(models.ParameterChannelRelationships).filter_by(device_id=device.device_id).delete()
            device_id = device.device_id

        # Create a new relationship
        db_relationship = models.ParameterChannelRelationships(
            channel_id=channel.channel_id,
            param_type_id=parameter.param_type_id, 
            device_id=device.device_id,
            offset=relationship.offset, 
            scale=relationship.scale     
        )
        db.add(db_relationship)
        db.commit()
        db.refresh(db_relationship)
        db_relationships.append(db_relationship)
    return db_relationships

# Read the parameter_channel_relationship table and get paremeters and channels names for given device id
@router.get("/relationships", response_model=List[schemas.ParameterChannelRelationshipSectionRead])
def read_parameter_channel_relationship(device_id: int, db: Session = Depends(get_db)):
    parameter_channel_relationship = db.query(
        models.ParameterChannelRelationships.channel_id,
        models.ParameterChannelRelationships.param_type_id,
        models.ParameterChannelRelationships.device_id,
        models.ParameterChannelRelationships.offset,
        models.ParameterChannelRelationships.scale,
        models.DeviceChannel.channel_name,
        models.ParameterTypes.param_type
    ) \
    .filter(models.ParameterChannelRelationships.device_id == device_id) \
    .join(models.DeviceChannel, models.ParameterChannelRelationships.channel_id == models.DeviceChannel.channel_id) \
    .join(models.ParameterTypes, models.ParameterChannelRelationships.param_type_id == models.ParameterTypes.param_type_id) \
    .all()

    if not parameter_channel_relationship:
        raise HTTPException(status_code=404, detail="No channels with their parameters found for the specified device")

    return parameter_channel_relationship

# Route to get channel parameters for a specific experiment
@router.get("/experiment/{experiment_id}/channel-parameters", response_model=schemas.ExperimentChannelsHeaders)
def get_channel_parameters(experiment_id: int, db: Session = Depends(get_db)):
    # Query the database to get channel IDs and parameter types for the specified experiment_id
    experiment_channels = db.query(models.ExperimentChannels).filter(models.ExperimentChannels.log_id == experiment_id).all()

    channel_parameters = {}
    for channel in experiment_channels:
        # Query the database to get channel name using defined_channel_id
        device_channel = db.query(models.DeviceChannel).filter(models.DeviceChannel.channel_id == channel.defined_channel_id).first()
        if device_channel:
            # For each channel, query the parameter_types table to get the parameter name
            parameter = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_type_id == channel.defined_param_type_id).first()
            if parameter:
                channel_parameters[device_channel.channel_name] = parameter.param_type
            else:
                channel_parameters[device_channel.channel_name] = "Unknown"
        else:
            channel_parameters[str(channel.defined_channel_id)] = "Unknown"

    return schemas.ExperimentChannelsHeaders(channel_parameters=channel_parameters)
