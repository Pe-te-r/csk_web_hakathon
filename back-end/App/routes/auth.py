from flask import Blueprint,request
from flask_restful import Api,Resource
from App.Model import User


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
            
            return user.to_json(),200

        except Exception as e:
            return  f"an error occured {str(e)}", 500        

api.add_resource(RegisterResource,'/register')
api.add_resource(LoginResource,'/login')