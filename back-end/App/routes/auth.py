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
            print(data)
            required_fields = ['email','password']
            for field in required_fields:
                if field not in data:
                    return f'missing field {field}',400
            
            user = User.get_by_email(data['email'])
            print('one')
            if not user:
                return 'user not found',404
            print('one')
            if not user.active:
                return 'user blocked',403
            
            print('two')
            if not user.correct_password(data['password']):
                return 'wrong password',401
            print('five')
            token = jwt.create_access_token(user.email)
            
            print('three')
            return {'token':token,'id':str(user.id)},200

        except Exception as e:
            print(e)
            return  f"an error occured {str(e)}", 500        


class AuthResource(Resource):
    def post(self):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            data = request.get_json()
            required_fields = ["code", "id"]
            for field in required_fields:
                if field not in data:
                    return  f"Missing field {field}", 400

            user = User.get_user_by_id(data["id"])
            if not user:
                return "User not found", 404

            auth = Auth.get_by_user_id(data["id"])
            if not auth:
                return  "Authentication record not found", 404

            if auth.verify(data["code"]):
                return  "Code verified successfully", 200

            return  "Code verification failed", 401

        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500

    def get(self, id):
        try:
            user_exists = User.get_user_by_id(id)
            if not user_exists:
                return"User not found", 404

            auth = Auth.get_by_user_id(id)
            if not auth:
                auth = Auth.create_auth(id)

            if not auth:
                return  "An error occurred", 500

            code = auth.change_code()
            print(code)  # Consider logging instead of printing in production
            return "Code sent to email", 200

        except Exception as e:
            return  f"An error occurred: {str(e)}", 500


class TotpCode(Resource):
    def post(self):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            data = request.get_json()
      
            required_fields = ["code", "id"]
            for field in required_fields:
                if field not in data:
                    return f"Missing field {field}", 400

            user = User.get_user_by_id(data["id"])
            if not user:
                return "User not found", 404

            auth = Auth.get_by_user_id(data["id"])
            if not auth:
                return "Authentication record not found", 404
            if auth.verify_totp(data["code"]):
                return "2FA enabled", 200
            return "2FA not enabled try again", 401

        except Exception as e:
            return f"An error occurred: {str(e)}", 500

    def get(self,id):
        try:
            user = User.get_user_by_id(id)
            if not user:
                return 'user not found',404
            
            auth = Auth.get_by_user_id(id)
            if not auth:
                return  "Authentication record not found", 404

            code = auth.generate_secret()
            return code,200
        except Exception as e:
            return  f"An error occurred: {str(e)}", 500




api.add_resource(AuthResource, "/auth", "/auth/<string:id>")
api.add_resource(TotpCode,"/totp", "/totp/<string:id>")

api.add_resource(RegisterResource,'/register')
api.add_resource(LoginResource,'/login')