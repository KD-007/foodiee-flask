from flask import  request, jsonify , make_response
from flask_smorest import Blueprint
from utils.helpers import is_admin
from database import get_db_connection
from schemas import ProductSchema , ReviewSchema
import uuid
import hashlib
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from utils.email_utils import send_email
import os


product_bp = Blueprint("product", __name__ , description="Operations about product")


@product_bp.route("/admin/product/new", methods=["POST"])
@jwt_required()
@is_admin
@product_bp.arguments(ProductSchema)
def create_product(data):
    try:
        user_id = get_jwt_identity()
        product_id = str(uuid.uuid4())
        conn = get_db_connection()
        cursor = conn.cursor()
        # Insert product
        cursor.execute("""
            INSERT INTO Products (id, name, description, price, category, stock, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            product_id,
            data['name'],
            data['description'],
            data['price'],
            data['category'],
            data.get('Stock', 1),
            user_id
        ))

        # Insert product images
        for image in data['image']:
            image_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO ProductImages (id, productId, image)
                VALUES (?, ?, ?)
            """, (image_id, product_id, image))

        conn.commit()
        product_data = {
     
            "id": product_id,
            "name": data['name'],
            "description": data['description'],
            "price": data['price'],
            "category": data['category'],
            "Stock": data.get('Stock', 1),
            "user": user_id,
            "createdAt": datetime.now(),
            "image": data['image']  
        }

        return jsonify({"success": True, "message": "Product created successfully", "product": product_data}), 201

    except Exception as e:
        conn.rollback()

        raise e


