from fastapi import HTTPException, status
from sqlmodel import Session
from app.models.user_schema import User, UserData
from app.repository.user_repo import insert_user


def create_user(user: UserData, session: Session):
    try:
        user_data = User(**user.model_dump())
        user_data = insert_user(user_data, session)

    except Exception as exp:
        HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"failed to create a user {exp}",
        )
