from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlmodel import Session, select
from typing import Optional
import uuid
from app.database.user import get_session
from app.models.user_schema import Profile

router = APIRouter(prefix="/api/auth", tags=["auth"])


def verify_edit_token(
    x_edit_token: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None)
) -> uuid.UUID:
    token_str = None
    if x_edit_token:
        token_str = x_edit_token
    elif authorization:
        if authorization.lower().startswith("bearer "):
            token_str = authorization[7:].strip()
        else:
            token_str = authorization.strip()
            
    if not token_str:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: edit_token is missing from headers"
        )
    try:
        return uuid.UUID(token_str)
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: Invalid edit_token format (must be a valid UUID)"
        )


@router.get("/verify")
def verify_session(
    token: Optional[str] = Query(None),
    x_edit_token: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    # Try query parameter first, then custom header, then Authorization header
    token_str = token
    if not token_str:
        if x_edit_token:
            token_str = x_edit_token
        elif authorization:
            if authorization.lower().startswith("bearer "):
                token_str = authorization[7:].strip()
            else:
                token_str = authorization.strip()

    if not token_str:
        raise HTTPException(status_code=401, detail="Edit token is required")

    try:
        uuid_token = uuid.UUID(token_str)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token format")

    from sqlalchemy import text
    profile = session.exec(
        select(Profile).where(text("edit_token = :token")).params(token=str(uuid_token))
    ).first()

    if not profile:
        raise HTTPException(status_code=401, detail="Invalid edit token")

    return {"username": profile.username}
