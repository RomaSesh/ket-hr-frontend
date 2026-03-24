from database import SessionLocal
from models import Department, Position, User
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
positions = [
    {"title": "HR-менеджер", "department_id": db.query(Department).filter(Department.name == "Отдел кадров").first().id},
    {"title": "Бухгалтер", "department_id": db.query(Department).filter(Department.name == "Бухгалтерия").first().id},
    {"title": "Разработчик", "department_id": db.query(Department).filter(Department.name == "IT").first().id},
    {"title": "Маркетолог", "department_id": db.query(Department).filter(Department.name == "Маркетинг").first().id},
    {"title": "Менеджер по продажам", "department_id": db.query(Department).filter(Department.name == "Продажи").first().id},
]
for pos in positions:
    if not db.query(Position).filter(Position.title == pos["title"]).first():
        db.add(Position(**pos))

# Пользователь admin
admin = db.query(User).filter(User.username == "admin").first()
if not admin:
    hashed = get_password_hash("admin123")
    db.add(User(username="admin", email="admin@hr.ru", password_hash=hashed, role="admin"))

db.commit()
db.close()
print("Seed data added successfully!")