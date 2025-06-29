@echo off
echo 🚀 Activating virtualenv & starting FastAPI backend...
start cmd /k "cd backend && call ..\venv\Scripts\activate && uvicorn app.plagiarism_api:app --reload --host 127.0.0.1 --port 8080"

timeout /t 3 >nul

echo 🎨 Starting Next.js frontend...
start cmd /k "cd frontend && npm run dev"

echo ✅ All systems are go.
echo Press any key to exit...
pause >nul