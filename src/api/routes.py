"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask_jwt_extended import  JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
bcrypt = Bcrypt()
jwt = JWTManager()

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/create_user", methods=["POST"])
def create_user():

    #recuperar la data entrante del json 
    data = request.get_json()

    #verificar si tiene infomacion la data
    if not data:
        return jsonify({"msg":"no hay data, la proxima presta atencion"}), 400
    
    #recuperar la varible
    name = data.get("name")
    email = data.get("email")
    is_active = data.get("is_active", True )
    password = data.get("password")
    role = data.get("role")

    #verificar si las variables tienen contenido
    if not name or not email or not password or not role:
         return jsonify({"msg":"algun dato te falto"}), 400
    
    #confirmar si ese usuario existe en la base de datos buscandolo por email
    busqueda = User.query.filter_by(email=email).first()

    #si existe mandar devolucion con informacion que existe y si no continuar con la creacion
    if busqueda:
        return jsonify({"msg":"este email ya existe"}), 400 

    #hashear password
    passhash = bcrypt.generate_password_hash(password).decode("utf-8")



    #crear nuevo usuario
    new_user = User(
        name=name,
        email=email,
        password=passhash,
        is_active=is_active,
        role=role
        )

    #anexarlo a la sesion
    db.session.add(new_user)

    #commitiar la sesion
    db.session.commit()

    #retornar los datos del usuario
    return jsonify({"msg":"todo un exito", "nuevo_usuario": new_user.serialize()}), 201


@api.route("/login",methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"msj":"no hay data"}), 400 
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"msj":"no mandaste uno de los datos"}), 400
    current_user = User.query.filter_by(email=email).first()
    if not current_user:
        return jsonify({"msj":"no existe ese mail"}), 404
    hashed_password = current_user.password
    password_match = bcrypt.check_password_hash(hashed_password,password)
    if not password_match:
        return jsonify({"msj":"la contraseña no coincide"}), 411
    expires = timedelta(minutes=30)
    user_id = current_user.id
    access_token = create_access_token(identity=str(user_id),expires_delta=expires)
    payload = current_user.serialize()
    payload["access_token"] = access_token
    return jsonify(payload), 200


@api.route("/restringido")
@jwt_required()
def restringido():
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({"msg":"error"}), 401
    user = User.query.get(current_user_id).one()
    if not user:
        return jsonify({"msg":"el usuario no existe"}), 404
    
    return jsonify({"user":user.serialize()}), 200

