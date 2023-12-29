from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db
from services import data_collecting

router = APIRouter(tags=["Experiment"])

router = APIRouter()

# Send data to data_collecting.py
@router.post("/start_experiment/")
def start_experiment(experiment: schemas.ExperimentStart, db: Session = Depends(get_db)):
    try:
        # Send the data to data_collecting.py and start the experiment
        data_collecting.start_experiment(experiment.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Experiment started successfully"}
