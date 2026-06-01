from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import UserDB, TaskDB, UserTaskDB
from schemas import TaskCompleteRequest
from utils import calculate_exp_and_level

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks Operations"]
)

@router.post("/complete")
def complete_task(request: TaskCompleteRequest, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == request.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена в БД")

    already_done = db.query(UserTaskDB).filter(
        UserTaskDB.user_id == request.user_id, 
        UserTaskDB.task_id == request.task_id
    ).first()
    if already_done:
        raise HTTPException(status_code=400, detail="Задача уже выполнена")
    
    db_user = db.query(UserDB).filter(UserDB.id == request.user_id).first()
    if not db_user:
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
        return {"message": f"Задание выполнено! {db_user.username} повышает уровень до {db_user.level}! Получено +{task.coin_reward} коинов."}
    return {"message": f"Задание выполнено! Получено +{task.exp_reward} XP и +{task.coin_reward} коинов."}