import bcrypt
from enum import property, Enum as PyEnum
from string import digits
from random import choices
from uuid import uuid4,UUID
from App.Model import  db
from App.helpers import Totp


class Role(PyEnum):
    ADMIN='admin'
    BUYER='buyer'
    SELLER='seller'


class User(db.Model):

    __tablename='user'
    id=db.Column(db.UUID,primary_key=True,nullable=False)
    first_name=db.Column(db.String(80),nullable=False)
    username=db.Column(db.String(100),nullable=False,unique=True)
    email=db.Column(db.String(100),nullable=False,unique=True)
    role=db.Column(db.Enum(Role),default= Role.BUYER,nullable=False)
    active = db.Column(db.Boolean,nullable=False,default=True)
    phone=db.Column(db.String(10),nullable=True)
    bussiness_name = db.Column(db.String(80), nullable=True)

    # relationship
    order = db.Relationship('Order',back_populates='user',uselist=True)
    orderitem = db.Relationship('OrderItem',back_populates='owner',uselist=True)
    password = db.Relationship('Password',backref='user',uselist=False)
    profilepic = db.Relationship('ProfilePic',backref='user',uselist=False)
    auth = db.Relationship('Auth',backref='user',uselist=False)
    product = db.Relationship('Product',back_populates='user',uselist=True)
    def __repr__(self):
        return f'User({self.email} {self.username})'
    
    def to_json(self,orders=False,owner=False):
        if owner and not orders:
            return {
                "id": str(self.id),
                "username": self.username,
                "isActive": self.active,
                "email": self.email,
                "fa": self.auth.enabled if self.auth else None,
                "img_path": self.profilepic.img_path if self.profilepic else None,
                'role':self.role.value
            }
        if owner and orders:
            print('am here')
            return {
                "id": str(self.id),
                "username": self.username,
                "isActive": self.active,
                "email": self.email,
                "fa": self.auth.enabled if self.auth else None,
                'orders':[order.to_json(owner=True) for order in self.order] if self.order else None,
                "img_path": self.profilepic.img_path if self.profilepic else None,
                'role':self.role.value
            }

        return{
            'id':str(self.id),
            'first_name':self.first_name,
            'isActive':self.active,
            'role':self.role.value,
            'email':self.email
        }

    def update_user(self, data):
        try:
            for key, value in data.items():
                if hasattr(self, key):
                    if key == "role":
                        if value not in [role.value for role in Role]:
                            raise ValueError(f"Invalid role: {value}")
                        print(Role(value))
                        print('data above')
                        setattr(self, key, Role(value)) 
                    else:
                        setattr(self, key, value)

            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False
    
    @property
    def get_role(self):
        return self.role.value

    @classmethod
    def get_user_by_id(cls,id):
        return cls.query.filter_by(id=UUID(id)).first()

    def is_active(self):
        return self.is_active
    
    def save_profile_photo(self, img_path):
        try:
            print('zero')
            existing_profile = ProfilePic.query.filter_by(user_id=self.id).first()
            print('one')
            if existing_profile:
                existing_profile.img_path = img_path 
                print('two')
            else:
                profile = ProfilePic(user_id=self.id, img_path=img_path)
                print('three')
                db.session.add(profile)
            print('four')
            
            db.session.commit()
            return True
        
        except Exception as e:
            print(e)
            print('above')
            db.session.rollback()
            return False
    @classmethod
    def get_by_email(cls,email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def all_users(cls):
        return cls.query.all()

    # check user exists
    @classmethod
    def user_exists(cls, username, email):
        existing_user_by_username = cls.query.filter_by(username=username).first()
        existing_user_by_email = cls.query.filter_by(email=email).first()

        if existing_user_by_email:
            return True, "Email already exists"
        elif existing_user_by_username:
            return True,"Username already exists"
        else:
            return False,''

    # create user
    @classmethod
    def create_user(cls,user):
        new_user=cls(id=uuid4(),first_name=user['first_name'],email=user['email'],username=user['username'])
        if 'role' in user:
            new_user.role=Role(user['role'])
        saved_password= Password.save_password({'id':new_user.id,'password':user['password']})

        db.session.add(new_user)
        db.session.add(saved_password)
        db.session.commit()
        return True
    
    def correct_password(self,user_password):
        try:
            print(self.password.password.encode())
            return bcrypt.checkpw(user_password.encode(), self.password.password.encode())
        except Exception as e:
            print(e)
            return False

# authentication
class Auth(db.Model):
    __tablename__='auth'
    user_id = db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False,primary_key=True)
    random_code=db.Column(db.String(6),nullable=False)
    secret=db.Column(db.String(6),nullable=True)
    enabled=db.Column(db.Boolean,nullable=False,default=False)

    def change_code(self):
        new_code = Auth.generate_code()
        self.random_code=new_code
        db.session.add(self)
        db.session.commit()
        return self.random_code 

    def generate_secret(self):
        try:
            code = Totp.generate()
            self.secret=code
            db.session.add(self)
            db.session.commit()
            return self.secret
        except Exception:
            db.session.rollback()
            return False
        
    def verify_totp(self,code):
        if Totp.verify(self.secret,code):
            self.enabled=True
            db.session.add(self)
            db.session.commit()
            return True
        return False

    @staticmethod
    def generate_code():
        return ''.join(choices(digits, k=6))
    
    def verify(self,code):
        return self.random_code==code
    @classmethod
    def get_by_user_id(cls,id):
        return cls.query.filter_by(user_id=UUID(id)).first()
    
    @classmethod
    def create_auth(cls,id):
        try:
            random_code=cls.generate_code()
            auth=cls(user_id=UUID(id),random_code=random_code)
            db.session.add(auth)
            db.session.commit()
            db.session.refresh(auth)
            return auth
        except Exception:
            return False        

