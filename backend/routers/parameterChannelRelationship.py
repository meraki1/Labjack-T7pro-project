from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict
import schemas, models
from database import get_db

router = APIRouter(tags=["Relationships"])

# Save or rewrite the relationship into the parameter_channel_relationships table for specific device
@router.post("/relationships/", response_model=schemas.ParameterChannelRelationshipRead)
def create_relationship(relationship: schemas.ParameterChannelRelationshipCreate, db: Session = Depends(get_db)):
    # Delete any existing relationships for the device
    db.query(models.ParameterChannelRelationships).filter(models.ParameterChannelRelationships.device_id == relationship.device_id).delete()
    db.commit()

    # Create a new relationship
    db_relationship = models.ParameterChannelRelationships(
        channel_id=relationship.channel_id, 
        param_type_id=relationship.param_type_id, 
        device_id=relationship.device_id
    )
    db.add(db_relationship)
    db.commit()
    db.refresh(db_relationship)
    return db_relationship

# Read only channel parameters from parameters_type
parameterNames = {
    "temp": "Temperature",
    "rpm": "Revolutions Per Minute",
    "vib": "Vibration",
    "vert_load": "Vertical Load",
    "ax_load": "Axial Load"
}

@router.get("/relationships/", response_model=Dict[str, str])
def read_channel_parameters(db: Session = Depends(get_db)):
    exp_param_list = db.query(models.ParameterTypes.param_type).filter(models.ParameterTypes.param_class_id == 1).all()
    if not exp_param_list:
        raise HTTPException(status_code=404, detail="No parameters found")
    return {param[0]: parameterNames[param[0]] for param in exp_param_list}
