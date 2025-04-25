from flask import jsonify
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from database import get_db_connection


def is_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT role FROM Users WHERE id = ?", user_id)
            row = cursor.fetchone()

            if not row or row.role.lower() != 'admin':
                return jsonify({"success": False, "message": "Access denied: Admins only"}), 403

            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"success": False, "message": f"Authorization error: {str(e)}"}), 500
    return wrapper
