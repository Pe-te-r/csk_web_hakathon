from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

from App.Model.Models import  User
from App.Model.Models import  Category
from App.Model.Models import  SubCategory
from App.Model.Models import  Product
from App.Model.Models import  Auth