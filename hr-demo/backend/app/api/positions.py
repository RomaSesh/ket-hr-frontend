from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/positions", tags=["positions"])

@router.get("/", response_model=List[schemas.Position])
def read_positions(db: Session = Depends(get_db)):
    return db.query(models.Position).all()
    