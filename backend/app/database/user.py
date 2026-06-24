from sqlmodel import Session, create_engine
from dotenv import load_dotenv
import os

load_dotenv(override=True)

db_url = os.getenv("DATABASE_URL")


engine = create_engine(db_url, echo=True)


def get_session():
    with Session(engine) as session:
        yield session
