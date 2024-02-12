from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData, Table, select
from typing import Optional
from datetime import datetime
import schemas, models, tests
from database import get_db
from services import dataCollecting
import pandas as pd
import os
import glob
import math

router = APIRouter(tags=["Experiment"])

# Get last experiment number
@router.get('/experiment_number/')
async def fetch_experiment_number(db: Session = Depends(get_db)):
    # Query the last log_id in the table
    query = select(models.ExperimentLogs.log_id).order_by(models.ExperimentLogs.log_id.desc()).limit(1)
    last_log_id = db.execute(query).scalar()

    # If there's no log_id in the table, return 0
    if last_log_id is None:
        return {'experimentNumber': 1}

    # Otherwise, return the last log_id plus 1
    return {'experimentNumber': last_log_id + 1}
    
# Send data to dataCollecting.py
@router.post("/start_experiment/")
def start_experiment(experiment: schemas.ExperimentStart, db: Session = Depends(get_db)):
    try:
        # Send the data to dataCollecting.py and start the experiment
        dataCollecting.start_dataCollecting(experiment.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Experiment data collected successfully"}

# Function to handle experiment data posting
@router.post("/experimentDataCreate/")
def create_experiment_data(experiment_data: schemas.ExperimentUpdate, db: Session = Depends(get_db)):
    try:
        # Create experiment log
        current_time = datetime.now()
        db_experiment_log = models.ExperimentLogs(
            start_time=current_time,
            notes=experiment_data.experiment_parameters[9].value if 9 in experiment_data.experiment_parameters else None,
            device_id=experiment_data.device_id
        )
        db.add(db_experiment_log)
        db.commit()
        db.refresh(db_experiment_log)

        # Create experiment parameters
        for param_type_id, param in experiment_data.experiment_parameters.items():
            if param.parameter_name != 'Notes about Experiment':
                db_experiment_parameter = models.ExperimentParameters(
                    param_type_id=param_type_id,
                    log_id=db_experiment_log.log_id,
                    param_value=int(param.value) if isinstance(param.value, str) and param.value.isdigit() else param.value
                )
                db.add(db_experiment_parameter)

        # Create experiment channels
        for channel in experiment_data.channel_parameters:
            db_experiment_channel = models.ExperimentChannels(
                log_id=db_experiment_log.log_id,
                defined_channel_id=channel.channel_id,
                defined_param_type_id=channel.param_type_id
            )
            db.add(db_experiment_channel)
        db.commit()

        return {"message": "Experiment data, parameters, and channels created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# View experiment results
@router.get("/experiment/{experiment_id}/results")
def get_experiment_results(experiment_id: int, 
                           page: int = Query(1, ge=1), 
                           per_page: Optional[int] = Query(100, ge=1)):
    # Define the directory where the experiment results are stored
    base_directory = os.getenv("base_directory")
    directory = os.path.join(base_directory, f"experiment_{experiment_id}")

    # Check if the directory exists
    if not os.path.exists(directory):
        raise HTTPException(status_code=404, detail="Experiment not found")

    # Read all Parquet files in the directory
    file_paths = glob.glob(os.path.join(directory, "*.parquet.gzip"))
    data_frames = [pd.read_parquet(file_path) for file_path in file_paths]

    # Concatenate all data frames into one
    data = pd.concat(data_frames, ignore_index=True)

    # Convert Unix timestamp to datetime
    data['timestamp'] = data['timestamp'].apply(lambda x: datetime.fromtimestamp(x))

    # Calculate total number of records and pages available
    total_records = len(data)
    total_pages = math.ceil(total_records / per_page)

    # Validate requested page number
    if page > total_pages:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid page number: Maximum page number is {total_pages}"
        )

    # Calculate start and end for slicing the data
    start = (page - 1) * per_page
    end = start + per_page

    # Slice the data
    paginated_data = data.iloc[start:end]

    # Convert the data frame to a dictionary and return it
    return paginated_data.to_dict(orient="records")

# Calculates summary statistics for each parameter in the experiment data
@router.get("/experiment/{experiment_id}/summary")
def get_experiment_summary(experiment_id: int):
    # Similar to your get_experiment_results function, read the data
    base_directory = os.getenv("base_directory")
    directory = os.path.join(base_directory, f"experiment_{experiment_id}")
    if not os.path.exists(directory):
        raise HTTPException(status_code=404, detail="Experiment not found")
    file_paths = glob.glob(os.path.join(directory, "*.parquet.gzip"))
    data_frames = [pd.read_parquet(file_path) for file_path in file_paths]
    data = pd.concat(data_frames, ignore_index=True)

    # Calculate summary statistics for each parameter
    summary = data.describe().to_dict()

    return summary

# Returns the data for a specified parameter that can be used for plotting
@router.get("/experiment/{experiment_id}/plot_data")
def get_experiment_plot_data(experiment_id: int, parameter: str):
    # Similar to your get_experiment_results function, read the data
    base_directory = os.getenv("base_directory")
    directory = os.path.join(base_directory, f"experiment_{experiment_id}")
    if not os.path.exists(directory):
        raise HTTPException(status_code=404, detail="Experiment not found")
    file_paths = glob.glob(os.path.join(directory, "*.parquet.gzip"))
    data_frames = [pd.read_parquet(file_path) for file_path in file_paths]
    data = pd.concat(data_frames, ignore_index=True)

    # Check if the parameter exists in the data
    if parameter not in data.columns:
        raise HTTPException(status_code=400, detail=f"Parameter {parameter} not found")

    # Return the data for the specified parameter
    plot_data = data[['timestamp', parameter]].to_dict(orient="records")

    return plot_data