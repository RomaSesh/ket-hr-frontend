from sqlalchemy.orm import Session
from . import models, schemas

def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100, department_id: int = None, is_active: bool = None):
    query = db.query(models.Employee)
    if department_id:
        query = query.filter(models.Employee.department_id == department_id)
    if is_active is not None:
        query = query.filter(models.Employee.is_active == is_active)
    return query.offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def update_employee(db: Session, employee_id: int, employee_update: schemas.EmployeeUpdate):
    db_employee = get_employee(db, employee_id)
    if not db_employee:
        return None
    update_data = employee_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = get_employee(db, employee_id)
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False

def get_department(db: Session, dept_id: int):
    return db.query(models.Department).filter(models.Department.id == dept_id).first()

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, dept: schemas.DepartmentCreate):
    db_dept = models.Department(**dept.dict())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def update_department(db: Session, dept_id: int, dept_update: schemas.DepartmentUpdate):
    db_dept = get_department(db, dept_id)
    if not db_dept:
        return None
    update_data = dept_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_dept, key, value)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def delete_department(db: Session, dept_id: int):
    # проверяем, есть ли сотрудники в отделе
    count = db.query(models.Employee).filter(models.Employee.department_id == dept_id).count()
    if count > 0:
        return False
    db_dept = get_department(db, dept_id)
    if db_dept:
        db.delete(db_dept)
        db.commit()
        return True
    return False
    