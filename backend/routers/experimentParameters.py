from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db

router = APIRouter(tags=["Experiment parameters"])

# Read only experiment parameters in general
@router.get("/experimentParameters/", response_model=List[schemas.ParameterTypeRead])
def read_experiment_parameters(db: Session = Depends(get_db)):
    param_list = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_class_id == 2).all()
    if not param_list:
        raise HTTPException(status_code=404, detail="No parameters found.")
    return param_list

# Read experiment parameters for a specific experiment
@router.get("/experimentParameters/{log_id}", response_model=List[schemas.ExperimentParameterRead])
def read_experiment_parameters_log_id(log_id: int, db: Session = Depends(get_db)):
    param_list = db.query(models.ExperimentParameters).filter(models.ExperimentParameters.log_id == log_id).all()
    if not param_list:
        raise HTTPException(status_code=404, detail="No parameters found for this log_id")
    return param_list