from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.services.google_places import google_places_service

router = APIRouter()

@router.get("/", summary="Search restaurants by area")
async def get_restaurants(area: str = Query(..., description="The area or city to search for restaurants")):
    try:
        restaurants = await google_places_service.search_restaurants(area)
        return restaurants
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{place_id}", summary="Get restaurant details")
async def get_restaurant_details(place_id: str):
    try:
        details = await google_places_service.get_restaurant_details(place_id)
        if not details:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
