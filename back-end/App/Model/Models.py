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

    

    # relationship
    order = db.Relationship('Order',back_populates='user',uselist=True)
    password = db.Relationship('Password',backref='user',uselist=False)
    profilepic = db.Relationship('ProfilePic',backref='user',uselist=False)
    auth = db.Relationship('Auth',backref='user',uselist=False)
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
            }
        if owner and orders:
            print('am here')
            return {
                "id": str(self.id),
                "username": self.username,
                "isActive": self.active,
                "email": self.email,
                "fa": self.auth.enabled if self.auth else None,
                'orders':[order.to_json() for order in self.order] if self.order else None,
                "img_path": self.profilepic.img_path if self.profilepic else None,
            }

        return{
            'id':str(self.id),
            'first_name':self.first_name,
            'isActive':self.active,
            'email':self.email
        }

    def update_user(self, data):
        try:
            for key, value in data.items():
                if hasattr(self, key):
                    if key == "role":
                        if value not in [role.value for role in Role]:
                            raise ValueError(f"Invalid role: {value}")
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
            existing_profile = ProfilePic.query.filter_by(user_id=self.id).first()
            
            if existing_profile:
                existing_profile.img_path = img_path 
            else:
                profile = ProfilePic(user_id=self.id, img_path=img_path)
                db.session.add(profile)
            
            db.session.commit()
            return True
        
        except Exception:
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
        saved_password= Password.save_password({'id':new_user.id,'password':user['password']})

        db.session.add(new_user)
        db.session.add(saved_password)
        db.session.commit()
        return True
    
    def correct_password(self,password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.password)

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
    id = db.Column(db.UUID,primary_key=True)
    user_id = db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False)
    product_id = db.Column(db.UUID,db.ForeignKey('product.id'),nullable=False)

    def to_json(self):
        return {
            "id":str(self.id),
            "product":self.product.to_json(),
        }

    # relation
    user = db.Relationship('User',back_populates='order',uselist=False)
    product = db.Relationship('Product',back_populates='order',uselist=False)

# password class
class Password(db.Model):
    __tablename__ = 'password'
    user_id = db.Column(db.UUID,db.ForeignKey('user.id'),nullable=False,primary_key=True)
    password = db.Column(db.String(200),nullable=False)

    @classmethod
    def save_password(cls,data):
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        password=cls(user_id=data['id'],password=hashed_password)
        return password

    def change_password(self,password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password =hashed_password
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
            return {"subcategories": [sub.to_json() for sub in self.subcategory]}
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
    description=db.Column(db.Text,nullable=False)

    # relationship
    subcategory=db.Relationship('SubCategory',back_populates='product',uselist=False)
    order=db.Relationship('Order',back_populates='product',uselist=True)

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
            new_product = cls(
                id=uuid4(),
                sub_category_id=product["subcategory_id"],
                product=product["productName"],
                img_path=product["image"],
                price=float(product["price"]),  # Ensure float conversion
                description=product["description"],
            )
            print(new_product)
            db.session.add(new_product)
            db.session.commit()
            return True
        except Exception :
            db.session.rollback()
            return False
    
    @classmethod
    def get_all(cls):
        return cls.query.all()
    
    @classmethod
    def get_by_id(cls,id):
        return cls.query.filter_by(id=UUID(id)).first()
