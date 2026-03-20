from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Text, TIMESTAMP, func
from sqlalchemy.orm import relationship
from .database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    employees = relationship("Employee", back_populates="department")
    positions = relationship("Position", back_populates="department")


class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    salary_min = Column(Numeric(10,2))
    salary_max = Column(Numeric(10,2))
    department_id = Column(Integer, ForeignKey("departments.id"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    department = relationship("Department", back_populates="positions")
    employees = relationship("Employee", back_populates="position")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    middle_name = Column(String(50))
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    hire_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    position = relationship("Position", back_populates="employees")
    department = relationship("Department", back_populates="employees")
    user = relationship("User", back_populates="employee", uselist=False)
    history = relationship("EmployeeHistory", back_populates="employee")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(20), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    last_login = Column(DateTime)
    created_at = Column(TIMESTAMP, server_default=func.now())

    employee = relationship("Employee", back_populates="user")


class EmployeeHistory(Base):
    __tablename__ = "employee_history"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    action = Column(String(50), nullable=False)
    field_name = Column(String(50))
    old_value = Column(Text)
    new_value = Column(Text)
    changed_by = Column(Integer, ForeignKey("users.id"))
    changed_at = Column(TIMESTAMP, server_default=func.now())

    employee = relationship("Employee", back_populates="history")
    changer = relationship("User", foreign_keys=[changed_by])
    