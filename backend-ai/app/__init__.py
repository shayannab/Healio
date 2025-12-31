from flask import Flask
from flask_cors import CORS #

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for the entire application
    # This allows your frontend to access the /chat endpoint
    CORS(app, resources={r"/*": {"origins": "*"}}) #
    
    from .routes import configure_routes
    configure_routes(app) #
    
    return app