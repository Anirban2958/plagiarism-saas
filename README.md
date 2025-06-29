# Plagiarism SaaS

A modern SaaS platform for real-time plagiarism detection using FastAPI, Pinecone, and Next.js.

---

## 🚀 Features
- **Live plagiarism checking** against Wikipedia, Project Gutenberg, and NewsAPI sources
- **Embeddings & similarity search** with Sentence Transformers and Pinecone
- **Beautiful, user-friendly frontend** built with Next.js and Tailwind CSS
- **API-first design** for easy integration
- **Dockerized** for simple deployment

---

## 🗂️ Project Structure

- `backend/`   — FastAPI backend (plagiarism detection API)
- `frontend/`  — Next.js frontend (user interface)
- `deployments/` — Docker Compose setup
- `database/`  — (Optional) Database config/data
- `run.bat`    — Batch file to start backend and frontend easily (Windows)

---

## ⚡ Quick Start

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/plagiarism-saas.git
   cd plagiarism-saas
   ```
2. **Install dependencies:**
   - Backend:
     ```sh
     cd backend
     python -m venv venv
     venv\Scripts\activate  # On Windows
     pip install -r requirements.txt
     ```
   - Frontend:
     ```sh
     cd ../frontend
     npm install
     ```
3. **Run the app (Windows, recommended):**
   - Use the provided `run.bat` file in the project root:
     ```sh
     ./run.bat
     ```
   This will start both the backend and frontend automatically.

4. **Manual run (if not using run.bat):**
   - Backend:
     ```sh
     cd backend
     venv\Scripts\activate  # On Windows
     uvicorn app.plagiarism_api:app --host 0.0.0.0 --port 8000
     ```
   - Frontend (in a new terminal):
     ```sh
     cd frontend
     npm run dev
     ```

5. **Access the app:**
   - API: [http://localhost:8000](http://localhost:8000)
   - Frontend: [http://localhost:3000](http://localhost:3000)

---

## 🔒 Keeping Your Keys & Secrets Safe

- **Never commit API keys, secrets, or passwords to your code or GitHub!**
- Store all sensitive information in `.env` files (e.g., `backend/.env`, `frontend/.env`).
- The `.gitignore` file is set up to prevent `.env` files from being tracked by git.
- If you have already committed secrets, **revoke them and generate new ones** immediately.
- For extra safety, review your repo’s commit history and remove any secrets if needed.

---

## 📂 Important Note About Dependencies

- The `node_modules` folder (for the frontend) and Python virtual environments are NOT stored in the repository. This is standard practice for all modern projects.
- After cloning the repository, you **must** run the following commands to install dependencies:

  **For the frontend:**
  ```sh
  cd frontend
  npm install
  ```
  This will create the `node_modules` folder automatically.

  **For the backend (if using a virtual environment):**
  ```sh
  cd backend
  python -m venv venv
  venv\Scripts\activate  # On Windows
  source venv/bin/activate  # On Mac/Linux
  pip install -r requirements.txt
  ```

- All required dependencies are listed in `package.json`/`package-lock.json` (frontend) and `requirements.txt` (backend). Make sure these files are committed and up to date.

---

## 📝 API Usage

- **POST** `/api/check-plagiarism`
  - Request: `{ "text": "Your text to check..." }`
  - Response: `{ "full_text": ..., "fragment_matches": [...] }`

---

## 🛠️ Requirements

### Backend (FastAPI)
- Python 3.11+
- fastapi
- uvicorn
- sentence-transformers
- pinecone-client
- nltk
- wikipedia
- requests
- python-dotenv

### Frontend (Next.js)
- Node.js 18+
- next
- react
- tailwindcss
- autoprefixer
- stylelint

---

## 📦 Example `requirements.txt` (Backend)
```
fastapi
uvicorn
sentence-transformers
pinecone-client
nltk
wikipedia
requests
python-dotenv
```

---

## 📦 Example `package.json` dependencies (Frontend)
```json
{
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0"
  },
  "devDependencies": {
    "stylelint": "^15.0.0",
    "stylelint-config-standard": "^34.0.0",
    "stylelint-config-tailwindcss": "^0.0.7"
  }
}
```

---

## 📚 License

MIT License. Feel free to use, modify, and contribute!

---

## ✨ Credits
- Built with [FastAPI](https://fastapi.tiangolo.com/), [Next.js](https://nextjs.org/), [Pinecone](https://www.pinecone.io/), and [Tailwind CSS](https://tailwindcss.com/).
