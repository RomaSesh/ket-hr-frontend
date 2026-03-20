from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("/", response_model=List[schemas.Department])
def read_departments(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=100), db: Session = Depends(get_db)):
    return crud.get_departments(db, skip=skip, limit=limit)

@router.get("/{dept_id}", response_model=schemas.Department)
def read_department(dept_id: int, db: Session = Depends(get_db)):
    db_dept = crud.get_department(db, dept_id)
    if db_dept is None:
        raise HTTPException(status_code=404, detail="Отдел не найден")
    return db_dept

@router.post("/", response_model=schemas.Department, status_code=201)
def create_department(dept: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return crud.create_department(db, dept)

@router.put("/{dept_id}", response_model=schemas.Department)
def update_department(dept_id: int, dept_update: schemas.DepartmentUpdate, db: Session = Depends(get_db)):
    db_dept = crud.update_department(db, dept_id, dept_update)
    if db_dept is None:
        raise HTTPException(status_code=404, detail="Отдел не найден")
    return db_dept

@router.delete("/{dept_id}", status_code=204)
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    success = crud.delete_department(db, dept_id)
    if not success:
        raise HTTPException(status_code=400, detail="Нельзя удалить отдел с сотрудниками или отдел не найден")
    return None