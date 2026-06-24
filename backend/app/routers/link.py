# backend/app/routers/links.py
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session, select
from app.database.user import get_session
from app.models.user_schema import LinkCreate, Profile, Link

router = APIRouter(prefix="/links", tags=["links"])


def _verify_token(profile: Profile, token: str):
    if profile.edit_token != token:
        raise HTTPException(403, "Invalid edit token")


@router.post("/{username}")
def add_link(
    username: str,
    link: LinkCreate,
    x_edit_token: str = Header(...),
    session: Session = Depends(get_session),
):
    profile = session.exec(select(Profile).where(Profile.username == username)).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    _verify_token(profile, x_edit_token)

    link_data = Link(**link.model_dump())

    link_data.profile_id = profile.id

    session.add(link_data)
    session.commit()
    session.refresh(link_data)
    return link_data


@router.put("/{link_id}")
def update_link(
    link_id: int,
    updated: LinkCreate,
    x_edit_token: str = Header(...),
    session: Session = Depends(get_session),
):
    link = session.get(Link, link_id)
    if not link:
        raise HTTPException(404, "Link not found")
    profile = session.get(Profile, link.profile_id)
    _verify_token(profile, x_edit_token)

    link_update = updated.model_dump(exclude_unset=True)

    for key, value in link_update.items():
        setattr(link, key, value)

    # link.label = updated.label
    # link.url = updated.url
    # link.icon = updated.icon
    # link.position = updated.position

    session.add(link)
    session.commit()
    session.refresh(link)
    return link


@router.delete("/{link_id}")
def delete_link(
    link_id: int,
    x_edit_token: str = Header(...),
    session: Session = Depends(get_session),
):
    link = session.get(Link, link_id)
    if not link:
        raise HTTPException(404, "Link not found")
    profile = session.get(Profile, link.profile_id)
    _verify_token(profile, x_edit_token)

    session.delete(link)
    session.commit()
    return {"ok": True}
