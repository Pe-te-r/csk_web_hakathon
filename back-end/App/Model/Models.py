import bcrypt
from enum import Enum as PyEnum
from uuid import uuid4,UUID
from App.Model import  db

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
    password = db.Relationship('Password',backref='user',uselist=False)
    def __repr__(self):
        return f'User({self.email} {self.username})'
    
    def to_json(self):
        return{
            'id':str(self.id),
            'first_name':self.first_name,
            'username':self.username,
            'email':self.email
        }

    @classmethod
    def get_user_by_id(cls,id):
        return cls.query.filter_by(id=UUID(id)).first()

    def is_active(self):
        return self.is_active
    
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


# category
class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.UUID,primary_key=True,nullable=False)
    category = db.Column(db.String(80),unique=True,nullable=False)

    # relationship
    subcategory = db.Relationship('SubCategory',back_populates='category',uselist=True)

    def to_json(self):
        return{
            'id':str(self.id),
            'category':self.category
        }

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
    
    @classmethod
    def add_subcategory(cls,subcategory):
        new_subcategory = cls(id=uuid4(),category_id=subcategory['category_id'],sub_category=subcategory['sub_category'])
        db.session.add(new_subcategory)
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

    @classmethod
    def add_product(cls,product):
        new_product =cls(id=uuid4(),sub_category_id=product['sub_category_id'],product=product['product'],img_path=product['img_path'],price=product['price'],description=product['description'])
        db.session.add(new_product)
        db.session.commit()
        return True