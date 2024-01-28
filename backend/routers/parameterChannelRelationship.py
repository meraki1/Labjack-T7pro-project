from fastapi import APIRouter, HTTPException, Depends
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
            device_id=device.device_id
        )
        db.add(db_relationship)
        db.commit()
        db.refresh(db_relationship)
        db_relationships.append(db_relationship)
    return db_relationships