from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load("model.pkl")  # Load your trained model

class InputData(BaseModel):
    marks: int
    difficulty: str

@app.post("/predict/")
async def predict(data: InputData):
    # Convert difficulty to numerical value (Example: Easy=1, Moderate=2, Hard=3)
    difficulty_mapping = {"Easy": 1, "Moderate": 2, "Hard": 3}
    difficulty_level = difficulty_mapping.get(data.difficulty, 2)

    # Prepare input for model
    model_input = [[data.marks, difficulty_level]]
    
    # Get predictions
    prediction = model.predict(model_input)
    
    # Assuming model returns percentile and rank
    percentile = prediction[0][0]  
    rank = prediction[0][1]

    return {"percentile": percentile, "rank": rank}
