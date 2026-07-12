# FastAPI + React Starter

A full-stack starter template using React (Vite + Tailwind CSS) for the frontend and Python FastAPI for the backend.

## Project Structure

```text
.
├── backend/      # FastAPI backend
└── frontend/     # React + Vite frontend
```

## Running the Project

### Backend
Open a terminal in the `backend` directory:
1. `python -m venv venv`
2. Activate venv (`venv\Scripts\activate` on Windows, `source venv/bin/activate` on Mac/Linux)
3. `pip install -r requirements.txt`
4. `uvicorn app.main:app --reload`

Backend API runs at: http://localhost:8000

### Frontend
Open another terminal in the `frontend` directory:
1. `npm install`
2. `npm run dev`

Frontend runs at: http://localhost:5173

Click the "Check Backend" button on the frontend to verify the connection between the React app and FastAPI backend.
