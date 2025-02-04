from flask import Blueprint
from flask_restful import Api,Resource

users_bp = Blueprint('users_bp',__name__)
api =Api(users_bp)

class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            return {"message": f"User {user_id} details retrieved successfully"}
        return {"message": "List of all users"}

    def post(self):
        return {"message": "New user created successfully"}, 201

    def put(self, user_id):
        return {"message": f"User {user_id} updated successfully"}

    def delete(self, user_id):
        return {"message": f"User {user_id} deleted successfully"}


api.add_resource(UserResource,'/users','/users/<string:user_id>')