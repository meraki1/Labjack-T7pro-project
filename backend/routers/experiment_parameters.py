from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import schemas, models
from database import get_db

router = APIRouter(tags=["Experiment parameters"])

@router.post("/experiment_parameters/")
def create_experiment_parameter(experiment_parameter: schemas.ExperimentParameterCreate, db: Session = Depends(get_db)):
    # Check if the param_type_id exists in the parameter_types table and is experiment parameter
    param_type = db.query(models.ParameterTypes).filter(models.ParameterTypes.param_type_id == experiment_parameter.param_type_id).first()
    if not param_type or param_type.param_class_id != 2:
        raise HTTPException(status_code=400, detail="Invalid param_type_id")

    # Create a new ExperimentParameter object
    db_experiment_parameter = models.ExperimentParameters(param_type_id=experiment_parameter.param_type_id, 
                                                          log_id=experiment_parameter.log_id, 
                                                          param_value=experiment_parameter.param_value)

    # Add and commit the new experiment parameter to the database
    db.add(db_experiment_parameter)
    db.commit()
    db.refresh(db_experiment_parameter)

    return db_experiment_parameter