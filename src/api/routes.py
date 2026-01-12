import os
import requests
from flask import request, jsonify, Blueprint
from api.models import db, User, EjercicioAsignado
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
    # Forward any query parameters received to the external API (allows filtering)
    params = request.args.to_dict(flat=False)
    try:
        r = requests.get(
            "https://api.api-ninjas.com/v1/exercises",
            headers={"X-Api-Key": API_KEY},
            params=params if params else None,
            timeout=10,
        )
        return jsonify(r.json()), r.status_code
    except Exception as e:
        return jsonify({"msg": "error fetching exercises", "error": str(e)}), 500


@bp.route("/api/exercisesdifficulty")
def exercisesdifficulty():
    r = requests.get("https://api.api-ninjas.com/v1/exercises?difficulty=",
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
    user.altura = data.get("altura")
    user.peso = data.get("peso")
    user.rutina = data.get("rutina")
    user.observaciones = data.get("observaciones")

    db.session.commit()
    return jsonify(user.serialize()), 200


# -----------------------
# CLIENT PROFILE (CLIENT)
# -----------------------

@api.route("/user/profile", methods=["GET"])
@jwt_required()
def user_profile():
    user_id = int(get_jwt_identity())

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"msg": "Perfil de usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

# -----------------------
# EJERCICIOS ASIGNADOS
# -----------------------


@api.route("/assign-exercise", methods=["POST"])
@jwt_required()
def assign_exercise():
    """Asignar un ejercicio a un cliente"""
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data"}), 400

    user_id = data.get("user_id")
    exercise_name = data.get("exercise_name")

    if not user_id or not exercise_name:
        return jsonify({"msg": "Faltan datos requeridos"}), 400

    # Verificar que el usuario existe
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Verificar si ya está asignado
    existing = EjercicioAsignado.query.filter_by(
        user_id=user_id,
        execise_name=exercise_name
    ).first()

    if existing:
        return jsonify({"msg": "Este ejercicio ya está asignado a este cliente"}), 400

    # Crear la asignación
    assignment = EjercicioAsignado(
        user_id=user_id,
        execise_name=exercise_name
    )

    db.session.add(assignment)
    db.session.commit()

    return jsonify({
        "msg": "Ejercicio asignado correctamente",
        "assignment": assignment.serialize()
    }), 201


@api.route("/my-exercises", methods=["GET"])
@jwt_required()
def get_my_exercises():
    """Obtener ejercicios asignados al cliente logueado"""
    user_id = int(get_jwt_identity())

    assignments = EjercicioAsignado.query.filter_by(user_id=user_id).all()

    return jsonify([a.serialize() for a in assignments]), 200


@api.route("/client-exercises/<int:client_id>", methods=["GET"])
@jwt_required()
def get_client_exercises(client_id):
    """Obtener ejercicios asignados a un cliente específico (para trainers)"""
    assignments = EjercicioAsignado.query.filter_by(user_id=client_id).all()

    return jsonify([a.serialize() for a in assignments]), 200

# -----------------------
# CLIENT CRUD (TRAINER)
# -----------------------

# @api.route("/clients", methods=["GET"])
# @jwt_required()
# def get_clients():
#     clients = Client.query.all()
#     return jsonify([c.serialize() for c in clients]), 200


# @api.route("/clients", methods=["POST"])
# @jwt_required()
# def create_client():
#     data = request.get_json()
#     if not data:
#         return jsonify({"msg": "No data"}), 400
#     user = None

#     # Si nos pasan user_id, enlazamos ese usuario existente
#     user_id = data.get("user_id")
#     if user_id:
#         user = User.query.get(int(user_id))
#         if not user:
#             return jsonify({"msg": "Usuario no encontrado"}), 404
#         # Evitar duplicar perfil de cliente
#         existing = Client.query.filter_by(user_id=user.id).first()
#         if existing:
#             return jsonify({"msg": "Cliente ya existe para ese usuario"}), 400
#         # Asegurar que el role sea 'client'
#         if user.role != "client":
#             user.role = "client"
#             db.session.commit()
#     else:
#         # Crear un nuevo usuario (se requieren name, email y password)
#         name = data.get("name")
#         email = data.get("email")
#         password = data.get("password")
#         if not name or not email or not password:
#             return jsonify({"msg": "Faltan campos para crear el usuario (name, email, password)"}), 400

#         # verificar si el email ya existe
#         busqueda = User.query.filter_by(email=email).first()
#         if busqueda:
#             return jsonify({"msg": "Este email ya existe"}), 400

#         user = User(
#             name=name,
#             email=email,
#             password=bcrypt.generate_password_hash(password).decode("utf-8"),
#             role="client"
#         )
#         db.session.add(user)
#         db.session.commit()

#     # Crear perfil de cliente vinculado al user.id
#     client = Client(
#         user_id=user.id,
#         altura=data.get("altura"),
#         peso=data.get("peso"),
#         rutina=data.get("rutina"),
#         observaciones=data.get("observaciones"),
#         estado=data.get("estado", "Activo")
#     )
#     db.session.add(client)
#     db.session.commit()

#     return jsonify(client.serialize()), 201


# @api.route("/users/<int:user_id>", methods=["PUT"])
# @jwt_required()
# def update_user(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"msg": "usuario no encontrado"}), 404

#     data = request.get_json()
#     user.altura = data.get("altura")
#     user.peso = data.get("peso")
#     user.rutina = data.get("rutina")
#     user.observaciones = data.get("observaciones")

#     db.session.commit()
#     return jsonify(user.serialize()), 200
