from uuid import uuid4,UUID
from App.Model import  db


class User(db.Model):
    id=db.Column(db.UUID,primary_key=True,nullable=False)
    first_name=db.Column(db.String(80),nullable=False)
    username=db.Column(db.String(100),nullable=False,unique=True)
    email=db.Column(db.String(100),nullable=False,unique=True)
    active = db.Column(db.Boolean,nullable=False,default=True)

    def __repr__(self):
        return f'User({self.email} {self.username})'
    
    def to_json(self):
        return{
            'id':self.id,
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
    def create_user(cls,user):
        # password = user['password']
        del user['password']

        new_user=cls(id=uuid4(),first_name=user['first_name'],email=user['email'],username=user['username'])
        print(new_user.id)
        db.session.add(new_user)
        db.session.commit()
        return True