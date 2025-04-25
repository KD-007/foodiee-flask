from flask import jsonify
from werkzeug.exceptions import HTTPException , UnprocessableEntity
from webargs.flaskparser import parser
from webargs import ValidationError as WebargsValidationError
from flask_jwt_extended.exceptions import (
    NoAuthorizationError,
    InvalidHeaderError,
    RevokedTokenError,
    FreshTokenRequired
)
import pyodbc  # For pyodbc related errors

def register_error_handlers(app):
    """Registers global error handlers for the Flask app"""


    @app.errorhandler(UnprocessableEntity)
    def handle_unprocessable_entity(error):
        # Get the original validation error from the description
        if hasattr(error, 'exc') and error.exc is not None:
            # This is a marshmallow validation error
            messages = error.exc.messages
            while isinstance(messages, dict):
                # Get the first error message
                first_field = next(iter(messages))
                messages = messages[first_field]
                print(messages)
                while isinstance(messages, list):
                    messages = messages[0]
                    print("list")
            else:
                messages = str(messages)
                print("dfg")
        else:
            messages = error.description

        return jsonify({
            "success": False,
            "error": "Validation Error",
            "message": messages,
            "status_code": 422
        }), 422

    # JWT-related errors
    @app.errorhandler(NoAuthorizationError)
    @app.errorhandler(FreshTokenRequired)
    @app.errorhandler(InvalidHeaderError)
    @app.errorhandler(RevokedTokenError)
    def handle_jwt_errors(error):
        return jsonify({
            "success": False,
            "error": "Unauthorized",
            "message": str(error),
            "status_code": 401
        }), 401

    # DB connection error
    @app.errorhandler(pyodbc.DatabaseError)
    def handle_database_error(error):
        return jsonify({
            "success": False,
            "error": "Database Error",
            "message": f"Database connection failed: {str(error)}",
            "status_code": 500
        }), 500

    @app.errorhandler(pyodbc.ProgrammingError)
    def handle_programming_error(error):
        error_msg = str(error)

        if "Conversion failed when converting from a character string to uniqueidentifier" in error_msg:
            return jsonify({
                "success": False,
                "error": "Invalid UUID",
                "message": "The provided ID is not a valid UUID format.",
                "status_code": 400
            }), 400

        return jsonify({
            "success": False,
            "error": "Database Error",
            "message": f"Programming Error: {error_msg}",
            "status_code": 400
        }), 400

     

    # Handle built-in HTTP exceptions (404, 500, etc.)
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({
            "success": False,
            "error": error.name,
            "message": error.description,
            "status_code": error.code
        }), error.code
        
    # Catch-all error handler (last resort)
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        return jsonify({
            "success": False,
            "message": str(error),
            "status_code": 500
        }), 500



