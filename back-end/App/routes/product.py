import requests
from flask import request,  Blueprint
from flask_restful import Api,Resource
from App.Model import Product,SubCategory


product_bp=Blueprint('product_bp',__name__)
api =Api(product_bp)

# Replace with your actual ImgBB API key
IMGDB_API_KEY = "76fd07e743624b8d8f03033d234f8f88"
IMGDB_UPLOAD_URL = f"https://api.imgbb.com/1/upload?key={IMGDB_API_KEY}"

class MultiProduct(Resource):
    def post(self):
        try:
            if "image" not in request.files:
                return "No image file provided", 400

            product_name = request.form.get("productName")
            subcategory = request.form.get("subcategory")
            price = request.form.get("price")
            description = request.form.get("description")

            required_fields = [product_name, subcategory, price, description]
            if not all(required_fields):
                return "Missing required product details", 409

            image = request.files["image"]
            files = {"image": (image.filename, image.stream, image.mimetype)}

            response = requests.post(IMGDB_UPLOAD_URL, files=files)

            if response.status_code != 200:
                return "Image upload failed", 500
            
            img_url = response.json()["data"]["url"]  

            subcategory_exists = SubCategory.get_by_name(subcategory)
            if not subcategory_exists:
                return 'subcategory not found',404

            product_data = {
                "productName": product_name,
                "subcategory_id": subcategory_exists.id,
                "price": price,
                "description": description,
                "image": img_url,
            }
            result = Product.add_product(product_data)
            if not result:
                return  "Product not saved", 409

            return  "Product added successfully", 201
        
        except Exception as e:
            return  f"Error occurred: {str(e)}", 500

    
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