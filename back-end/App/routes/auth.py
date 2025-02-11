from flask import Blueprint,request
from flask_restful import Api,Resource
# from flask_jwt_extended import create_access_token
from App import jwt
from App.Model import User,Auth


auth_bp = Blueprint('auth_bp',__name__)
api = Api(auth_bp)

class RegisterResource(Resource):
    def post(self):
        try:
            # json data
            if not request.is_json:
                return  "Content-type must be JSON", 400
            data = request.get_json()

            # verify fields
            required_fields = ["email", "first_name", "username", "password"]
            for field in required_fields:
                if field not in data:
                    return  f"missing field {field}", 400
            email = data["email"]

            if not isinstance(email, str) or "@" not in email:
                return"Invalid email format", 400

            if "phone_number" in data:
                phone_number = data.get("phone_number", "")
                if phone_number and not phone_number.isdigit():
                    return "Invalid phone number format", 400

            # user exist email or username
            exists, message = User.user_exists(data["username"], data["email"])
            if exists:
                return message, 409

            result = User.create_user(data)
            if not result:
                return "not saved", 400

            return 201
            # return {"message": "User created successfully"}, 201

        except Exception as e:
            return f"an error occured {str(e)}", 500        
    

class LoginResource(Resource):
    def post(self):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            data = request.get_json()
            required_fields = ['email','password']
            for field in required_fields:
                if field not in data:
                    return f'missing field {field}',400
            
            user = User.get_by_email(data['email'])
            if not user:
                return 'user not found',404
            if not user.active:
                return 'user blocked',403
            
            if not user.correct_password(data['password']):
                return 'wrong password',401
            
            # token = create_access_token(identity=user.email)
            token = jwt.create_access_token(user.email)
            
            return {'token':token,'id':str(user.id)},200

        except Exception as e:
            return  f"an error occured {str(e)}", 500        

class AuthResource(Resource):
    def get(self,id=None):
        try:
            if id is None:
                return ' here on auth'
            print('one')
            user_exists = User.get_user_by_id(id)
            if not user_exists:
                return 'user not found',404
            auth= Auth.get_by_user_id(id)
            if not auth:
                auth = Auth.create_auth(id)
            
            if not auth:
                return 'error occured',500
            
            code = auth.change_code()
            print(code)
            return code,200
            
                

        except Exception as e:
            return  f"an error occured {str(e)}", 500        


api.add_resource(AuthResource,'/auth', "/auth/<string:id>")
api.add_resource(RegisterResource,'/register')
api.add_resource(LoginResource,'/login')