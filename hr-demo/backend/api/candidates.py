from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from crud import get_candidates, get_candidate, create_candidate, update_candidate_status, delete_candidate
from schemas import Candidate, CandidateCreate, CandidateUpdate
from database import get_db
from api.auth import get_current_user
from models import User

router = APIRouter(prefix="/candidates", tags=["candidates"])

@router.get("/", response_model=List[Candidate])
def read_candidates(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    vacancy_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_candidates(db, skip=skip, limit=limit, vacancy_id=vacancy_id, status=status)

@router.get("/{candidate_id}", response_model=Candidate)
def read_candidate(candidate_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_cand = get_candidate(db, candidate_id)
    if not db_cand:
        raise HTTPException(status_code=404, detail="Кандидат не найден")
    return db_cand

@router.post("/", response_model=Candidate, status_code=201)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_candidate(db, candidate)

@router.put("/{candidate_id}/status", response_model=Candidate)
def update_candidate(candidate_id: int, update: CandidateUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_cand = update_candidate_status(db, candidate_id, update.status)
    if not db_cand:
        raise HTTPException(status_code=404, detail="Кандидат не найден")
    return db_cand

@router.delete("/{candidate_id}", status_code=204)
def delete_candidate(candidate_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    success = delete_candidate(db, candidate_id)
    if not success:
        raise HTTPException(status_code=404, detail="Кандидат не найден")
    return None