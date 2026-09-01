from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.location import Location as LocationModel
from app.schemas.location import Location

router = APIRouter()

@router.get("/cities", response_model=List[Location])
def get_cities(db: Session = Depends(get_db)):
    cities = db.query(LocationModel).filter(LocationModel.type == "city").all()
    # Fallback to static data if DB is empty for initial testing
    if not cities:
        return [
            {"id": 1, "name": "Chennai", "type": "city", "parent_id": None},
            {"id": 2, "name": "Coimbatore", "type": "city", "parent_id": None},
            {"id": 3, "name": "Madurai", "type": "city", "parent_id": None},
        ]
    return cities

@router.get("/areas", response_model=List[Location])
def get_areas(city_id: Optional[int] = None, city_name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(LocationModel).filter(LocationModel.type == "area")
    
    if city_id:
        query = query.filter(LocationModel.parent_id == city_id)
    elif city_name:
        city = db.query(LocationModel).filter(LocationModel.name.ilike(city_name), LocationModel.type == "city").first()
        if city:
            query = query.filter(LocationModel.parent_id == city.id)
        else:
            # Fallback static areas if DB is empty
            if city_name.lower() == "chennai":
                return [
                    {"id": 101, "name": "Sholinganallur", "type": "area", "parent_id": 1},
                    {"id": 102, "name": "Velachery", "type": "area", "parent_id": 1},
                    {"id": 103, "name": "Adyar", "type": "area", "parent_id": 1},
                ]
            return []
            
    areas = query.all()
    if not areas and not (city_id or city_name):
         return [
            {"id": 101, "name": "Sholinganallur", "type": "area", "parent_id": 1},
            {"id": 102, "name": "Velachery", "type": "area", "parent_id": 1},
            {"id": 103, "name": "Adyar", "type": "area", "parent_id": 1},
         ]
    return areas
