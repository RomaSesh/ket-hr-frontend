from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
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

# -------- Vacations --------
def get_vacations(db: Session, skip: int = 0, limit: int = 100, employee_id: Optional[int] = None, status: Optional[str] = None):
    query = db.query(models.Vacation)
    if employee_id:
        query = query.filter(models.Vacation.employee_id == employee_id)
    if status:
        query = query.filter(models.Vacation.status == status)
    return query.offset(skip).limit(limit).all()

def get_vacation(db: Session, vacation_id: int):
    return db.get(models.Vacation, vacation_id)

def create_vacation(db: Session, vacation: schemas.VacationCreate):
    db_vac = models.Vacation(**vacation.dict())
    db.add(db_vac)
    db.commit()
    db.refresh(db_vac)
    return db_vac

def update_vacation_status(db: Session, vacation_id: int, status: str, user_id: int):
    db_vac = db.get(models.Vacation, vacation_id)
    if not db_vac:
        return None
    db_vac.status = status
    db_vac.approved_by = user_id
    db_vac.approved_at = datetime.utcnow()
    db.commit()
    db.refresh(db_vac)
    return db_vac

def delete_vacation(db: Session, vacation_id: int):
    db_vac = db.get(models.Vacation, vacation_id)
    if not db_vac:
        return False
    db.delete(db_vac)
    db.commit()
    return True

# -------- Vacancies --------
def get_vacancies(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    query = db.query(models.Vacancy)
    if status:
        query = query.filter(models.Vacancy.status == status)
    return query.offset(skip).limit(limit).all()

def get_vacancy(db: Session, vacancy_id: int):
    return db.get(models.Vacancy, vacancy_id)

def create_vacancy(db: Session, vacancy: schemas.VacancyCreate):
    db_vac = models.Vacancy(**vacancy.dict())
    db.add(db_vac)
    db.commit()
    db.refresh(db_vac)
    return db_vac

def update_vacancy(db: Session, vacancy_id: int, vacancy_update: schemas.VacancyCreate):
    db_vac = db.get(models.Vacancy, vacancy_id)
    if not db_vac:
        return None
    for key, value in vacancy_update.dict(exclude_unset=True).items():
        setattr(db_vac, key, value)
    db.commit()
    db.refresh(db_vac)
    return db_vac

def close_vacancy(db: Session, vacancy_id: int):
    db_vac = db.get(models.Vacancy, vacancy_id)
    if not db_vac:
        return None
    db_vac.status = "closed"
    db.commit()
    db.refresh(db_vac)
    return db_vac

def delete_vacancy(db: Session, vacancy_id: int):
    vac = db.get(models.Vacancy, vacancy_id)
    if not vac:
        return False
    db.delete(vac)
    db.commit()
    return True

# -------- Candidates --------
def get_candidates(db: Session, skip: int = 0, limit: int = 100, vacancy_id: Optional[int] = None, status: Optional[str] = None):
    query = db.query(models.Candidate)
    if vacancy_id:
        query = query.filter(models.Candidate.vacancy_id == vacancy_id)
    if status:
        query = query.filter(models.Candidate.status == status)
    return query.offset(skip).limit(limit).all()

def get_candidate(db: Session, candidate_id: int):
    return db.get(models.Candidate, candidate_id)

def create_candidate(db: Session, candidate: schemas.CandidateCreate):
    db_cand = models.Candidate(**candidate.dict())
    db.add(db_cand)
    db.commit()
    db.refresh(db_cand)
    return db_cand

def update_candidate_status(db: Session, candidate_id: int, status: str):
    db_cand = db.get(models.Candidate, candidate_id)
    if not db_cand:
        return None
    db_cand.status = status
    db.commit()
    db.refresh(db_cand)
    return db_cand

def delete_candidate(db: Session, candidate_id: int):
    cand = db.get(models.Candidate, candidate_id)
    if not cand:
        return False
    db.delete(cand)
    db.commit()
    return True
