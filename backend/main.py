from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.database import Base, engine, SessionLocal
from backend.models import Task
from backend.quick_add import parse_quick_add
app = FastAPI(title="TaskFlow API")

# Create database tables
Base.metadata.create_all(bind=engine)


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    project_id: int 
    



@app.get("/")
def home():
    return {"message": "TaskFlow API is running"}


# GET all tasks
@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return tasks


# GET task by ID
@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    db.close()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


# POST - create task
@app.post("/tasks")
def create_task(task_data: TaskCreate):
    db = SessionLocal()

    task = Task(
        title=task_data.title,
        description=task_data.description,
        project_id=task_data.project_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    db.close()

    return task


# DELETE task by ID
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    db.close()

    return {"message": "Task deleted successfully"}
class QuickAddRequest(BaseModel):
    text: str


@app.post("/tasks/quick-add")
def quick_add_task(request: QuickAddRequest):

    parsed_task = parse_quick_add(request.text)

    if not parsed_task["title"]:
        raise HTTPException(
            status_code=400,
            detail="Task text cannot be empty"
        )

    return parsed_task

