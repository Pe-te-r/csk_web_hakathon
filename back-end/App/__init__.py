from flask import Flask
from flask_migrate import Migrate
from App.Model import db
from config import Config

migrate=Migrate()
def create_app(config_class=Config): 
    app=Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app,db)
    
    from App.routes import register_bp
    register_bp(app)
    
    return app