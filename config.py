import os
from datetime import timedelta
class Config:
    """Base configuration"""
    PROPOGATE_EXCEPTIONS = True
    API_TITLE = "DGFDG"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.3"
    OPENAPI_URL_PREFIX = "/"
    
    # Security
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')   # <-- Flask needs this name
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)  # 7 days expiration
    JWT_TOKEN_LOCATION = ['cookies']  # Store token in cookies
    JWT_COOKIE_SECURE = False  # Set to True in production (requires HTTPS)
    JWT_COOKIE_CSRF_PROTECT = False
    

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    JWT_COOKIE_SECURE = False  # Allow cookies over HTTP (for local dev)
    
class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    JWT_COOKIE_SECURE = True  # Enforce HTTPS for cookies
