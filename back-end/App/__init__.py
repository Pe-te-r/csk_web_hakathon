from flask import Flask
from App.helpers import  JWTManager

from flask_cors import CORS
from flask_migrate import Migrate
from App.Model import db
from config import Config


jwt = JWTManager()
def create_app(config_class=Config): 
    app=Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    Migrate(app,db)
    CORS(app, supports_credentials=True)    
    jwt.init_app(app)

    from App.routes import register_bp
    register_bp(app)
    
    return app