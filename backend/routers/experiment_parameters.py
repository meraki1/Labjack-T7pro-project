from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db

router = APIRouter(tags=["Experiment parameters"])

# Read everything for experiment parameters from parameters_type
@router.get("/experiment_parameters/", response_model=List[schemas.ParameterTypeRead])
def read_experiment_parameters(db: Session = Depends(get_db)):
    exp_param_list = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_class_id == 2).all()
    if not exp_param_list:
        raise HTTPException(status_code=404, detail="No parameters found")
    return exp_param_list

# Read experiment parameters for a specific experiment
@router.get("/experiment_parameters/{log_id}", response_model=List[schemas.ExperimentParameterRead])
def read_experiment_parameters_log_id(log_id: int, db: Session = Depends(get_db)):
    param_list = db.query(models.ExperimentParameters).filter(models.ExperimentParameters.log_id == log_id).all()
    if not param_list:
        raise HTTPException(status_code=404, detail="No parameters found for this log_id")
    return param_list

# Create experiment parameters for a specific experiment
@router.post("/experiment_parameters/")
def create_experiment_parameters(experiment_parameters: List[schemas.ExperimentParameterCreate], db: Session = Depends(get_db)):
    for experiment_parameter in experiment_parameters:
        # Check if the param_type_id exists in the parameter_types table and is experiment parameter
        param_type = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_type_id == experiment_parameter.param_type_id).first()
        if not param_type or param_type.param_class_id != 2:
            raise HTTPException(status_code=400, detail="Invalid param_type_id")

        # Create a new ExperimentParameter object
        db_experiment_parameter = models.ExperimentParameters(param_type_id=experiment_parameter.param_type_id, 
                                                              log_id=experiment_parameter.log_id, 
                                                              param_value=experiment_parameter.param_value)

        # Add the new experiment parameter to the database
        db.add(db_experiment_parameter)
    db.commit()

    return {"detail": "Experiment parameters created successfully"}