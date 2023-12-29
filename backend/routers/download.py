from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter(tags=["Download"])

@router.get("/download/{file_path}")
def download_file(file_path: str):
    return FileResponse(file_path, media_type="application/zip", filename=f"{file_path}.zip")