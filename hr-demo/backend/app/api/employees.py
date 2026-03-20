from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/", response_model=List[schemas.Employee])
def read_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    department_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    employees = crud.get_employees(db, skip=skip, limit=limit, department_id=department_id, is_active=is_active)
    return employees

@router.get("/{employee_id}", response_model=schemas.Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return db_employee

@router.post("/", response_model=schemas.Employee, status_code=201)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # здесь можно добавить проверку уникальности email
    return crud.create_employee(db, employee)

@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = crud.update_employee(db, employee_id, employee_update)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return db_employee

@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = crud.delete_employee(db, employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return None
    