from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db

router = APIRouter(tags=["Experiment"])

router = APIRouter()

@router.post("/start_experiment/")
def start_experiment(experiment: schemas.ExperimentStart, db: Session = Depends(get_db)):
    # Your code here to start the experiment
    # You can access the parameters from the `experiment` object
    # For example: `experiment.log_id`, `experiment.sampling_rate`, etc.
    pass
