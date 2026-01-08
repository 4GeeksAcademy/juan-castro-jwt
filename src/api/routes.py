import os, requests
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

bp = Blueprint('proxy', __name__)
API_KEY = os.environ.get("API_KEY_EXERCISES")

@bp.route("/api/exercises")
def exercises():
    r = requests.get("https://api.api-ninjas.com/v1/exercises",
                     headers={"X-Api-Key": API_KEY}, timeout=10)
    return jsonify(r.json()), r.status_code

# -----------------------
# Crear un nuevo user
# -----------------------


@api.route("/create_user", methods=["POST"])
def create_user():
    data = request.get_json()
    print("Received data for new user:", data)  # Debug print
    if not data:
        return jsonify({"msg": "No data"}), 400

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"msg": "Usuario ya existe"}), 404
    
    new_user = User(
        name=data.get("name"),
        email=email,
        password=bcrypt.generate_password_hash(password).decode("utf-8"),
        role=data.get("role", "client"),
        estado=data.get("estado", "Desactivado")
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

@api.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    user.name = data.get("name")
    user.email = data.get("email")
    user.role = data.get("role")
    user.estado = data.get("estado")

    db.session.commit()
    return jsonify(user.serialize()), 200
 

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
    user = None

    # Si nos pasan user_id, enlazamos ese usuario existente
    user_id = data.get("user_id")
    if user_id:
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        # Evitar duplicar perfil de cliente
        existing = Client.query.filter_by(user_id=user.id).first()
        if existing:
            return jsonify({"msg": "Cliente ya existe para ese usuario"}), 400
        # Asegurar que el role sea 'client'
        if user.role != "client":
            user.role = "client"
            db.session.commit()
    else:
        # Crear un nuevo usuario (se requieren name, email y password)
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        if not name or not email or not password:
            return jsonify({"msg": "Faltan campos para crear el usuario (name, email, password)"}), 400

        # verificar si el email ya existe
        busqueda = User.query.filter_by(email=email).first()
        if busqueda:
            return jsonify({"msg": "Este email ya existe"}), 400

        user = User(
            name=name,
            email=email,
            password=bcrypt.generate_password_hash(password).decode("utf-8"),
            role="client"
        )
        db.session.add(user)
        db.session.commit()

    # Crear perfil de cliente vinculado al user.id
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
    

    db.session.commit()
    return jsonify(client.serialize()), 200
