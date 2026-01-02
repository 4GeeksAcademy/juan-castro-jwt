"""
API Routes
Handles authentication and client management
"""

from flask import request, jsonify, Blueprint
from api.models import db, User, Client
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from datetime import timedelta
from api.extensions import bcrypt

api = Blueprint("api", __name__)

# --------------------------------------------------
# TEST / HELLO
# --------------------------------------------------
@api.route("/hello", methods=["GET"])
def handle_hello():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200


# --------------------------------------------------
# AUTH
# --------------------------------------------------
@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "No data"}), 400

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Usuario no existe"}), 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(minutes=30)
    )

    payload = user.serialize()
    payload["access_token"] = access_token

    return jsonify(payload), 200


@api.route("/restringido", methods=["GET"])
@jwt_required()
def restringido():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no existe"}), 404

    return jsonify(user.serialize()), 200


# --------------------------------------------------
# CLIENTS
# --------------------------------------------------
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

    client = Client(
        name=data["name"],
        email=data["email"],
        altura=data.get("altura"),
        peso=data.get("peso"),
        rutina=data.get("rutina"),
        observaciones=data.get("observaciones"),
        estado=data.get("estado", "Activo"),
        trainer_id=get_jwt_identity()
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

    client.altura = data.get("altura", client.altura)
    client.peso = data.get("peso", client.peso)
    client.rutina = data.get("rutina", client.rutina)
    client.observaciones = data.get("observaciones", client.observaciones)
    client.estado = data.get("estado", client.estado)

    db.session.commit()

    return jsonify(client.serialize()), 200
