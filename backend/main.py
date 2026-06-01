from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, tasks

app = FastAPI(title="Gamification System")

# Настройка CORS для работы с React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Подключаем роутеры в основное приложение
app.include_router(users.router)
app.include_router(tasks.router)