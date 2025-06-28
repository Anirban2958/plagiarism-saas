# =====================
# 1. Import dependencies
# =====================
from fastapi import FastAPI  # FastAPI framework
from pydantic import BaseModel  # For request validation
from fastapi.middleware.cors import CORSMiddleware  # For CORS support

from .auto_index_dynamic import check_live_plagiarism  # Plagiarism checking logic


# =====================
# 2. Create FastAPI app instance
# =====================
app = FastAPI()


# =====================
# 3. Enable CORS (Cross-Origin Resource Sharing)
#    Allow all origins for development; restrict in production
# =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================
# 4. Define request schema using Pydantic
# =====================
class PlagiarismRequest(BaseModel):
    text: str  # The text to check for plagiarism


# =====================
# 5. Define API endpoint for plagiarism checking
# =====================
@app.post("/api/check-plagiarism")
def check_plagiarism(req: PlagiarismRequest):
    """
    Receives user text, checks for plagiarism using check_live_plagiarism,
    and returns the results in a frontend-friendly format.
    """
    results = check_live_plagiarism(req.text)
    return {
        "full_text": req.text,
        "fragment_matches": results if results is not None else []
    }


# =====================
# 6. Run with: uvicorn plagiarism_api:app --reload --host 0.0.0.0 --port 8000
# =====================
