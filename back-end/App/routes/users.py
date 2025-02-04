from flask import Blueprint
from flask_restful import Api,Resource
from App.Model import User

users_bp = Blueprint('users_bp',__name__)
api =Api(users_bp)

class UserResource(Resource):
    def get(self, user_id=None):
        try:
            if user_id:
                user = User.get_user_by_id(id)
                if not user:
                    return {'message':' user not found'},404
                
                if not user.is_active():
                    return {'message':'user is disabled'},403
                

                return {"message": user.to_json()},200
            return {"message": "user id not provided"},400
            
        except Exception as e:
            return {'error':f'an error occured {str(e)}'},500


    def put(self, user_id):
        return {"message": f"User {user_id} updated successfully"}

    def delete(self, user_id):
        return {"message": f"User {user_id} deleted successfully"}



class UsersResource(Resource):
    def get(self):
        return {'message':'List of users'}



api.add_resource(UsersResource,'/users')
api.add_resource(UserResource,'/users/<string:user_id>')