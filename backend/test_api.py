import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_google_places():
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    print(f"Using API Key: {api_key[:10]}...")
    
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.rating"
    }
    data = {
        "textQuery": "restaurants in Chennai",
        "includedType": "restaurant",
        "languageCode": "en"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    asyncio.run(test_google_places())
