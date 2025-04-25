from flask import Flask ,send_from_directory 
from controllers.user_controller import user_bp
from controllers.product_controller import product_bp
from controllers.payment_controlller import payment_bp
from controllers.order_controller import order_bp
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from utils.error_handler import register_error_handlers
from config import DevelopmentConfig , ProductionConfig
from dotenv import load_dotenv
import os


def create_app():
    load_dotenv() 
    
    app = Flask(__name__, static_folder="frontend/build", static_url_path="/")

    
    if os.getenv("FLASK_ENV") == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)
        
    api = Api(app)
    jwt = JWTManager(app)

    

    # Register Blueprints (Controllers)
    app.register_blueprint(user_bp, url_prefix='/api/v1')
    app.register_blueprint(product_bp, url_prefix='/api/v1')
    app.register_blueprint(payment_bp, url_prefix='/api/v1')
    app.register_blueprint(order_bp, url_prefix='/api/v1')
    
    # Serve static assets from frontend
    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')


    @app.route('/')
    def index():
        return app.send_static_file('index.html')


        
    
    register_error_handlers(app)

    
    return app

app = create_app()          # Always available
if __name__ == '__main__':  # Still works for direct execution
    app.run()
