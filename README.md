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

---

## ⚡ Quick Start

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/plagiarism-saas.git
   cd plagiarism-saas
   ```
2. **Build and start all services:**
   ```sh
   cd deployments
   docker-compose up --build
   ```
3. **Access the app:**
   - API: [http://localhost:8000](http://localhost:8000)
   - Frontend: [http://localhost:3000](http://localhost:3000)

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
