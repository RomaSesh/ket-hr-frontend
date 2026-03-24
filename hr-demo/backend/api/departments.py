from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from crud import (
    get_departments as crud_get_departments,
    get_department as crud_get_department,
    create_department as crud_create_department,
    update_department as crud_update_department,
    delete_department as crud_delete_department
)
from schemas import Department, DepartmentCreate, DepartmentUpdate
from database import get_db

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("/", response_model=List[Department])
def read_departments(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=100), db: Session = Depends(get_db)):
    return crud_get_departments(db, skip=skip, limit=limit)

@router.get("/{dept_id}", response_model=Department)
def read_department(dept_id: int, db: Session = Depends(get_db)):
    db_dept = crud_get_department(db, dept_id)
    if not db_dept:
        raise HTTPException(status_code=404, detail="Отдел не найден")
    return db_dept

@router.post("/", response_model=Department, status_code=201)
def create_department(dept: DepartmentCreate, db: Session = Depends(get_db)):
    return crud_create_department(db, dept)

@router.put("/{dept_id}", response_model=Department)
def update_department(dept_id: int, dept_update: DepartmentUpdate, db: Session = Depends(get_db)):
    db_dept = crud_update_department(db, dept_id, dept_update)
    if not db_dept:
        raise HTTPException(status_code=404, detail="Отдел не найден")
    return db_dept

@router.delete("/{dept_id}", status_code=204)
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    success = crud_delete_department(db, dept_id)
    if not success:
        raise HTTPException(status_code=400, detail="Нельзя удалить отдел с сотрудниками или отдел не найден")
    return None