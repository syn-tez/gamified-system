from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import UserDB, TaskDB, UserTaskDB
from pydantic import BaseModel
from database import get_db


class LoginRequest(BaseModel):
    username: str
    password: str

router = APIRouter(
    prefix="/user",
    tags=["Users & Tasks"]
)

@router.get("/{identifier}")
def get_user_profile(identifier: str, db: Session = Depends(get_db)):
    if identifier.isdigit():
        user = db.query(UserDB).filter(UserDB.id == int(identifier)).first()
    else:
        user = db.query(UserDB).filter(UserDB.username == identifier).first()
        
    if not user:
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    return user


@router.post("/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == data.username).first()

    if not user or user.password != data.password:
        raise HTTPException(status_code=400, detail="Неверное имя пользователя или пароль")
        
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