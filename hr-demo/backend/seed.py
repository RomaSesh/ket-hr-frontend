from database import SessionLocal
from models import Department, Position, User, Employee
from datetime import datetime
import hashlib

def get_password_hash(password):
    return hashlib.sha256(password.encode()).hexdigest()

db = SessionLocal()

# Отделы
departments = ["Отдел кадров", "Бухгалтерия", "IT", "Маркетинг", "Продажи"]
for name in departments:
    if not db.query(Department).filter(Department.name == name).first():
        db.add(Department(name=name, description=f"Описание {name}"))
db.commit()

# Должности
positions_data = [
    {"title": "HR-менеджер", "department_name": "Отдел кадров"},
    {"title": "Бухгалтер", "department_name": "Бухгалтерия"},
    {"title": "Разработчик", "department_name": "IT"},
    {"title": "Маркетолог", "department_name": "Маркетинг"},
    {"title": "Менеджер по продажам", "department_name": "Продажи"},
]
for pos in positions_data:
    dept = db.query(Department).filter(Department.name == pos["department_name"]).first()
    if dept and not db.query(Position).filter(Position.title == pos["title"]).first():
        db.add(Position(title=pos["title"], department_id=dept.id))
db.commit()

# Пользователь admin
admin = db.query(User).filter(User.username == "admin").first()
if not admin:
    hashed = get_password_hash("admin123")
    admin = User(username="admin", email="admin@hr.ru", password_hash=hashed, role="admin")
    db.add(admin)
    db.commit()

# Тестовый сотрудник
test_employee = db.query(Employee).filter(Employee.email == "i.ivanov@ket.edu.ru").first()
if not test_employee:
    dept_it = db.query(Department).filter(Department.name == "IT").first()
    pos_dev = db.query(Position).filter(Position.title == "Разработчик").first()
    if dept_it and pos_dev:
        test_emp = Employee(
            first_name="Иван",
            last_name="Иванов",
            middle_name="Иванович",
            position_id=pos_dev.id,
            department_id=dept_it.id,
            email="i.ivanov@ket.edu.ru",
            phone="+7 (910) 345-67-89",
            hire_date=datetime(2023, 9, 1),
            is_active=True,
            birth_date=datetime(1985, 5, 15),
            education="Высшее, КГУ им. Некрасова",
            specialty="Информатика и ВТ",
            experience="8 лет",
            address="г. Кострома, ул. Ленина, д. 1, кв. 1",
            personnel_number="Т-0421"
        )
        db.add(test_emp)
        db.commit()

db.close()
print("Seed data added successfully!")