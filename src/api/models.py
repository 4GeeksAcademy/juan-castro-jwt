from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(120), nullable=False)
    is_active = db.Column(Boolean(), nullable=False)
    role = db.Column(String(50), nullable=False, default="client")

    altura = db.Column(String(120))
    peso = db.Column(String(20))
    rutina =  db.Column(String(50))
    observaciones = db.Column(String(200))
    estado = db.Column(String(50))

    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'altura': self.altura,
            'peso': self.peso,
            'rutina': self.rutina,
            'observaciones': self.observaciones,
            'estado': self.estado             
        }
    

