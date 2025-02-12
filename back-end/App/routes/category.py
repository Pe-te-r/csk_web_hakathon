from flask import request,  Blueprint
from flask_restful import Api,Resource
from App.Model import  Category

category_bp = Blueprint('category_bp',__name__)

api = Api(category_bp)

class SingleCategory(Resource):
    def get(self,id):
        try:
            subcategory = request.args.get('subcategory')                
            category = Category.get_by_id(id)
            if not category:
                return 'category not found',404
            subcategory = True if subcategory =='true' else False
            return category.to_json(subcategory=subcategory), 200
        except Exception as e:
            return f'error occured {str(e)}' ,500
    
    def put(self,id):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            
            category = Category.get_by_id(id)
            if not category:
                return 'category not found',404
            
            data = request.get_json()
            if 'category' in  data:
                category.update(data['category'])
                return 'category updated',200
            
            return 'missing field',409

        except Exception as e:
            return f'error occured {str(e)}',500
    def delete(self,id):
        try:
            print('one')
            category = Category.get_by_id(id)
            print(category)
            if not category:
                return 'category not found',404
            
            if category.delete():
                return 'category deleted succesfull',200
            return 'category not deleted'
        except Exception as e:
            return f'error occured {str(e)}',500
            
class MultiCategory(Resource):
    def post(self):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            
            data = request.get_json()
            if 'category' not  in data:
                return 'missing field category',400
            category_exist = Category.get_category_by_name(data['category'])            
            if category_exist:
                return 'category already exist',409
            result = Category.add_category(data)
            if not result:
                return 'not saved',400
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