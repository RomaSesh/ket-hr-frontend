from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from api import employees, departments, auth, positions, vacations, vacancies, candidates, reports
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Management API", description="API для управления сотрудниками", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(departments.router)
app.include_router(auth.router)
app.include_router(positions.router)
app.include_router(vacations.router)
app.include_router(vacancies.router)
app.include_router(candidates.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"message": "HR API is running"}
