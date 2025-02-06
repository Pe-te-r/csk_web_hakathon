from flask import request,  Blueprint
from flask_restful import Api,Resource
from App.Model import Product

product_bp=Blueprint('product_bp',__name__)
api =Api(product_bp)

class MultiProduct(Resource):
    def post(self):
        try:
            if not request.is_json:
                return "Content-type must be JSON", 400
            
            data= request.get_json()
            required_fields= ['subcategory_id','product','img_path','price','description']
            for field in  required_fields:
                if field not in data:
                    return f'missing field {field}',409
            
            result = Product.add_product(data)
            if not result:
                return 'not saved',409
            return 201
        except Exception as e:
            return f'error occured {str(e)}',500
    
    def get(self):
        try:
            products = Product.get_all()
            if not products:
                return 'no product found',404
            return [product.to_json() for product in products],200
        except Exception as e:
            return f'error occured {str(e)}',500


class SingleProduct(Resource):
    def get(self,id):
        try:
            product = Product.get_by_id(id)
            if not product:
                return 'product not found',404
            return product.to_json(),200
        except Exception as e:
            return f'error occured {str(e)}',500

api.add_resource(MultiProduct,'/product')
api.add_resource(SingleProduct,'/product/<string:id>')