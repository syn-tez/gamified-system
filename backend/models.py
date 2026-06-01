from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

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