from flask import request, Blueprint
from flask_restful import Api,Resource
from App.Model import Order

orders_bp=Blueprint('orders_bp',__name__)
api=Api()

class OrdersMuti(Resource):
    def get(self):
        try:
            orders = Order.getAll()
            if not orders:
                return 'no order found',404
            
            return [order.to_json()for order in orders]
        except Exception as e:
            return f"Error occurred: {str(e)}", 500
    
    def post(self):
        try:
            if not request.is_json:
                return  "Content-type must be JSON", 400
            data = request.get_json()

            # verify fields
            required_fields = ["user_id", "products"]
            for field in required_fields:
                if field not in data:
                    return  f"missing field {field}", 400 
            
            if not isinstance(data['products'], list) or len(data['products']) == 0:
                return  "Products mustfor be a non-empty list", 400
            
            for product in data['products']:
                if 'product_id' not in product or 'quantity' not in product:
                    return  "Each product must have 'product_id' and 'quantity'", 400
            
            result= Order.add_order(data)

            if not result:
                return 'order not saved',400
            
            return 'order saved',200


                                         
        except Exception as e:
            return f"Error occurred: {str(e)}", 500
    
api.add_resource(OrdersMuti,'/orders')