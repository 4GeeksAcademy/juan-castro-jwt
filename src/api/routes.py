from flask import request, jsonify, Blueprint
from api.models import db, User, Client
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

api = Blueprint("api", __name__)
CORS(api)

bcrypt = Bcrypt()
jwt = JWTManager()

# -----------------------
# Crear un nuevo user
# -----------------------

@api.route("/create_user", methods=["POST"])
def create_user():

    # recuperar la data entrante del json
    data = request.get_json()

    # verificar si tiene infomacion la data
    if not data:
        return jsonify({"msg": "no hay data, la proxima presta atencion"}), 400

    # recuperar la varible
    name = data.get("name")
    email = data.get("email")
    is_active = data.get("is_active", True)
    password = data.get("password")
    role = data.get("role")

    # verificar si las variables tienen contenido
    if not name or not email or not password or not role:
        return jsonify({"msg": "algun dato te falto"}), 400

    # confirmar si ese usuario existe en la base de datos buscandolo por email
    busqueda = User.query.filter_by(email=email).first()

    # si existe mandar devolucion con informacion que existe y si no continuar con la creacion
    if busqueda:
        return jsonify({"msg": "este email ya existe"}), 400

    # hashear password
    passhash = bcrypt.generate_password_hash(password).decode("utf-8")

    # crear nuevo usuario
    new_user = User(
        name=name,
        email=email,
        password=passhash,
        is_active=is_active,
        role=role
    )

    # anexarlo a la sesion
    db.session.add(new_user)

    # commitiar la sesion
    db.session.commit()

    # retornar los datos del usuario
    return jsonify({"msg": "todo un exito", "nuevo_usuario": new_user.serialize()}), 201

# -----------------------
# AUTH
# -----------------------

@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data"}), 400

    user = User.query.filter_by(email=data.get("email")).first()
    if not user:
        return jsonify({"msg": "Usuario no existe"}), 404

    if not bcrypt.check_password_hash(user.password, data.get("password")):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(hours=2)
    )

    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200


# -----------------------
# USERS (ADMIN / TRAINER)
# -----------------------

@api.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200


# -----------------------
# CLIENT PROFILE (CLIENT)
# -----------------------

@api.route("/client/profile", methods=["GET"])
@jwt_required()
def client_profile():
    user_id = int(get_jwt_identity())

    client = Client.query.filter_by(user_id=user_id).first()
    if not client:
        return jsonify({"msg": "Perfil de cliente no encontrado"}), 404

    return jsonify(client.serialize()), 200


# -----------------------
# CLIENT CRUD (TRAINER)
# -----------------------

@api.route("/clients", methods=["GET"])
@jwt_required()
def get_clients():
    clients = Client.query.all()
    return jsonify([c.serialize() for c in clients]), 200


@api.route("/clients", methods=["POST"])
@jwt_required()
def create_client():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data"}), 400

    user = User(
        name=data["name"],
        email=data["email"],
        password=bcrypt.generate_password_hash(data["password"]).decode("utf-8"),
        role="client"
    )
    db.session.add(user)
    db.session.commit()

    client = Client(
        user_id=user.id,
        altura=data.get("altura"),
        peso=data.get("peso"),
        rutina=data.get("rutina"),
        observaciones=data.get("observaciones"),
        estado=data.get("estado", "Activo")
    )
    db.session.add(client)
    db.session.commit()

    return jsonify(client.serialize()), 201


@api.route("/clients/<int:client_id>", methods=["PUT"])
@jwt_required()
def update_client(client_id):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"msg": "Cliente no encontrado"}), 404

    data = request.get_json()
    client.altura = data.get("altura")
    client.peso = data.get("peso")
    client.rutina = data.get("rutina")
    client.observaciones = data.get("observaciones")
    client.estado = data.get("estado")

    db.session.commit()
    return jsonify(client.serialize()), 200