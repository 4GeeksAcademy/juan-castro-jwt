from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey

# from sqlalchemy.orm import relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(120), nullable=False)
    is_active = db.Column(Boolean(), default=True)
    role = db.Column(String(50), nullable=False, default="client")
    estado = db.Column(String(50), default="Desactivado")
    altura = db.Column(String(120))
    peso = db.Column(String(20))
    observaciones = db.Column(String(200))


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "estado": self.estado,
            "altura": self.altura,
            "peso": self.peso,
            "observaciones": self.observaciones
        }

class EjercicioAsignado(db.Model):
    __tablename__ = "ejercicios_asignados"

    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey("users.id"), nullable=False)
    execise_name = db.Column(String(100), nullable=False)

    def serialize(self):
        return {
           "id": self.id,
            "user_id": self.user_id,
            "exercise_name": self.execise_name
        }

