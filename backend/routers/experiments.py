from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import schemas, models, tests
from database import get_db
from services import data_collecting
import pandas as pd
import os
import glob
import math

router = APIRouter(tags=["Experiment"])

# Send data to data_collecting.py
@router.post("/start_experiment/")
def start_experiment(experiment: schemas.ExperimentStart, db: Session = Depends(get_db)):
    try:
        # Send the data to data_collecting.py and start the experiment
        data_collecting.start_data_collecting(experiment.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Experiment data collected successfully"}

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


