from fastapi import FastAPI, HTTPException
from fastapi import Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from routers import channels, device, experiment_parameters, experiments
import models

app = FastAPI()

# app.include_router(channels.router)
app.include_router(device.router)
# app.include_router(experiment_parameters.router)
# app.include_router(experiments.router)