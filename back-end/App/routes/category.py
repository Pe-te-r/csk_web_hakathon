from flask import request,  Blueprint
from flask_restful import Api,Resource
from App.Model import  Category

category_bp = Blueprint('category_bp',__name__)

api = Api(category_bp)

class SingleCategory(Resource):
    def get(self,id):
        category = Category.get_by_id(id)
        if not category:
            return 'category not found',404
        

class MultiCategory(Resource):
    def post(self):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            
            data = request.get_json()
            print(data)

            if 'category' not  in data:
                return 'missing field category',400
            category_exist = Category.get_category_by_name(data['category'])            
            print(category_exist)
            if category_exist:
                return 'category already exist',409
            result = Category.add_category(data)
            if not result:
                return 'not saved',400
            print('three')
            return 201
        except Exception as e:
            return f"an error occured {str(e)}", 500

    def get(self):
        try:
            categories = Category.get_all()
            if not categories:
                return 'no category found',404
            return [category.to_json() for category in categories],200
        except Exception as e:
            return f'an error occured {str(e)}',500
    
api.add_resource(MultiCategory,'/category')
api.add_resource(SingleCategory,'/category/<string:id>')