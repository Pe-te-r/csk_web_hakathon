from flask import request,  Blueprint
from flask_restful import Resource, Api
from App.Model import SubCategory,Category

subcategory_bp = Blueprint('subcategory_bp',__name__)
api =Api(subcategory_bp)

class SingleSubCategory(Resource):
    def get(self,id):
        try:

            subcategory = SubCategory.get_by_id(id)
            if not subcategory:
                return 'subcategory not found',404
        except Exception as e:
            return f'erro occured {str(e)}'

class MultiSubCategory(Resource):
    def post(self):
        try:
            if not request.is_json:
                return  "Content-type must be JSON", 400
            data = request.get_json()

            required_fields = ["category_id", "subcategory"]
            for field in required_fields:
                if field not in data:
                    return f'field {field} is missing',409
            print('one')
            category_exists =Category.get_by_id(data['category_id'])
            print('two')
            if not category_exists:
                return ' category does not exist',404
            
            print('three')
            result = SubCategory.add_subcategory(data)
            print('four')
            if not result:
                return 'not saved',409
            
            return 201
        except Exception as e:
            return f'error occured {str(e)}',500

    def get(self):
        try:
            include_orders = request.args.get("orders", "false").lower() == "true"
            subcategories=SubCategory.get_all(category_name=include_orders)
            if not subcategories:
                return 'no subcategory found',404

            return [subcategory.to_json() for subcategory in subcategories] ,200
        except Exception as e:
            return f'error occured {str(e)}',500
api.add_resource(MultiSubCategory,'/subcategory')
api.add_resource(SingleSubCategory,'/subcategory/<string:id>')