from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session, select
from app.database.user import get_session
from app.models.user_schema import Profile, ProfileCreate, ProfileUpdate, Link
import uuid
from .auth import verify_edit_token

router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("")
def create_profile(data: ProfileCreate, session: Session = Depends(get_session)):
    existing = session.exec(
        select(Profile).where(Profile.username == data.username)
    ).first()
    if existing:
        raise HTTPException(400, "Username already taken")

    profile = Profile(**data.model_dump())

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile  # includes edit_token — frontend saves this once


@router.get("/{username}")
def get_public_profile(username: str, session: Session = Depends(get_session)):
    profile = session.exec(select(Profile).where(Profile.username == username)).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    links = session.exec(
        select(Link).where(Link.profile_id == profile.id).order_by(Link.position)
    ).all()
    return {
        "id": profile.id,
        "username": profile.username,
        "display_name": profile.display_name,
        "bio": profile.bio,
        "avatar": profile.avatar,
        "theme_color": profile.theme_color,
        "background_color": profile.background_color,
        "links": links,
    }


@router.put("/{username}")
def update_profile(
    username: str,
    updated: ProfileUpdate,
    edit_token: uuid.UUID = Depends(verify_edit_token),
    session: Session = Depends(get_session),
):
    profile = session.exec(select(Profile).where(Profile.username == username)).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    if str(profile.edit_token) != str(edit_token):
        raise HTTPException(403, "Invalid edit token")

    # profile.display_name = updated.display_name
    # profile.bio = updated.bio
    # profile.avatar = updated.avatar
    # profile.theme_color = updated.theme_color
    # profile.background_color = updated.background_color

    user_data = updated.model_dump(exclude_unset=True)

    for key, value in user_data.items():
        setattr(profile, key, value)

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile
