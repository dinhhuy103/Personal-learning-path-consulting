from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from neo4j import GraphDatabase
from app.routes.routes import register_routes

def create_app():
    app = Flask(__name__)
    api = Api(app)
    app.config.from_object('app.config.Config')
    CORS(app, origins=['http://localhost:3000', 'http://example.com'])

    # Kết nối tới Neo4j
    app.neo4j_driver = GraphDatabase.driver(app.config['NEO4J_URI'], auth=(app.config['NEO4J_USERNAME'], app.config['NEO4J_PASSWORD']))

    register_routes(api)

    return app
