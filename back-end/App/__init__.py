from flask import Flask

def create_app():
    app=Flask(__name__)

    from App.routes import register_bp
    register_bp(app)
    return app