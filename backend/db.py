from sqlalchemy import Column, String, Integer, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    task_id = Column(String, primary_key=True, index=True)
    session_token = Column(String, index=True)
    task_type = Column(String)
    duration_minutes = Column(Integer)
    required_skills = Column(String)
    priority = Column(Integer)
    start_datetime = Column(DateTime)
    end_datetime = Column(DateTime)

# SQLite URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./backend/tasks.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)