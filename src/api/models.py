from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column


db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120),nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    role: Mapped[str] = mapped_column(String(10), nullable=False, default="client")
    def set_role(self,role:str):
        if role not in("adm","client","trainer"):
            raise ValueError("role invalido" )
        self.role = role

    def serialize(self):
        return {
            "name": self.name,
            "id": self.id,
            "email": self.email,
            "role": self.role
            # do not serialize the password, its a security breach
        }