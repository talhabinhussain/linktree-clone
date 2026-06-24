from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from app.database.user import get_session
from app.models.user_schema import User, UserData
from app.services.user_service import create_user


router = APIRouter()


@router.get("/")
def get_mesg():
    return {"message": "hello"}


@router.post("/create/user", response_model=User)
def add_user(user: UserData, session=Depends(get_session)):
    new_user = create_user(user, session)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED, content="user added successfully"
    )
