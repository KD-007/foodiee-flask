from flask import  request, jsonify , make_response
from flask_smorest import Blueprint
from utils.helpers import is_admin
from database import get_db_connection
from schemas import UserSchema , LoginSchema , UpdatePasswordSchema  ,  UpdateUserRoleSchema , UpdateUserSchema , ForgotPasswordSchema , ResetPasswordSchema 
import uuid
import hashlib
from flask_jwt_extended import create_access_token , jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from utils.email_utils import send_email
import os


user_bp = Blueprint('users', __name__ , description="Operations about user")


def check_password(plain_password, hashed_password):
    return hashlib.sha256(plain_password.encode('utf-8')).hexdigest() == hashed_password


def get_user_by_email(email):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Users WHERE email = ?", (email,))
    row = cursor.fetchone()
    db.close()
    if row:
        # Convert row to dictionary using column names
        columns = [column[0] for column in cursor.description]
        user_dict = dict(zip(columns, row))
        return user_dict
    return None

@user_bp.route('/register', methods=['POST'])
@user_bp.arguments(UserSchema)
def register(data):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM Users WHERE email = ?", (data['email'],))
        result = cursor.fetchone()

        if result is not None:
            return jsonify({
                "success": False,
                "message": "Duplicate email error"
            }), 400

        user_id = str(uuid.uuid4())

        hashed_password = hashlib.sha256(data['password'].encode('utf-8')).hexdigest()

        cursor.execute("""
            INSERT INTO Users (id, name, email, password, avatar, role, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, GETDATE())
        """, (
            user_id,
            data['name'],
            data['email'],
            hashed_password,
            data['avatar'],
            'user'
        ))

        conn.commit()

        access_token = create_access_token(identity=user_id)

        user_data = data.copy()
        del user_data['password']
        user_data['id'] = user_id
        user_data['createdAt'] = datetime.now()
        response = make_response(jsonify({
            'statusCode': 201,
            'user': user_data,
            'access_token_cookie': access_token,
            'success' : True
        }))
        response.set_cookie('access_token_cookie', access_token, httponly=True, max_age=7*24*60*60)

        return response

    except Exception as e:
        raise e





@user_bp.route('/login', methods=['POST'])
@user_bp.arguments(LoginSchema)
def login(data):
    try:
        user = get_user_by_email(data['email'])

        if not user or not check_password(data['password'], user['password']):
            return jsonify({'success':False ,  'message': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user['id'])

        del user['password']
        del user['resetPasswordExpire']
        del user['resetPasswordToken']

        response = make_response(jsonify({
            'statusCode': 201,
            'user': user,
            'access_token_cookie': access_token,
            'success' : True
        }))
        response.set_cookie('access_token_cookie', access_token, httponly=True, max_age=7*24*60*60)

        return response
    
    except Exception as e:
        raise e
    
    
@user_bp.route("/logout", methods=['DELETE'])
def logout():
        response = make_response(jsonify({'message': 'you have been logged out successfully' , 'success':True}))
        response.set_cookie('access_token_cookie', "" , httponly=True, max_age=0)
        return response

# Forgot Password 
@user_bp.route('/password/forgot', methods=['PUT'])
@user_bp.arguments(ForgotPasswordSchema)
def forgot_password(data):
    email = data.get('email')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email FROM Users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"success": False ,"error": "Account not found"}), 404

    reset_token = str(uuid.uuid4())
    hashed_token = hashlib.sha256(reset_token.encode()).hexdigest()
    expire_time = datetime.now() + timedelta(minutes=15)

    cursor.execute("""
        UPDATE Users 
        SET resetPasswordToken = ?, resetPasswordExpire = ? 
        WHERE id = ?
    """, (hashed_token, expire_time, user.id))
    conn.commit()

    reset_url = f"{os.environ.get('FRONTEND_URL')}/password/reset/{reset_token}"

    message = f"Your password reset URL is:\n\n{reset_url}\n\nYou can reset password till {expire_time} Ignore if you didn't request it."

    try:
        send_email(user.email, "Your password reset link", message)
        return jsonify({"success": True, "message": f"Email sent to {user.email}"}), 200
    except Exception as e:
        cursor.execute("""
            UPDATE Users 
            SET resetPasswordToken = NULL, resetPasswordExpire = NULL 
            WHERE id = ?
        """, (user.id,))
        conn.commit()

        raise e
   
        
        
