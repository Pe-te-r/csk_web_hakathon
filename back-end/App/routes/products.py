from flask import Blueprint,request
from flask_restful import Resource, Api

products_bp = Blueprint('products_bp',__name__)
api = Api(products_bp)

class SingleProductResource(Resource):
    def get(self,id):
        return {'message':f'product id: {id} retuned'}
    
    def put(self,id):
        return {'message':f'product id: {id} updated'}
    
    def delete(self,id):
        return {'message':f'product id: {id} deleted'}

class MultipleProductResource(Resource):
    def post(self):
        if not request.is_json:
            return {"message": "Content-type must be JSON"}, 400
        
        data = request.get_json()

        return {'message':data}


api.add_resource(MultipleProductResource,'/products')
api.add_resource(SingleProductResource,'/product/<string:id>')