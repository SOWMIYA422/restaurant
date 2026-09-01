from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import locations, restaurants
from app.database import engine, Base

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tamil Nadu Restaurant Discovery API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(locations.router, prefix="/api/locations", tags=["locations"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["restaurants"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Tamil Nadu Restaurant Discovery API"}
