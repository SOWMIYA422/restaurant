from pydantic import BaseModel
from typing import List, Optional

class LocationBase(BaseModel):
    name: str
    type: str
    parent_id: Optional[int] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True
