from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db
from datetime import datetime

router = APIRouter(tags=["Experiment Logs"])

# Get start time from experiment_logs table
def get_start_time(db: Session, experiment_id: int) -> datetime:
    experiment_log = db.query(models.ExperimentLogs).filter(models.ExperimentLogs.log_id == experiment_id).first()
    if not experiment_log:
        raise HTTPException(status_code=404, detail="Experiment log not found")
    return experiment_log.start_time
