from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from crud import get_vacancies, get_vacancy, create_vacancy, update_vacancy, close_vacancy, delete_vacancy
from schemas import Vacancy, VacancyCreate
from database import get_db
from api.auth import get_current_user
from models import User

router = APIRouter(prefix="/vacancies", tags=["vacancies"])

@router.get("/", response_model=List[Vacancy])
def read_vacancies(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_vacancies(db, skip=skip, limit=limit, status=status)

@router.get("/{vacancy_id}", response_model=Vacancy)
def read_vacancy(vacancy_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vac = get_vacancy(db, vacancy_id)
    if not db_vac:
        raise HTTPException(status_code=404, detail="Вакансия не найдена")
    return db_vac

@router.post("/", response_model=Vacancy, status_code=201)
def create_vacancy(vacancy: VacancyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_vacancy(db, vacancy)

@router.put("/{vacancy_id}", response_model=Vacancy)
def update_vacancy(vacancy_id: int, vacancy_update: VacancyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vac = update_vacancy(db, vacancy_id, vacancy_update)
    if not db_vac:
        raise HTTPException(status_code=404, detail="Вакансия не найдена")
    return db_vac

@router.put("/{vacancy_id}/close", response_model=Vacancy)
def close_vacancy(vacancy_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_vac = close_vacancy(db, vacancy_id)
    if not db_vac:
        raise HTTPException(status_code=404, detail="Вакансия не найдена")
    return db_vac

@router.delete("/{vacancy_id}", status_code=204)
def delete_vacancy(vacancy_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_vacancy(db, vacancy_id)
    if not success:
        raise HTTPException(status_code=404, detail="Вакансия не найдена")
    return None