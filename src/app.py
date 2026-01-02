"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from api.models import db
from api.routes import api
from api.extensions import bcrypt, jwt
from api.utils import APIException, generate_sitemap # Asegúrate de importar esto

app = Flask(__name__)
app.url_map.strict_slashes = False

# 1. Configuración de Base de Datos (Corrección de protocolo Postgres)
db_url = os.getenv("DATABASE_URL")
if db_url:
    # SQLAlchemy requiere 'postgresql://', pero Render/Heroku a veces dan 'postgres://'
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret")

# 2. Inicialización de extensiones
db.init_app(app)
Migrate(app, db)
bcrypt.init_app(app)
jwt.init_app(app)
CORS(app)

# 3. Registro de Blueprints
app.register_blueprint(api, url_prefix="/api")

# 4. Manejador de errores (Importante para que tu API no "explote" y responda JSON)
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# 5. Ruta principal (Sitemap)
@app.route('/')
def sitemap():
    return generate_sitemap(app)

if __name__ == "__main__":
    PORT = int(os.getenv('PORT', 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)