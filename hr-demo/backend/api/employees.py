from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from crud import (
    get_employees,
    get_employee,
    create_employee,
    update_employee,
    delete_employee
)
from schemas import Employee, EmployeeCreate, EmployeeUpdate
from database import get_db

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/", response_model=List[Employee])
def read_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    department_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    return get_employees(db, skip=skip, limit=limit, department_id=department_id, is_active=is_active)

@router.get("/{employee_id}", response_model=Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = get_employee(db, employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return db_employee

@router.post("/", response_model=Employee, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(db, employee)

@router.put("/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, employee_update: EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = update_employee(db, employee_id, employee_update)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return db_employee

@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = delete_employee(db, employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return None