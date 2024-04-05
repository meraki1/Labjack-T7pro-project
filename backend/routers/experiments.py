from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData, Table, select, and_
from typing import Optional, List
from datetime import datetime
import schemas, models, tests
from database import get_db
from services import dataCollecting
from tests import dataCollectingTest
from routers.experimentLogs import get_start_time
import pandas as pd
import os
import glob

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
def start_experiment(experiment: schemas.ExperimentStartDataCollecting, db: Session = Depends(get_db)):
    try:
        # Call the start_data_collecting function from dataCollectingTest.py
        success = dataCollectingTest.start_data_collecting(experiment, db)
        if success:
            return {"message": "Experiment data collected successfully"}
        else:
            return {"message": "Failed to collect experiment data"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Function to handle experiment data posting to the database
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

# Get all the experiments that were measured
@router.get("/experiments", response_model=List[schemas.ExperimentSelection])
async def get_all_experiments(db: Session = Depends(get_db)):
    base_directory = os.getenv("base_directory")
    experiment_directories = glob.glob(os.path.join(base_directory, "experiment_*"))
    experiments = []
    for directory in experiment_directories:
        experiment_id = int(directory.split("_")[-1])
        folder_name = os.path.basename(directory)
        
        # Get the start time from the database
        start_time = get_start_time(db, experiment_id)

        experiments.append({
            "experiment_id": experiment_id,
            "folder_name": folder_name,
            "start_time": start_time,
        })
    return experiments

# Get experiment id and timestamp
@router.get("/experiment/{experiment_id}", response_model=schemas.Experiment)
async def fetch_experiment_id_and_timestamp(experiment_id: int, db: Session = Depends(get_db)):
    query = select(models.ExperimentLogs.log_id, models.ExperimentLogs.start_time).where(models.ExperimentLogs.log_id == experiment_id)
    result = db.execute(query).fetchone()
    
    if result is None:
        raise HTTPException(status_code=404, detail="Experiment ID not found")
    
    return schemas.Experiment(log_id=result[0], start_time=result[1]) 

# Get experiment samples and data for them
@router.get("/experiment_samples/{experiment_id}", response_model=List[schemas.ExperimentSampleBase])
def read_experiment_samples(experiment_id: int, db: Session = Depends(get_db)):
    experiment_samples = db.query(models.ExperimentSample).filter(models.ExperimentSample.experiment_log_id == experiment_id).all()
    if not experiment_samples:
        raise HTTPException(status_code=404, detail="No samples found for this experiment ID")
    
    # Remove file extensions
    for sample in experiment_samples:
        sample.file_name = sample.file_name.split(".")[0]
    
    return experiment_samples

# Get experiment details logs based on log_id
@router.get("/experiment_details_logs/{experiment_id}", response_model=List[schemas.ExperimentDetailLogs])
async def fetch_experiment_details_logs(experiment_id: int, db: Session = Depends(get_db)):
    read_experiment_details = select(
        models.ExperimentLogs.log_id,
        models.ExperimentLogs.notes,
        models.Device.device_name
    ).select_from(
        models.ExperimentLogs
    ).join(
        models.Device, models.ExperimentLogs.device_id == models.Device.device_id
    ).where(
        models.ExperimentLogs.log_id == experiment_id
    )

    experiment_details = db.execute(read_experiment_details).fetchall()

    if not experiment_details:
        raise HTTPException(status_code=404, detail="No details found for this experiment ID")
    
    return [{"log_id": detail[0], "notes": detail[1], "device_name": detail[2]} for detail in experiment_details]

# Get experiment details channels based on log_id
@router.get("/experiment_details_channels/{experiment_id}", response_model=List[schemas.ExperimentDetailChannels])
async def fetch_experiment_details_channels(experiment_id: int, db: Session = Depends(get_db)):
    read_experiment_details = select(
        models.DeviceChannel.channel_name,
        models.ParameterTypes.param_type,
        models.ParameterChannelRelationships.offset,
        models.ParameterChannelRelationships.scale
    ).select_from(
        models.ExperimentLogs
    ).join(
        models.ExperimentChannels, models.ExperimentLogs.log_id == models.ExperimentChannels.log_id
    ).join(
        models.DeviceChannel, models.ExperimentChannels.defined_channel_id == models.DeviceChannel.channel_id
    ).join(
        models.ParameterTypes, models.ExperimentChannels.defined_param_type_id == models.ParameterTypes.param_type_id
    ).join(
        models.ParameterChannelRelationships, models.ExperimentChannels.defined_param_type_id == models.ParameterChannelRelationships.param_type_id
    ).where(
        models.ExperimentLogs.log_id == experiment_id
    )

    experiment_details = db.execute(read_experiment_details).fetchall()

    if not experiment_details:
        raise HTTPException(status_code=404, detail="No details found for this experiment ID")
    
    return [schemas.ExperimentDetailChannels(channels_parameters={detail[0]: detail[1]}, offset=detail[2], scale=detail[3] ) for detail in experiment_details]

# Get experiment details parameters based on log_id
@router.get("/experiment_details_parameters/{experiment_id}", response_model=List[schemas.ExperimentDetailParameters])
async def fetch_experiment_details_parameters(experiment_id: int, db: Session = Depends(get_db)):
    read_experiment_details = select(
        models.ParameterTypes.param_type,
        models.ExperimentParameters.param_value
    ).select_from(
        models.ExperimentLogs
    ).join(
        models.ExperimentParameters, models.ExperimentLogs.log_id == models.ExperimentParameters.log_id
    ).join(
        models.ParameterTypes, models.ExperimentParameters.param_type_id == models.ParameterTypes.param_type_id
    ).where(
        models.ExperimentLogs.log_id == experiment_id
    )

    experiment_details = db.execute(read_experiment_details).fetchall()

    if not experiment_details:
        raise HTTPException(status_code=404, detail="No details found for this experiment ID")
    
    return [schemas.ExperimentDetailParameters(experiment_parameters={detail[0]: detail[1]}) for detail in experiment_details]
