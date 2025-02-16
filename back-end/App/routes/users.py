from flask import g, request, Blueprint
from flask_restful import Api,Resource
from App.Model import User
from App import jwt
from App.helpers import get_img_url

users_bp = Blueprint('users_bp',__name__)
api =Api(users_bp)

class UserResource(Resource):
    method_decorators=[jwt.jwt_required]
    def get(self, user_id=None):
        try:
            if user_id:
                user = User.get_user_by_id(user_id)
                if not user:
                    return  'user not found',404
                
                if not user.is_active():
                    return 'disabled',403
                
                if  user.get_role != 'admin' and user.email != g.user:
                    return 'not authorized'
                
                include_orders = request.args.get("orders", "false").lower() == "true"


                return  user.to_json(orders=include_orders,owner=True),200
            return "user id not provided",400
            
        except Exception as e:
            return f'an error occured {str(e)}',500





    def put(self, user_id):
        try:
            user_exists = User.get_user_by_id(user_id)
            if not user_exists:
                return "User not found", 404
            
            if not user_exists.is_active():
                return 'disabled',403
            
            if user_exists.email != g.user and user_exists.get_role != 'admin':
                return 'not authorized'


            edited = False
            if request.content_type == "application/json":
                data = request.get_json()
            else: 
                data = request.form
            
            if "isActive" in data:
                print(data)
                print(data['isActive'])
                if not user_exists.update_user({"active": data["isActive"] }):
                    return 'action cannot be completed, try again later',500
                edited = True

            if "username" in data:
                if not user_exists.update_user({"username": data["username"]}):
                    return 'error the username',500
                edited = True

            if "first_name" in data:
                if not user_exists.update_user({"first_name": data["first_name"]}):
                    return 'error the firstname',500
                edited = True
            
            if 'password' in data:
                if not user_exists.password.change_password(data['password']):
                    return 'error on the password',500
                edited = True
            
            if 'role' in data:
                if not user_exists.update_user({'role':data['role']}):
                    return 'error on role update',500
                edited = True

            if "img_path" in request.files:
                file = request.files["img_path"]
                img_path=get_img_url(file)
                if not user_exists.save_profile_photo(img_path):
                    return 'error the profile',500
                edited = True

            if edited:
                return "User updated successfully", 200

            print('thre')
            return "No data to update", 200

        except Exception as e:
            return f"Error occurred: {str(e)}", 500


    def delete(self, user_id):
        return f"User {user_id} deleted successfully"



class UsersResource(Resource):
    method_decorators=[jwt.jwt_required]
    def get(self):
        try:
            users = User.all_users()
            user_request = User.get_by_email(g.user)
            if not user_request:
                return 'this admin not found',404
            if user_request.get_role != 'admin':
                return 'not allowed'
            if not users:
                return'no user found',404
            
            return [user.to_json() for user in users],200
        except Exception as e:
            return f'error occured {str(e)}',500


api.add_resource(UsersResource,'/users')
api.add_resource(UserResource,'/users/<string:user_id>')