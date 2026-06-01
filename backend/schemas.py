from pydantic import BaseModel

class TaskCompleteRequest(BaseModel):
    user_id: int
    task_id: str