@product_bp.route("/products", methods=["GET"])
def get_all_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # --- Query Params ---
        keyword = request.args.get("keyword", "").strip()
        category = request.args.get("category")
        price_gte = float(request.args.get("price[gte]", 0))
        price_lte = float(request.args.get("price[lte]", 100000))
        page = int(request.args.get("currentPage", 1))
        limit = int(request.args.get("limit", 8))
        ratings = request.args.get("ratings", default=None, type=float)
        offset = (page - 1) * limit

        # --- Base Query ---
        base_query = "SELECT * FROM Products WHERE 1=1"
        params = []

        if keyword != "":
            base_query += " AND name LIKE ?"
            params.append(f"%{keyword}%")

        if category:
            base_query += " AND category = ?"
            params.append(category)
 
        if ratings is not None :
            base_query += " AND ratings >= ?"
            params.append(ratings)    
        if price_gte:
            base_query += " AND price >= ?"
            params.append(float(price_gte))
        if price_lte:
            base_query += " AND price <= ?"
            params.append(float(price_lte))

        # --- Count before pagination ---
        count_query = f"SELECT COUNT(*) FROM ({base_query}) AS countTable"
        cursor.execute(count_query, params)
        filtered_count = cursor.fetchone()[0]

        # --- Pagination ---
        paginated_query = base_query + " ORDER BY createdAt DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY"
        cursor.execute(paginated_query, params + [offset, limit])
        products_data = cursor.fetchall()

        
        products = []

        for product_row in products_data:
            product_id = product_row.id

            # --- Get images ---
            cursor.execute("SELECT image FROM ProductImages WHERE productId = ?", product_id)
            images = [img_row.image for img_row in cursor.fetchall()]

            # --- Get reviews ---
            cursor.execute("""
                SELECT R.id, R.userId, R.name, R.rating, R.comment
                FROM Reviews R
                WHERE R.productId = ?
            """, product_id)
            review_rows = cursor.fetchall()

            reviews = []
            total_rating = 0
            for review in review_rows:
                reviews.append({
                    "id": review.id,
                    "user": review.userId,
                    "name": review.name,
                    "rating": review.rating,
                    "comment": review.comment
                })
                total_rating += review.rating

            ratings = round(total_rating / len(reviews), 1) if reviews else 0

            product = {
                "id": product_row.id,
                "name": product_row.name,
                "description": product_row.description,
                "price": product_row.price,
                "ratings": ratings,
                "image": images,
                "category": product_row.category,
                "Stock": product_row.stock,
                "numOfReviews": len(reviews),
                "user": product_row.userId,
                "createdAt": product_row.createdAt.isoformat() if product_row.createdAt else None,
                "reviews": reviews
            }

            products.append(product)

        # --- Total products count (not just filtered) ---
        cursor.execute("SELECT COUNT(*) FROM Products")
        total_count = cursor.fetchone()[0]

        return jsonify({
            "success": True,
            "products": products,
            "productCount": total_count,
            "filteredProductsCount": filtered_count,
            "resultPerPage": limit
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500



@product_bp.route("/admin/product/<string:product_id>", methods=["PUT"])
@jwt_required()
@is_admin
@product_bp.arguments(ProductSchema)
def update_product(data, product_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if product exists
        cursor.execute("SELECT * FROM Products WHERE id = ?", product_id)
        if not cursor.fetchone():
            return jsonify({"success": False, "message": "Product not found"}), 404

        # Update product
        cursor.execute("""
            UPDATE Products
            SET name = ?, description = ?, price = ?, category = ?, stock = ?
            WHERE id = ?
        """, (
            data['name'],
            data['description'],
            data['price'],
            data['category'],
            data.get('Stock', 1),
            product_id
        ))

        # Delete existing images
        cursor.execute("DELETE FROM ProductImages WHERE productId = ?", product_id)

        # Insert new images
        for image in data['image']:
            image_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO ProductImages (id, productId, image)
                VALUES (?, ?, ?)
            """, (image_id, product_id, image))

        conn.commit()

        # Return updated product
        cursor.execute("SELECT * FROM Products WHERE id = ?", product_id)
        row = cursor.fetchone()

        # Get updated images
        cursor.execute("SELECT image FROM ProductImages WHERE productId = ?", product_id)
        images = [r.image for r in cursor.fetchall()]

        product = {
            "id": row.id,
            "name": row.name,
            "description": row.description,
            "price": row.price,
            "category": row.category,
            "Stock": row.stock,
            "user": row.userId,
            "image": images,
        }

        return jsonify({"success": True, "product": product}), 200

    except Exception as e:
        conn.rollback()
        raise e



@product_bp.route("/admin/product/<string:product_id>", methods=["DELETE"])
@jwt_required()
@is_admin
def delete_product(product_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if product exists
        cursor.execute("SELECT * FROM Products WHERE id = ?", product_id)
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"success": False, "message": "Product not found"}), 404
        

        # Get images
        cursor.execute("SELECT image FROM ProductImages WHERE productId = ?", product_id)
        images = [r.image for r in cursor.fetchall()]
        
        cursor.execute("""
                SELECT R.id, R.userId, R.name, R.rating, R.comment
                FROM Reviews R
                WHERE R.productId = ?
            """, product_id)
        review_rows = cursor.fetchall()

        reviews = []
        for review in review_rows:
            reviews.append({
                    "id": review.id,
                    "user": review.userId,
                    "name": review.name,
                    "rating": review.rating,
                    "comment": review.comment
                })

        product = {
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "price": row.price,
                "ratings": row.ratings,
                "image": images,
                "category": row.category,
                "Stock": row.stock,
                "numOfReviews": len(reviews),
                "user": row.userId,
                "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                "reviews": reviews
            }

        cursor.execute("DELETE FROM Products WHERE id = ?", product_id)
        conn.commit()


        return jsonify({"success": True, "product": product}), 200

    except Exception as e:

        conn.rollback()
        raise e


@product_bp.route("/product/<string:product_id>", methods=["GET"])
def get_product(product_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if product exists
        cursor.execute("SELECT * FROM Products WHERE id = ?", product_id)
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"success": False, "message": "Product not found"}), 404
        

        # Get images
        cursor.execute("SELECT image FROM ProductImages WHERE productId = ?", product_id)
        images = [r.image for r in cursor.fetchall()]
        
        cursor.execute("""
                SELECT R.id, R.userId, R.name, R.rating, R.comment
                FROM Reviews R
                WHERE R.productId = ?
            """, product_id)
        review_rows = cursor.fetchall()

        reviews = []
        for review in review_rows:
            reviews.append({
                    "id": review.id,
                    "user": review.userId,
                    "name": review.name,
                    "rating": review.rating,
                    "comment": review.comment
                })

        product = {
                "id": row.id,
                "name": row.name,
                "description": row.description,
                "price": row.price,
                "ratings": row.ratings,
                "image": images,
                "category": row.category,
                "Stock": row.stock,
                "numOfReviews": len(reviews),
                "user": row.userId,
                "createdAt": row.createdAt.isoformat() if row.createdAt else None,
                "reviews": reviews
            }

        return jsonify({"success": True, "product": product}), 200

    except Exception as e:
        conn.rollback()
        raise e


@product_bp.route("/product/review", methods=["POST"])
@jwt_required()
@product_bp.arguments(ReviewSchema)
def add_product_review(data):
    try:
        user_id = get_jwt_identity()
        comment = data.get("comment")
        rating = float(data.get("rating"))
        product_id = data.get("productID")

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if product exists
        cursor.execute("SELECT * FROM Products WHERE id = ?", product_id)
 
        if not cursor.fetchone():
            return jsonify({"success": False, "message": "Product not found"}), 404
        
        # Get user name
        cursor.execute("SELECT name FROM Users WHERE id = ?", user_id)
        user_row = cursor.fetchone()
        if not user_row:
            return jsonify({"success": False, "message": "User not found"}), 404
        user_name = user_row.name

        # Check if user already reviewed the product
        cursor.execute("""
            SELECT id FROM Reviews
            WHERE productId = ? AND userId = ?
        """, (product_id, user_id))
        review_row = cursor.fetchone()

        if review_row:
            # Update existing review
            cursor.execute("""
                UPDATE Reviews
                SET rating = ?, comment = ?
                WHERE productId = ? AND userId = ?
            """, (rating, comment, product_id, user_id))
        else:
            # Insert new review
            review_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO Reviews (id, productId, userId, name, rating, comment)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (review_id, product_id, user_id, user_name, rating, comment))

        # Recalculate ratings
        cursor.execute("SELECT rating FROM Reviews WHERE productId = ?", product_id)
        all_ratings = [r.rating for r in cursor.fetchall()]
        avg_rating = sum(all_ratings) / len(all_ratings) if all_ratings else 0
        num_reviews = len(all_ratings)

        # Update product
        cursor.execute("""
            UPDATE Products
            SET ratings = ?, numOfReviews = ?
            WHERE id = ?
        """, (avg_rating, num_reviews, product_id))

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Your review has been added successfully"
        }), 201

    except Exception as e:
        conn.rollback()
        raise e


@product_bp.route("/admin/reviews/<string:id>", methods=["GET"])
@jwt_required()
@is_admin
def get_all_reviews(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if product exists
        cursor.execute("SELECT * FROM Reviews WHERE productId = ?", id)
        
        review_rows = cursor.fetchall()
        if not review_rows:
            return jsonify({"success":False , "message":"product not found"})
        reviews = []
        for review in review_rows:
            reviews.append({
                "id": review.id,
                "user": review.userId,
                "name": review.name,
                "rating": review.rating,
                "comment": review.comment
            })
        

        return jsonify({
            "success": True,
            "reviews": reviews
        }), 200

    except Exception as e:
        conn.rollback()
        raise e


@product_bp.route('/admin/reviews', methods=['DELETE'])
@jwt_required()
@is_admin
def delete_review():
    product_id = request.args.get("productID")
    review_id = request.args.get("id")

    if not product_id or not review_id:
        return jsonify({"success": False, "message": "Product ID and Review ID are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if product exists
        cursor.execute("SELECT * FROM Products WHERE id = ?", (product_id,))
        if not cursor.fetchone():
            return jsonify({"success": False, "message": "Product not found"}), 404

        # Delete the review
        cursor.execute("DELETE FROM Reviews WHERE id = ? AND productId = ?", (review_id, product_id))
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Review not found"}), 404

        # Get remaining reviews
        cursor.execute("SELECT *  FROM Reviews WHERE productId = ?", (product_id,))
        rows = cursor.fetchall()
  
        reviews = [{
            "id": row.id,
            "user": row.userId,
            "name": row.name,
            "rating": row.rating,
            "comment": row.comment
        } for row in rows]
        
        avg_rating = sum(review["rating"] for review in reviews) / len(reviews) if reviews else 0
        numOfReviews = len(reviews)

        # Update product ratings and review count
        cursor.execute(
            "UPDATE Products SET ratings = ?, numOfReviews = ? WHERE id = ?",
            (avg_rating, numOfReviews, product_id)
        )

        conn.commit()



        return jsonify({"success": True, "reviews": reviews}), 200

    except Exception as e:
        conn.rollback()
        raise e



@product_bp.route("/admin/products", methods=["GET"])
def get_all_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Products ORDER BY createdAt DESC")
        products_data = cursor.fetchall()

        products = []

        for product_row in products_data:
            product = {
                "id": product_row.id,
                "name": product_row.name,
                "price": product_row.price,
                "Stock": product_row.stock,

            }

            products.append(product)

       
        return jsonify({
            "success": True,
            "products": products
        }), 200

    except Exception as e:
        raise e
