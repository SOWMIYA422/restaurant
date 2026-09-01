import os
import httpx
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

class GooglePlacesService:
    BASE_URL = "https://places.googleapis.com/v1/places"

    async def search_restaurants(self, text_query: str) -> List[dict]:
        if not GOOGLE_API_KEY or GOOGLE_API_KEY == "your_google_api_key_here":
            # Return dummy data if no API key is provided so UI can be developed
            return self._get_dummy_restaurants()
            
        url = f"{self.BASE_URL}:searchText"
        
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.priceLevel,places.primaryType,places.types,places.formattedAddress,places.photos,places.location,places.currentOpeningHours"
        }
        
        data = {
            "textQuery": f"restaurants in {text_query}",
            "includedType": "restaurant",
            "languageCode": "en"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            if response.status_code == 200:
                result = response.json()
                return self._parse_places(result.get("places", []))
            else:
                print(f"Error fetching from Google Places: {response.text}")
                return []

    async def get_restaurant_details(self, place_id: str) -> Optional[dict]:
        if not GOOGLE_API_KEY or GOOGLE_API_KEY == "your_google_api_key_here":
            return self._get_dummy_restaurant_details(place_id)
            
        url = f"{self.BASE_URL}/{place_id}"
        
        headers = {
            "X-Goog-Api-Key": GOOGLE_API_KEY,
            "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,priceLevel,types,formattedAddress,photos,location,nationalPhoneNumber,websiteUri,regularOpeningHours,googleMapsUri"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                return self._parse_place_details(response.json())
            else:
                print(f"Error fetching details from Google Places: {response.text}")
                return None

    def _parse_places(self, places: List[dict]) -> List[dict]:
        parsed = []
        for place in places:
            photo_ref = ""
            if "photos" in place and len(place["photos"]) > 0:
                # The New Places API returns photos differently. 
                # name field in photo object is something like places/{placeId}/photos/{photo_reference}
                photo_ref = place["photos"][0].get("name", "")
                
            parsed.append({
                "place_id": place.get("id"),
                "name": place.get("displayName", {}).get("text", "Unknown"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("userRatingCount"),
                "price_level": place.get("priceLevel"), # Returns PRICE_LEVEL_INEXPENSIVE, etc. Or maybe int? Let's check docs, it usually returns string in new API but let's map it.
                "types": place.get("types", []),
                "formatted_address": place.get("formattedAddress"),
                "photo_reference": photo_ref,
                "location": place.get("location"), # lat, lng
                "open_now": place.get("currentOpeningHours", {}).get("openNow")
            })
        return parsed

    def _parse_place_details(self, place: dict) -> dict:
        photo_ref = ""
        if "photos" in place and len(place["photos"]) > 0:
            photo_ref = place["photos"][0].get("name", "")
            
        return {
            "place_id": place.get("id"),
            "name": place.get("displayName", {}).get("text", "Unknown"),
            "rating": place.get("rating"),
            "user_ratings_total": place.get("userRatingCount"),
            "price_level": place.get("priceLevel"),
            "types": place.get("types", []),
            "formatted_address": place.get("formattedAddress"),
            "photo_reference": photo_ref,
            "location": place.get("location"),
            "formatted_phone_number": place.get("nationalPhoneNumber"),
            "website": place.get("websiteUri"),
            "opening_hours": place.get("regularOpeningHours", {}).get("weekdayDescriptions", []),
            "url": place.get("googleMapsUri")
        }
        
    def _get_dummy_restaurants(self):
        return [
            {
                "place_id": "dummy_1",
                "name": "Buhari Hotel",
                "rating": 4.2,
                "user_ratings_total": 1205,
                "price_level": "PRICE_LEVEL_MODERATE",
                "types": ["indian_restaurant", "restaurant", "food"],
                "formatted_address": "Mount Road, Chennai",
                "photo_reference": "",
                "location": {"lat": 13.0617, "lng": 80.2646},
                "open_now": True
            },
            {
                "place_id": "dummy_2",
                "name": "A2B - Adyar Ananda Bhavan",
                "rating": 4.0,
                "user_ratings_total": 850,
                "price_level": "PRICE_LEVEL_INEXPENSIVE",
                "types": ["vegetarian_restaurant", "south_indian_restaurant", "restaurant"],
                "formatted_address": "Adyar, Chennai",
                "photo_reference": "",
                "location": {"lat": 13.0039, "lng": 80.2559},
                "open_now": True
            },
            {
                "place_id": "dummy_3",
                "name": "Zaitoon",
                "rating": 4.5,
                "user_ratings_total": 3200,
                "price_level": "PRICE_LEVEL_MODERATE",
                "types": ["arabian_restaurant", "restaurant", "food"],
                "formatted_address": "Velachery, Chennai",
                "photo_reference": "",
                "location": {"lat": 12.9781, "lng": 80.2212},
                "open_now": True
            },
            {
                "place_id": "dummy_4",
                "name": "Murugan Idli Shop",
                "rating": 4.3,
                "user_ratings_total": 4100,
                "price_level": "PRICE_LEVEL_INEXPENSIVE",
                "types": ["south_indian_restaurant", "vegetarian_restaurant", "restaurant"],
                "formatted_address": "T. Nagar, Chennai",
                "photo_reference": "",
                "location": {"lat": 13.0393, "lng": 80.2335},
                "open_now": False
            },
            {
                "place_id": "dummy_5",
                "name": "Ponnusamy Hotel",
                "rating": 4.1,
                "user_ratings_total": 1500,
                "price_level": "PRICE_LEVEL_EXPENSIVE",
                "types": ["indian_restaurant", "restaurant", "food"],
                "formatted_address": "Royapettah, Chennai",
                "photo_reference": "",
                "location": {"lat": 13.0565, "lng": 80.2655},
                "open_now": True
            },
            {
                "place_id": "dummy_6",
                "name": "Sangeetha Veg Restaurant",
                "rating": 4.4,
                "user_ratings_total": 2900,
                "price_level": "PRICE_LEVEL_INEXPENSIVE",
                "types": ["vegetarian_restaurant", "south_indian_restaurant", "restaurant"],
                "formatted_address": "Anna Nagar, Chennai",
                "photo_reference": "",
                "location": {"lat": 13.0850, "lng": 80.2101},
                "open_now": True
            },
            {
                "place_id": "dummy_7",
                "name": "Coal Barbecues",
                "rating": 4.6,
                "user_ratings_total": 5200,
                "price_level": "PRICE_LEVEL_EXPENSIVE",
                "types": ["barbecue_restaurant", "restaurant", "food"],
                "formatted_address": "T. Nagar, Chennai",
                "photo_reference": "",
                "location": {"lat": 13.0400, "lng": 80.2350},
                "open_now": True
            },
            {
                "place_id": "dummy_8",
                "name": "Ambur Star Briyani",
                "rating": 4.2,
                "user_ratings_total": 1800,
                "price_level": "PRICE_LEVEL_MODERATE",
                "types": ["indian_restaurant", "restaurant", "food"],
                "formatted_address": "Sholinganallur, Chennai",
                "photo_reference": "",
                "location": {"lat": 12.8996, "lng": 80.2269},
                "open_now": True
            }
        ]
        
    def _get_dummy_restaurant_details(self, place_id):
        dummies = self._get_dummy_restaurants()
        for d in dummies:
            if d["place_id"] == place_id:
                d["formatted_phone_number"] = "+91 44 1234 5678"
                d["website"] = "https://example.com"
                d["opening_hours"] = ["Monday: 7:00 AM – 11:00 PM", "Tuesday: 7:00 AM – 11:00 PM"]
                d["url"] = "https://maps.google.com/?cid=123"
                return d
        return None

google_places_service = GooglePlacesService()
