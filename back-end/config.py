import os
from datetime import timedelta
# from dotenv import load_dotenv

# load_dotenv()


class Config:
    # SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key_here')
    SECRET_KEY = 'secret key is here'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///trial.db'
    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://localhost/mydb')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False
    ENV = 'production'
    LOGGING_LEVEL = 'INFO'
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    # MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    # MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    JWT_SECRET_KEY = 'here is my key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    CORS_ALLOW_ORIGINS = ['http://localhost:5173', 'https://myfrontend.com']
    # SESSION_TYPE = 'redis'
    # SESSION_PERMANENT = True

class Development(Config):
    DEBUG = True
    ENV = "development"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///trial.db'
    MAIL_USERNAME = "dev_email@example.com"
