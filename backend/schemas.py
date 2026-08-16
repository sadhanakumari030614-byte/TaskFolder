
class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    owner_id: int


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_id: int

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    status: str = "todo"
    due_date: Optional[str] = None
    project_id: int

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value):
        if value not in ["low", "medium", "high"]:
            raise ValueError(
                "Priority must be low, medium, or high"
            )
        return value


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    due_date: Optional[str] = None
    project_id: int

    class Config:
        from_attributes = True