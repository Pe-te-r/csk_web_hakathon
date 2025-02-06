def register_bp(app):
    from App.routes.users import users_bp
    from App.routes.auth import auth_bp
    from App.routes.products import products_bp
    from App.routes.category import category_bp
    from App.routes.subcategory import subcategory_bp
    from App.routes.product import product_bp

    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(products_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(category_bp, url_prefix="/api")
    app.register_blueprint(subcategory_bp, url_prefix="/api")
    app.register_blueprint(product_bp, url_prefix="/api")
