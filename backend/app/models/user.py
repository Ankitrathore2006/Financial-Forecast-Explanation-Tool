from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    
    class Config:
        populate_by_name = True

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class User(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    full_name: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None

class SearchHistory(BaseModel):
    user_email: str
    stock_name: str
    prediction: str
    confidence: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
