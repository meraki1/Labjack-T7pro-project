from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models
from database import get_db

router = APIRouter(tags=["Experiment"])

@router.post("/start_experiment/")
def start_experiment(experiment_data: ExperimentData, db: Session = Depends(get_db)):
    # Populate the experiment_parameters, experiment_logs, and experiment_channels tables
    # You can call the functions you've already defined for this
    create_experiment_parameters(experiment_data.parameters, db)
    create_experiment_logs(experiment_data.logs, db)
    create_experiment_channels(experiment_data.channels, db)

    # Send the information to the data_collecting.py script and start the data collection process
    start_data_collection(experiment_data)

    return {"detail": "Experiment started successfully"}