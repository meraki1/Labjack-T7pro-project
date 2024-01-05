from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, List
from sqlalchemy.orm import Session
from routers import channels, device, experimentLogs, experimentParameters, experiments
import models

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(channels.router)
app.include_router(device.router)
app.include_router(experimentLogs.router)
app.include_router(experimentParameters.router)
app.include_router(experiments.router)