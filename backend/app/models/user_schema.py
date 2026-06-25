import uuid
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(
        unique=True, index=True
    )  # used in the public URL: /u/{username}
    display_name: str = "My Links"
    bio: Optional[str] = None
    avatar: Optional[str] = None  # emoji or image URL
    theme_color: str = "#000000"
    background_color: str = "#ffffff"
    edit_token: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        unique=True,
        index=True,
    )

    links: List["Link"] = Relationship(back_populates="profile")


class ProfileCreate(SQLModel):
    username: str
    display_name: str = "My Links"
    bio: Optional[str] = None
    avatar: Optional[str] = None
    theme_color: str = "#000000"
    background_color: str = "#ffffff"


class ProfileUpdate(SQLModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    theme_color: Optional[str] = None
    background_color: Optional[str] = None


class Link(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str
    url: str
    icon: Optional[str] = None
    position: int = 0  # controls display order
    profile_id: int = Field(foreign_key="profile.id")

    profile: Optional[Profile] = Relationship(back_populates="links")


class LinkCreate(SQLModel):
    label: str
    url: str
    icon: Optional[str] = None
    position: int = 0  # controls display order
