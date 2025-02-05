def register_bp(app):
    from App.routes.users import users_bp
    from App.routes.auth import auth_bp
    from App.routes.products import products_bp

    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(products_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
