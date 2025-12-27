import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from service import analyze_audio_service

app = FastAPI(title="Healio Voice Analysis Microservice")

# CORS - Allow strict frontend origin later, broad for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_audio"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    """
    Receives an audio file, processes it for heuristics, and cleans up.
    """
    # 1. Validation
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be audio.")

    # 2. Save Temp File
    file_id = str(uuid.uuid4())
    # Extension handling - safe logic
    ext = file.filename.split(".")[-1] if "." in file.filename else "wav"
    temp_path = os.path.join(TEMP_DIR, f"{file_id}.{ext}")

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 3. Process
        analysis_data = await analyze_audio_service(temp_path)
        
        return {
            "success": True,
            "data": analysis_data
        }

    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # 4. Privacy Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/")
def health_check():
    return {"status": "Healio Voice Service Running"}
