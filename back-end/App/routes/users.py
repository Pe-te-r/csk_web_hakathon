from flask import request, Blueprint
from flask_restful import Api,Resource
from App.Model import User
from App import jwt

users_bp = Blueprint('users_bp',__name__)
api =Api(users_bp)

class UserResource(Resource):
    method_decorators=[jwt.jwt_required]
    def get(self, user_id=None):
        try:
            if user_id:
                user = User.get_user_by_id(user_id)
                print(user)
                if not user:
                    return {'message':' user not found'},404
                
                if not user.is_active():
                    return {'message':'user is disabled'},403
                

                return {"message": user.to_json()},200
            return {"message": "user id not provided"},400
            
        except Exception as e:
            return {'error':f'an error occured {str(e)}'},500

    def put(self, user_id):
        try:
            user_exists = User.get_user_by_id(user_id)
            if  not user_exists:
                return 'user not found',404
            
            data = request.get_json()

            edited=False
            if "isActive" in data:
                user_exists.update_user({"active": data["isActive"]})
                edited=True
            print('two')
            if 'username' in data:
                user_exists.update_user({'username':data['username']})
                edited=True
        
            if 'first_name' in data:
                user_exists.update_user({'first_name':data['first_name']})
                edited=True
            
            if edited:           
                return  "User  updated successfully",200
            
            return "no data to update",200
            
        except Exception as e:
            return f'error occured {str(e)}',500
    def delete(self, user_id):
        return f"User {user_id} deleted successfully"



class UsersResource(Resource):
    method_decorators=[jwt.jwt_required]
    def get(self):
        try:
            users = User.all_users()
            print(users)
            if not users:
                return {'message':'no user found'},404
            
            return [user.to_json() for user in users],200
        except Exception as e:
            print(e)
            return f'error occured {str(e)}',500


api.add_resource(UsersResource,'/users')
api.add_resource(UserResource,'/users/<string:user_id>')