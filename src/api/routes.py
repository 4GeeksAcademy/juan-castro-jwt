"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
bcrypt = Bcrypt()

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

    #verificar si las variables tienen contenido
    if not name or not email or not password:
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
        is_active=is_active
        )

    #anexarlo a la sesion
    db.session.add(new_user)

    #commitiar la sesion
    db.session.commit()

    #retornar los datos del usuario
    return jsonify({"msg":"todo un exito", "nuevo_usuario": new_user.serialize()}), 201


