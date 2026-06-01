from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, PrimaryKeyConstraint
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


class TaskDB(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True)
    title = Column(String)
    exp_reward = Column(Integer)
    coin_reward = Column(Integer)


class UserTaskDB(Base):
    __tablename__ = "user_tasks"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    task_id = Column(String, ForeignKey("tasks.id"), primary_key=True)


def calculate_exp_and_level(current_exp: int, current_level: int, added_exp: int):
    total_exp = current_exp + added_exp
    new_level = current_level + (total_exp // 100)
    remainder_exp = total_exp % 100

    return remainder_exp, new_level


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

@app.get("/user/{user_id}")
def get_user_profile(user_id: int):
    db = SessionLocal()
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    db.close()

    if not user:
        raise HTTPException(status_code=404, detail="no fucking man ._.")
    return user

@app.get("/user/{user_id}/tasks")
def get_user_tasks(user_id: int):
    db = SessionLocal()
    all_tasks = db.query(TaskDB).all()
    comleted_task_ids = [ut.task_id for ut in db.query(UserTaskDB).filter(UserTaskDB.user_id == user_id).all()]
    db.close()

    result = []
    for task in all_tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "exp_reward": task.exp_reward,
            "coin_reward": task.coin_reward,
            "is_done": task.id in comleted_task_ids
        })
    return result

@app.post("/tasks/complete")
def complete_task(request: TaskCompleteRequest):
    db = SessionLocal()

    task = db.query(TaskDB).filter(TaskDB.id == request.task_id).first()
    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Задача не найдена в БД")

    alrerdy_done = db.query(UserTaskDB).filter(UserTaskDB.user_id == request.user_id, UserTaskDB.task_id == request.task_id).first()
    if alrerdy_done:
        db.close()
        raise HTTPException(status_code=400, detail="Задача уже выполнена")
    
    db_user = db.query(UserDB).filter(UserDB.id == request.user_id).first()
    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="Сотрудник не найден")

    old_level = db_user.level
    new_exp, new_level = calculate_exp_and_level(db_user.exp, db_user.level, task.exp_reward)
    
    db_user.exp = new_exp
    db_user.level = new_level
    db_user.coins += task.coin_reward

    new_log = UserTaskDB(user_id=request.user_id, task_id=request.task_id)
    db.add(new_log)
    
    leveled_up = db_user.level > old_level
        
    
    db.commit()

    if leveled_up:
        response_data = {"message": f"Задание выполнено! {db_user.username} повышает уровень до {db_user.level}. Получено +{task.coin_reward} коинов."}
    else:
        response_data = {"message": f"Задание выполнено! Получено +{task.exp_reward} XP и +{task.coin_reward} коинов."}
    
    # 2. Теперь, когда все данные из объектов вытянуты, безопасно закрываемся
    db.close()
    
    # 3. Возвращаем уже готовый словарь
    return response_data