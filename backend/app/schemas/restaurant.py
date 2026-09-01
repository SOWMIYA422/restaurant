from pydantic import BaseModel
from typing import List, Optional

class RestaurantLocation(BaseModel):
    lat: float
    lng: float

class Restaurant(BaseModel):
    place_id: str
    name: str
    rating: Optional[float] = None
    user_ratings_total: Optional[int] = None
    price_level: Optional[int] = None
    types: List[str] = []
    formatted_address: Optional[str] = None
    photo_reference: Optional[str] = None
    location: Optional[RestaurantLocation] = None
    open_now: Optional[bool] = None

class RestaurantDetails(Restaurant):
    formatted_phone_number: Optional[str] = None
    website: Optional[str] = None
    opening_hours: Optional[List[str]] = None
    url: Optional[str] = None # Google Maps URL
