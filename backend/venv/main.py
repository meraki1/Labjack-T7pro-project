from fastapi import FastAPI
from .routers import channels, devices, experiment_parameters, experiments

app = FastAPI()

app.include_router(channels.router)
app.include_router(devices.router)
app.include_router(experiment_parameters.router)
app.include_router(experiments.router)