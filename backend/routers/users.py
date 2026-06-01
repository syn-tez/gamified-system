from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import UserDB, TaskDB, UserTaskDB
from database import get_db

router = APIRouter(
    prefix="/user",
    tags=["Users & Tasks"]
)

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return user

@router.get("/{user_id}/tasks")
def get_user_tasks(user_id: int, db: Session = Depends(get_db)):
    all_tasks = db.query(TaskDB).all()
    completed_task_ids = [
        ut.task_id for ut in db.query(UserTaskDB).filter(UserTaskDB.user_id == user_id).all()
    ]

    result = []
    for task in all_tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "exp_reward": task.exp_reward,
            "coin_reward": task.coin_reward,
            "is_done": task.id in completed_task_ids
        })
    return result