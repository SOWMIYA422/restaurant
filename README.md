# Tamil Nadu Restaurant Discovery App

## Phase 1: MVP

This repository contains the Phase 1 implementation of a restaurant discovery application focused on Tamil Nadu, India.

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (Local or Cloud)
- Google Maps Platform API Key (Places API New, Maps JavaScript API)

### 1. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string.
   - Update `GOOGLE_PLACES_API_KEY` with your Google Cloud API key. (If you don't provide one, dummy data will be used for testing).
5. Run the server:
   ```bash
   fastapi dev app/main.py
   # Or using uvicorn directly: uvicorn app.main:app --reload
   ```
The backend will run on `http://localhost:8000`

### 2. Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
The frontend will typically run on `http://localhost:5173`. Open this URL in your browser.

## Features Implemented
- **Hierarchical Location Selection**: Tamil Nadu -> City -> Area
- **Restaurant Search**: Powered by Google Places API (Text Search New)
- **Detailed Restaurant View**: Shows photos, ratings, price levels, operating hours, and location.
- **Filtering**: By Rating, Price, and Cuisine (basic implementation).
- **Responsive Design**: Modern UI built with Tailwind CSS.






cd d:\Downloads\restaurant\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
fastapi dev app/main.py


cd d:\Downloads\restaurant\frontend
npm install
npm run dev
