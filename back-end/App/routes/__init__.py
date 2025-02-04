def register_bp(app):
    from App.routes.users import users_bp

    app.register_blueprint(users_bp, url_prefix="/api")
