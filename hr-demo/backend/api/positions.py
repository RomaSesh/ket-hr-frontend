from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from crud import (
    get_positions as crud_get_positions,
    get_position as crud_get_position,
    create_position as crud_create_position,
    update_position as crud_update_position,
    delete_position as crud_delete_position
)
from schemas import Position, PositionCreate
from database import get_db

router = APIRouter(prefix="/positions", tags=["positions"])

@router.get("/", response_model=List[Position])
def read_positions(db: Session = Depends(get_db)):
    return crud_get_positions(db)

@router.get("/{pos_id}", response_model=Position)
def read_position(pos_id: int, db: Session = Depends(get_db)):
    db_pos = crud_get_position(db, pos_id)
    if not db_pos:
        raise HTTPException(status_code=404, detail="Должность не найдена")
    return db_pos

@router.post("/", response_model=Position, status_code=201)
def create_position(position: PositionCreate, db: Session = Depends(get_db)):
    return crud_create_position(db, position)

@router.put("/{pos_id}", response_model=Position)
def update_position(pos_id: int, position_update: PositionCreate, db: Session = Depends(get_db)):
    db_pos = crud_update_position(db, pos_id, position_update)
    if not db_pos:
        raise HTTPException(status_code=404, detail="Должность не найдена")
    return db_pos

@router.delete("/{pos_id}", status_code=204)
def delete_position(pos_id: int, db: Session = Depends(get_db)):
    success = crud_delete_position(db, pos_id)
    if not success:
        raise HTTPException(status_code=400, detail="Нельзя удалить должность, закреплённую за сотрудниками")
    return None