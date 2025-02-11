from flask import request, Blueprint
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
                    return'user is disabled',403
                

                return  user.to_json(owner=True),200
            return "user id not provided",400
            
        except Exception as e:
            return f'an error occured {str(e)}',500





    def put(self, user_id):
        try:
            user_exists = User.get_user_by_id(user_id)
            if not user_exists:
                return "User not found", 404

            edited = False

            # Check if the request is JSON
            if request.content_type == "application/json":
                data = request.get_json()
            else:  # Assume it's FormData (multipart/form-data)
                data = request.form
            
            print('one')
            # Handle common fields (text data)
            if "isActive" in data:
                if not user_exists.update_user({"active": data["isActive"] == "true"}):
                    return 'action cannot be completed, try again later',500
                edited = True
            print('two')

            if "username" in data:
                if not user_exists.update_user({"username": data["username"]}):
                    return 'error the username',500
                edited = True
            print('three')

            if "first_name" in data:
                if not user_exists.update_user({"first_name": data["first_name"]}):
                    return 'error the firstname',500
                edited = True
            print('four')
            print(request.files)

            if "img_path" in request.files:
                print('here one')
                file = request.files["img_path"]
                print('here two')
                img_path=get_img_url(file)
                print('five')
                print(img_path)
                print('six')
                if not user_exists.save_profile_photo(img_path):
                    return 'error the profile',500
                edited = True
            print('seven')

            if edited:
                return "User updated successfully", 200

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
            if not users:
                return'no user found',404
            
            return [user.to_json() for user in users],200
        except Exception as e:
            return f'error occured {str(e)}',500


api.add_resource(UsersResource,'/users')
api.add_resource(UserResource,'/users/<string:user_id>')