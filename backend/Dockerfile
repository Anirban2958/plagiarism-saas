# =====================
# Backend Dockerfile for FastAPI Plagiarism Checker
# =====================

# 1. Use a slim Python 3.11 base image
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the application code into the container
COPY ./app ./app

# 5. Start the FastAPI app using Uvicorn
#    - app.plagiarism_api:app means 'app' package, 'plagiarism_api.py', 'app' instance
CMD ["uvicorn", "app.plagiarism_api:app", "--host", "0.0.0.0", "--port", "8000"]
