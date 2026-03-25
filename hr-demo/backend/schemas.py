from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# Department
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class Department(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Position
class PositionBase(BaseModel):
    title: str
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    department_id: int

class PositionCreate(PositionBase):
    pass

class Position(PositionBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Employee
class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    position_id: int
    department_id: int
    email: EmailStr
    phone: Optional[str] = None
    hire_date: date
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    position_id: Optional[int] = None
    department_id: Optional[int] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    is_active: Optional[bool] = None

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# User
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    employee_id: Optional[int] = None
    last_login: Optional[datetime] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Vacation
class VacationBase(BaseModel):
    employee_id: int
    start_date: date
    end_date: date
    type: str = "annual"
    comment: Optional[str] = None

class VacationCreate(VacationBase):
    pass

class VacationUpdate(BaseModel):
    status: Optional[str] = None
    comment: Optional[str] = None

class Vacation(VacationBase):
    id: int
    status: str
    created_at: datetime
    approved_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Vacancy
class VacancyBase(BaseModel):
    title: str
    department_id: int
    description: Optional[str] = None

class VacancyCreate(VacancyBase):
    pass

class Vacancy(VacancyBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Candidate
class CandidateBase(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    vacancy_id: int
    resume_url: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    status: Optional[str] = None

class Candidate(CandidateBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True