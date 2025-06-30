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

# 3.5 # Add this line to download NLTK stopwords during build
RUN python -m nltk.downloader punkt stopwords wordnet averaged_perceptron_tagger


# 4. Copy the application code into the container
COPY ./app ./app

# 5. Start the FastAPI app using Uvicorn
CMD ["uvicorn", "app.plagiarism_api:app", "--host", "0.0.0.0", "--port", "8080"]
# 6. Expose the port on which the FastAPI app is running
EXPOSE 8080 