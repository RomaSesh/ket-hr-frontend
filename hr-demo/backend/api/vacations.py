from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from crud import get_vacations, get_vacation, create_vacation, update_vacation_status, delete_vacation
from schemas import Vacation, VacationCreate
from database import get_db
from .auth import get_current_user
from models import User

router = APIRouter(prefix="/vacations", tags=["vacations"])

@router.get("", response_model=List[Vacation])
def read_vacations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    employee_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_vacations(db, skip=skip, limit=limit, employee_id=employee_id, status=status)

@router.get("/{vacation_id}", response_model=Vacation)
def read_vacation(vacation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vac = get_vacation(db, vacation_id)
    if not db_vac:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return db_vac

@router.post("", response_model=Vacation, status_code=201)
def create_vacation(vacation: VacationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_vacation(db, vacation)

@router.put("/{vacation_id}/approve", response_model=Vacation)
def approve_vacation(vacation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vac = update_vacation_status(db, vacation_id, "approved", current_user.id)
    if not db_vac:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return db_vac

@router.put("/{vacation_id}/reject", response_model=Vacation)
def reject_vacation(vacation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vac = update_vacation_status(db, vacation_id, "rejected", current_user.id)
    if not db_vac:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return db_vac

@router.delete("/{vacation_id}", status_code=204)
def delete_vacation(vacation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_vacation(db, vacation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Заявка не найдена")
    return None