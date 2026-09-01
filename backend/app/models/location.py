from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False) # 'state', 'city', 'area'
    parent_id = Column(Integer, ForeignKey("locations.id"), nullable=True)

    parent = relationship("Location", remote_side=[id], backref="children")
