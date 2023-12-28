from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db
from datetime import datetime

router = APIRouter(tags=["Experiment Logs"])

@router.post("/experiment_logs/")
def create_experiment_log(experiment_log: schemas.ExperimentLogCreate, db: Session = Depends(get_db)):
    db_experiment_log = models.ExperimentLogs(comments=experiment_log.comments, 
                                              device_id=experiment_log.device_id,
                                              start_time=datetime.now())

    # Add the new experiment log to the database
    db.add(db_experiment_log)
    db.commit()
    db.refresh(db_experiment_log)

    return {"detail": "Experiment log created successfully"}