# Reset Password
@user_bp.route('/password/reset/<string:token>', methods=['PUT'])
@user_bp.arguments(ResetPasswordSchema)
def reset_password(data , token):
    try:
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        if password != confirm_password:
            return jsonify({"success": False ,"error": "Passwords do not match"}), 400

        hashed_token = hashlib.sha256(token.encode()).hexdigest()

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id FROM Users 
            WHERE resetPasswordToken = ? AND resetPasswordExpire > ?
        """, (hashed_token, datetime.now()))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False ,"error": "Token is invalid or expired"}), 400

        hashed_pw = hashlib.sha256(password.encode('utf-8')).hexdigest()
        cursor.execute("""
            UPDATE Users 
            SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL 
            WHERE id = ?
        """, (hashed_pw, user.id))
        conn.commit()

        return jsonify({"success": True, "message": "Password updated successfully"}), 200
    except Exception as e:
        raise e
  

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_details():
    try:
        user_id = get_jwt_identity()

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Users WHERE id = ?", user_id)
        row = cursor.fetchone()
     
        if not row:
            return jsonify({"success": False, "message": "User not found"}), 404

        col_names = [col[0] for col in cursor.description]
        user = dict(zip(col_names , row))
        
        del user["password"]
        del user["resetPasswordExpire"]
        del user["resetPasswordToken"]
        
        return jsonify({"success": True, "user": user}), 200
    
    except Exception as e:
        raise e
 

@user_bp.route('/password/update', methods=['PUT'])
@jwt_required()
@user_bp.arguments(UpdatePasswordSchema)
def update_user_password(data):
    user_id = get_jwt_identity()

    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")
    confirm_password = data.get("confirmPassword")

    if new_password != confirm_password:
        return jsonify({"success": False, "message": "Passwords do not match"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT password FROM Users WHERE id = ?", user_id)
        row = cursor.fetchone()

        stored_password = row.password

        if not hashlib.sha256(old_password.encode('utf-8')).hexdigest() == stored_password:
            return jsonify({"success": False, "message": "Old password mismatch"}), 400

        hashed_new_password = hashlib.sha256(new_password.encode('utf-8')).hexdigest()
        cursor.execute("UPDATE Users SET password = ? WHERE id = ?", hashed_new_password, user_id)
        conn.commit()

        return jsonify({"success": True, "message": "Password changed successfully"}), 200

    except Exception as e:
        raise e


@user_bp.route('/me/update', methods=['PUT'])
@jwt_required()
@user_bp.arguments(UpdateUserSchema)
def update_user_profile(data):
    user_id = get_jwt_identity()
    
    name = data.get("name")
    email = data.get("email")
    avatar = data.get("avatar" , "")  # Optional: only if avatar is being used

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE Users
            SET name = ?, email = ?, avatar = ?
            WHERE id = ?
        """, (name, email, avatar, user_id))
        
        conn.commit()

        return jsonify({"success": True, "message": "User updated successfully"}), 200

    except Exception as e:
        raise e

@user_bp.route('/admin/users', methods=['GET'])
@jwt_required()
@is_admin
def get_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, role FROM Users")
        users = [
            {
                "id": row.id,
                "name": row.name,
                "email": row.email,
                "role": row.role
            }
            for row in cursor.fetchall()
        ]
        return jsonify({"success": True, "users": users}), 200
    except Exception as e:
        raise e


@user_bp.route('/admin/user/<string:user_id>', methods=['GET'])
@jwt_required()
@is_admin
def get_single_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, role FROM Users WHERE id = ?", user_id)
        row = cursor.fetchone()

        if not row:
            return jsonify({"success": False, "message": "User not found"}), 404

        user = {
            "id": row.id,
            "name": row.name,
            "email": row.email,
            "role": row.role
        }
        return jsonify({"success": True, "user": user}), 200
    except Exception as e:
        raise e



@user_bp.route('/admin/user/<string:user_id>', methods=['PUT'])
@jwt_required()
@is_admin
@user_bp.arguments(UpdateUserRoleSchema)
def update_user_role(data , user_id ): 
    name = data.get("name")
    email = data.get("email")
    role = data.get("role")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Users
            SET name = ?, email = ?, role = ?
            WHERE id = ?
        """, (name, email, role, user_id))
        conn.commit()

        return jsonify({"success": True, "message": "User updated successfully"}), 200
    except Exception as e:
        raise e



@user_bp.route('/admin/user/<string:user_id>', methods=['DELETE'])
@jwt_required()
@is_admin
def delete_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT id FROM Users WHERE id = ?", user_id)
        if not cursor.fetchone():
            return jsonify({"success": False, "message": "User not found"}), 404

        # Delete the user
        cursor.execute("DELETE FROM Users WHERE id = ?", user_id)
        conn.commit()

        return jsonify({"success": True, "message": "User deleted successfully"}), 200
    except Exception as e:
        raise e
