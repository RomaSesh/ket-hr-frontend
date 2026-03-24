from sqlalchemy.orm import Session
from typing import Optional, List
import models
import schemas

# -------- Departments --------
def get_departments(db: Session, skip: int = 0, limit: int = 100) -> List[models.Department]:
    return db.query(models.Department).offset(skip).limit(limit).all()

def get_department(db: Session, dept_id: int) -> Optional[models.Department]:
    return db.get(models.Department, dept_id)

def create_department(db: Session, dept: schemas.DepartmentCreate) -> models.Department:
    db_dept = models.Department(**dept.dict())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def update_department(db: Session, dept_id: int, dept_update: schemas.DepartmentUpdate) -> Optional[models.Department]:
    db_dept = db.get(models.Department, dept_id)
    if not db_dept:
        return None
    for key, value in dept_update.dict(exclude_unset=True).items():
        setattr(db_dept, key, value)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def delete_department(db: Session, dept_id: int) -> bool:
    dept = db.get(models.Department, dept_id)
    if not dept or dept.employees:
        return False
    db.delete(dept)
    db.commit()
    return True

# -------- Positions --------
def get_positions(db: Session) -> List[models.Position]:
    return db.query(models.Position).all()

def get_position(db: Session, pos_id: int) -> Optional[models.Position]:
    return db.get(models.Position, pos_id)

def create_position(db: Session, position: schemas.PositionCreate) -> models.Position:
    db_pos = models.Position(**position.dict())
    db.add(db_pos)
    db.commit()
    db.refresh(db_pos)
    return db_pos

def update_position(db: Session, pos_id: int, position_update: schemas.PositionCreate) -> Optional[models.Position]:
    db_pos = db.get(models.Position, pos_id)
    if not db_pos:
        return None
    for key, value in position_update.dict(exclude_unset=True).items():
        setattr(db_pos, key, value)
    db.commit()
    db.refresh(db_pos)
    return db_pos

def delete_position(db: Session, pos_id: int) -> bool:
    pos = db.get(models.Position, pos_id)
    if not pos or pos.employees:
        return False
    db.delete(pos)
    db.commit()
    return True

# -------- Employees --------
def get_employees(db: Session, skip: int = 0, limit: int = 100, department_id: Optional[int] = None, is_active: Optional[bool] = None) -> List[models.Employee]:
    query = db.query(models.Employee)
    if department_id is not None:
        query = query.filter(models.Employee.department_id == department_id)
    if is_active is not None:
        query = query.filter(models.Employee.is_active == is_active)
    return query.offset(skip).limit(limit).all()

def get_employee(db: Session, employee_id: int) -> Optional[models.Employee]:
    return db.get(models.Employee, employee_id)

def create_employee(db: Session, employee: schemas.EmployeeCreate) -> models.Employee:
    db_emp = models.Employee(**employee.dict())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def update_employee(db: Session, employee_id: int, employee_update: schemas.EmployeeUpdate) -> Optional[models.Employee]:
    db_emp = db.get(models.Employee, employee_id)
    if not db_emp:
        return None
    for key, value in employee_update.dict(exclude_unset=True).items():
        setattr(db_emp, key, value)
    db.commit()
    db.refresh(db_emp)
    return db_emp

def delete_employee(db: Session, employee_id: int) -> bool:
    emp = db.get(models.Employee, employee_id)
    if not emp:
        return False
    db.delete(emp)
    db.commit()
    return True