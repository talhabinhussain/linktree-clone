from sqlmodel import Session
from app.models.user_schema import User


def insert_user(user: User, session: Session):

    session.add(user)
    session.commit()
    session.refresh(user)
    return user