# profile_picture
class ProfilePic(db.Model):
    __tablename__='profilepic'
    user_id = db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False,primary_key=True)
    img_path=db.Column(db.String(150),nullable=False) 

    def __repr__(self):
        return f'ProfilePicture({self.img_path})'

class Order(db.Model):
    __tablename__='order'
    id = db.Column(db.UUID,primary_key=True,default=uuid4())
    user_id = db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False)

    total_amount=db.Column(db.Float)

     # relation
    user = db.Relationship('User',back_populates='order',uselist=False)
    orderitem = db.relationship('OrderItem', back_populates='order', uselist=True, cascade='all, delete-orphan')
    def to_json(self,owner=False,admin=False):
        if admin:
            product_item=[]
            for item in self.orderitem:
                product_item.append({
                'seller':{'name':item.owner.first_name,'email':item.owner.email,'phone':item.owner.phone},
                'product':{'product':item.product.product,'quantity':item.quantity,'amount':item.amount}})
            return{
                'order_id':str(self.id),
                'total':self.total_amount,
                'buyer':{
                    'name':self.user.first_name,
                    'email':self.user.email,
                    'phone':self.user.phone
                },
                'product':product_item

            }
        if owner:
            return {
                "id": str(self.id),
                "total_amount": self.total_amount,
                "products": [item.to_json(owner=True) for item in self.orderitem],
            }
        return {
            "id": str(self.id),
            "total_amount":self.total_amount,
            'buyer':{
                'email':self.user.email,
                'phone':self.user.phone,
                'first_name':self.user.first_name,
            },
            "products":[item.to_json(owner=True) for item in self.orderitem],
        }

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_by_id(cls,id):
        return cls.query.filter_by(id=UUID(id)).first()

    @classmethod    
    def getAll(cls):
        return cls.query.all()
    
    @classmethod
    def add_order(cls,order):
        try:
            products = order['products']
            total_amount=0

            new_order = cls(
                id=uuid4(),
                user_id=UUID(order['user_id']),
                total_amount=total_amount
            )
            db.session.add(new_order)
            db.session.commit()
            db.session.refresh(new_order)
            print(new_order)

            for product in products:
                product_details= Product.get_by_id(product['product_id'])
                if not product_details:
                    return 'product nor found'
                amount=product_details.price * int(product['quantity'])
                total_amount += amount
                item = {"product_id": UUID(product['product_id']),  "quantity": product['quantity'],'amount':amount,'order_id':new_order.id,'id':uuid4(),'owner_id':product_details.owner}
                try:
                    orderItem=OrderItem.add_item(item)
                    db.session.add(orderItem)
                    db.session.commit()
                except Exception as e:
                    print(e)
                    db.session.rollback()
                    return False
            new_order.total_amount=total_amount
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            db.session.rollback()
            return False
class OrderItem(db.Model):
    __tablename__='orderitem'
    id = db.Column(db.UUID,primary_key=True)
    product_id = db.Column(db.UUID,db.ForeignKey('product.id'))
    order_id = db.Column(db.UUID,db.ForeignKey('order.id'))
    owner_id = db.Column(db.UUID,db.ForeignKey('user.id'))
    quantity=db.Column(db.Integer,nullable=False)
    amount=db.Column(db.Float,nullable=False)

    order = db.Relationship('Order',back_populates='orderitem',uselist=False)
    owner = db.Relationship('User',back_populates='orderitem',uselist=False)
    product = db.Relationship('Product',back_populates='orderitem',uselist=False)

    def to_json(self,owner=False,seller=False):
        if seller:
            return {
                "order_id": str(self.order.id),
                "buyer": {
                    "name": self.order.user.first_name,
                    "email": self.order.user.email,
                },
                "item": {
                    "product_id": str(self.product_id),
                    "quantity": self.quantity,
                    "product": self.product.product,
                    "amount": self.amount,
                },
            }
        if not self.owner:
            return {
                'seller':{
                'email':self.owner.email,
                'phone':self.owner.phone,
                'first_name':self.owner.first_name
                },
                'product':{
                    'product_id':str(self.product_id),
                    'product_name':self.product.product,
                    'quantity':self.quantity,
                }
            }
        return {
            "product_id": str(self.product_id),
            'img_url':self.product.img_path,
            "product_name": self.product.product,
            "quantity": self.quantity,
            'price':self.amount
        }
    @classmethod
    def get_by_owner_id(cls,id):
        return cls.query.filter_by(owner_id=UUID(id))
    @classmethod
    def add_item(cls,orderItem):
        return cls(id=orderItem['id'],product_id=orderItem['product_id'],amount=orderItem['amount'],quantity=orderItem['quantity'],order_id=orderItem['order_id'],owner_id=orderItem['owner_id'])




