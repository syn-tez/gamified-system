from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "postgresql://postgres:password@localhost:5432/degree_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    role = Column(String)
    level = Column(Integer, default=1)
    exp = Column(Integer, default=0)
    coins = Column(Integer, default=0)

TASKS_DB = {
    "task-1": {"id": "task-1", "title": "fix bag", "exp_reward": 30, "coin_reward": 15, "is_done": False},
    "task-2": {"id": "task-2", "title": "Написать юнит-тесты", "exp_reward": 40, "coin_reward": 20, "is_done": False},
    "task-3": {"id": "task-3", "title": "Развернуть проект на сервер (Деплой)", "exp_reward": 70, "coin_reward": 70, "is_done": False}
}

app = FastAPI(title="Gamification")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class TaskCompleteRequest(BaseModel):
    user_id: int
    task_id: str

def calculate_exp_and_level(current_exp: int, current_level: int, added_exp: int):
    total_exp = current_exp + added_exp
    new_level = current_level + (total_exp // 100)
    remainder_exp = total_exp % 100

    return remainder_exp, new_level


@app.get("/user/{user_id}")
def get_user_profile(user_id: int):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    db.close()

    if not user:
        raise HTTPException(status_code=404, detail="no fucking man ._.")
    return user

@app.get("/tasks")
def get_all_tasks():
    # Просто отдаем весь список задач фронтенду
    return list(TASKS_DB.values())

@app.post("/tasks/complete")
def complete_task(request: TaskCompleteRequest):
    if request.task_id not in TASKS_DB:
        raise HTTPException(status_code=404, detail="задача не найдена")
    
    task = TASKS_DB[request.task_id]

    if task["is_done"]:
        raise HTTPException(status_code=400, detail="Эта задача уже была выполнена ранее!")

    db = SessionLocal()
    db_user = db.query(UserDB).filter(UserDB.id == request.user_id).first()

    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="Сотрудник не найден")
    
    old_level = db_user.level  # Запоминаем старый лвл, чтобы проверить, был ли ап
    new_exp, new_level = calculate_exp_and_level(db_user.exp, db_user.level, task["exp_reward"])
    
    db_user.exp = new_exp
    db_user.level = new_level
    db_user.coins += task["coin_reward"]

    task["is_done"] = True
    
    leveled_up = db_user.level > old_level
        
    db.commit()
    db.refresh(db_user)
    db.close()
    
    if leveled_up:
        return {"message": f"Задание выполнено! {db_user.username} повышает уровень до {db_user.level} получено +{task['coin_reward']}"}
    return {"message": f"Получено +{task['exp_reward']} XP и +{task['coin_reward']}"}