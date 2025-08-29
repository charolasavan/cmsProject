# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
# import pymysql

# DB_URL = "mysql+pymysql://root:root@localhost:3306/ProductApplication"


# engine = create_engine(DB_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()



from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Recommended: use environment variable for security
# Example: mysql+pymysql://user:password@host:port/dbname
DB_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:root@localhost:3306/ProductApplication")

# Create SQLAlchemy engine
engine = create_engine(DB_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()
