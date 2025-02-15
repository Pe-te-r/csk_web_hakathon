import jwt
from functools import wraps
from flask import request, abort,g
from datetime import timedelta,datetime

class ExpiredTokenError(Exception):
    pass
class InvalidTokenError(Exception):
    pass

class JWTManager:
    def __init__(self, app=None):
        # self.secret_key = "your_jwt_secret_key"
        self.algorithms = "HS256" 
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.secret_key = app.config.get("JWT_SECRET_KEY", "default_secret_key")
        self.expiration_time = app.config.get("JWT_ACCESS_TOKEN_EXPIRES", timedelta(minutes=15))  # Default: 15 minutes

    def create_access_token(self, identity, expires_delta=None):
        if expires_delta is None:
            expires_delta = self.expiration_time
        
        exp = datetime.utcnow() + expires_delta
        payload = {
            "identity": identity,
            "iat": datetime.utcnow(),  
            "exp": exp  
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithms)
    def decode_access_token( self,token):
        try:
            decoded_token = jwt.decode(token, self.secret_key, algorithms=[self.algorithms])
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise ExpiredTokenError("Expired token.")
        except jwt.InvalidTokenError:
            raise InvalidTokenError("Invalid token.")

    def jwt_required(self,func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            token = self.get_token_from_request()
            if not token:
                abort(401, description="Missing token.")

            try:
                decoded_token = self.decode_access_token(token)
                g.user = decoded_token.get("identity")
            except ExpiredTokenError as e:
                abort(401, description=str(e))
            except InvalidTokenError as e:
                abort(403, description=str(e))
            except Exception :
                abort(500, description="An internal error occurred.")

            return func(*args, **kwargs)

        return wrapper

    def get_token_from_request(self):
        auth_header = request.headers.get("Authorization", None)
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == "bearer":
                return parts[1]
        return None
