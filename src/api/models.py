from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(100), nullable=False)
    email = db.Column(String(120), unique=True, nullable=False)
    password = db.Column(String(120), nullable=False)
    is_active = db.Column(Boolean(), default=True)
    role = db.Column(String(50), nullable=False, default="client")

    client = relationship("Client", back_populates="user", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }


class Client(db.Model):
    __tablename__ = "clients"

    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey("users.id"), nullable=False)

    altura = db.Column(String(120))
    peso = db.Column(String(20))
    rutina = db.Column(String(50))
    observaciones = db.Column(String(200))
    estado = db.Column(String(50), default="Desactivado")

    user = relationship("User", back_populates="client")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.user.name,
            "email": self.user.email,
            "altura": self.altura,
            "peso": self.peso,
            "rutina": self.rutina,
            "observaciones": self.observaciones,
            "estado": self.estado
        }
