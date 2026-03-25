from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db
from models import Employee, Vacation, Department
from .auth import get_current_user   # относительный импорт
from models import User
from sqlalchemy import func

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/headcount")
def headcount_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    departments = db.query(Department).all()
    result = []
    for dept in departments:
        count = db.query(Employee).filter(Employee.department_id == dept.id, Employee.is_active == True).count()
        result.append({"department": dept.name, "count": count})
    total = db.query(Employee).filter(Employee.is_active == True).count()
    return {"total": total, "by_department": result}

@router.get("/vacation_stats")
def vacation_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    end = datetime.utcnow()
    start = end - timedelta(days=365)
    stats = db.query(
        func.strftime('%Y-%m', Vacation.created_at).label('month'),
        func.count(Vacation.id).label('count')
    ).filter(Vacation.created_at >= start).group_by('month').all()
    return {"data": [{"month": s.month, "count": s.count} for s in stats]}

@router.get("/turnover")
def turnover_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_employees = db.query(Employee).count()
    fired = db.query(Employee).filter(Employee.is_active == False).count()
    turnover_rate = (fired / total_employees * 100) if total_employees > 0 else 0
    return {"total_employees": total_employees, "fired": fired, "turnover_rate": round(turnover_rate, 2)}