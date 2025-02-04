from App.Model import  db

class User(db.Model):
    id=db.Column(db.UUID,primary_key=True,nullable=False)
    first_name=db.Column(db.String(80),nullable=False)
    username=db.Column(db.String(100),nullable=False,unique=True)
    email=db.Column(db.String(100),nullable=False,unique=True)

    def __repr__(self):
        return f'User({self.email} {self.username})'