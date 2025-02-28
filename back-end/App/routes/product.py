from flask import g, g, request,  Blueprint
from flask_restful import Api,Resource
from App.Model import Product,SubCategory,User
from App.helpers import get_img_url
from App import jwt


product_bp=Blueprint('product_bp',__name__)
api =Api(product_bp)

class MultiProduct(Resource):
    method_decorators = {'post':[jwt.jwt_required]}

    def post(self):
        try:
            product_name = request.form.get("productName")
            subcategory = request.form.get("subcategory")
            price = request.form.get("price")
            description = request.form.get("description")
            owner = request.form.get("owner")
            imageUrl = request.form.get("imageUrl")

            required_fields = [product_name, subcategory, price, description, owner]
            if not all(required_fields):
                return "Missing required product details", 409

            user = User.get_by_email(g.user)
            if not user:
                return 'user not found', 404

            image = request.files.get("image")

            if not image and not imageUrl:
                return "No image file or URL provided", 400

            if image and imageUrl:
                return "Provide either an image file or an image URL, not both", 400

            if image:
                img_url = get_img_url(image)[0]
            else:
                img_url = imageUrl

            subcategory_exists = SubCategory.get_by_name(subcategory)
            if not subcategory_exists:
                return 'subcategory not found', 404

            product_data = {
                "productName": product_name,
                "subcategory_id": subcategory_exists.id,
                "price": price,
                "description": description,
                "image": img_url,
                "owner": owner
            }

            print(product_data)
            result = Product.add_product(product_data)
            print(result)
            if not result:
                return "Product not saved", 409

            return "Product added successfully", 201

        except Exception as e:
            return f"Error occurred: {str(e)}", 500

    def get(self):
        try:
            products = Product.get_all()
            if not products:
                return 'no product found',404
            return [product.to_json() for product in products],200
        except Exception as e:
            return f'error occured {str(e)}',500


class SingleProduct(Resource):
    method_decorators = {'delete':[jwt.jwt_required]}
    def get(self,id):
        try:
            product = Product.get_by_id(id)
            if not product:
                return 'product not found',404
            return product.to_json(),200
        except Exception as e:
            return f'error occured {str(e)}',500
    def delete(self,id):
        try:
            product = Product.get_by_id(id)
            if not product:
                return 'product not found',404
            if product.owner != g.user:
                return 'you are not allowed to delete this product',403
            product.delete()
            return 'product deleted successfully',200
        except Exception as e:
            return f'error occured {str(e)}',500
api.add_resource(MultiProduct,'/product')
api.add_resource(SingleProduct,'/product/<string:id>')