# password class
class Password(db.Model):
    __tablename__ = 'password'
    user_id = db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False,primary_key=True)
    password = db.Column(db.String(200),nullable=False)

    @classmethod
    def save_password(cls,data):
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        password=cls(user_id=data['id'],password=hashed_password.decode('utf-8'))
        return password

    def change_password(self,password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password =hashed_password.decode('utf-8')
        db.session.add(self)
        db.session.commit()
        return True

# category
class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.UUID,primary_key=True,nullable=False)
    category = db.Column(db.String(80),unique=True,nullable=False)

    # relationship
    subcategory = db.Relationship('SubCategory',back_populates='category',uselist=True)

    def to_json(self, subcategory=False):
        if subcategory:
            return  [sub.to_json() for sub in self.subcategory]
        return{
            'id':str(self.id),
            'category':self.category
        }
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return True
    def update(self,category):
        self.category=category
        db.session.commit()
    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def add_category(cls,category):
        new_category = cls(id=uuid4(),category=category['category'])
        db.session.add(new_category)
        db.session.commit()
        return True
    @classmethod
    def get_category_by_name(cls,name):
        return cls.query.filter_by(category=name).first()
    
    @classmethod
    def get_by_id(cls,id):
        return cls.query.filter_by(id=UUID(id)).first()
# sub category
class SubCategory(db.Model):
    __tablename__='subcategory'
    id = db.Column(db.UUID,primary_key=True,nullable=False)
    category_id = db.Column(db.UUID,db.ForeignKey('category.id'),nullable=False)
    sub_category = db.Column(db.String(80),unique=True,nullable=False)

    # relationship
    category = db.Relationship('Category',back_populates='subcategory',uselist=False)
    product = db.Relationship('Product',back_populates='subcategory',uselist=True)
    
    def to_json(self,category_name=False):
        if  category_name:
            return{
                'id':str(self.id),
                'category':self.category.category,
                'subcategory':self.sub_category
                }
        return{
            'id':str(self.id),
            'subcategory':self.sub_category
        }
    
    def update_name(self,name):
        self.sub_category=name
        db.session.add(self)
        db.session.commit()
        return True
    @classmethod
    def get_all(cls):
        return cls.query.all()
    @classmethod
    def add_subcategory(cls,subcategory):
        new_subcategory = cls(
            id=uuid4(),
            category_id=UUID(subcategory["category_id"]),
            sub_category=subcategory["subcategory"],
        )
        db.session.add(new_subcategory)
        db.session.commit()
        return True
    
    @classmethod 
    def get_by_id(cls,id):
        return cls.query.filter_by(id = UUID(id)).first()

    @classmethod
    def get_by_name(cls,name):
        return cls.query.filter_by(sub_category=name).first()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return True

# product
class Product(db.Model):
    __tablename__='product'
    id = db.Column(db.UUID,primary_key=True,nullable=False)
    sub_category_id = db.Column(db.UUID,db.ForeignKey('subcategory.id'),nullable=False)
    product = db.Column(db.String(100),nullable=False)
    img_path=db.Column(db.String(130),nullable=False)
    price = db.Column(db.Float,nullable=False,default=0.00)
    owner=db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False)
    description=db.Column(db.Text,nullable=False)

    # relationship
    subcategory=db.Relationship('SubCategory',back_populates='product',uselist=False)
    user = db.Relationship('User',back_populates='product',uselist=False)
    orderitem = db.Relationship('OrderItem',back_populates='product',uselist=True)

    def to_json(self):
        return {
            "id": str(self.id),
            "sub_category": self.subcategory.sub_category,
            "product": self.product,
            "img_path": self.img_path,
            "price": self.price,
            "description": self.description,
        }

    @classmethod
    def add_product(cls, product):
        try:
            print(product)
            new_product = cls(
                id=uuid4(),
                sub_category_id=product["subcategory_id"],
                product=product["productName"],
                img_path=product["image"],
                price=float(product["price"]),  # Ensure float conversion
                description=product["description"],
                owner=UUID(product['owner'])
            )
            db.session.add(new_product)
            db.session.commit()
            return True
        except Exception  as e:
            print(e)
            db.session.rollback()
            return False
    
    @classmethod
    def get_all(cls):
        return cls.query.all()
    
    @classmethod
    def get_by_id(cls,id):
        return cls.query.filter_by(id=UUID(id)).first()
    def delete(self):
        db.session.delete(self)
        db.session.commit()