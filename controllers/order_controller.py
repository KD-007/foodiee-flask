from flask import  request, jsonify , make_response
from flask_smorest import Blueprint
from utils.helpers import is_admin
from database import get_db_connection
from schemas import OrderSchema , UpdateOrderStatus
import uuid
import hashlib
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os


order_bp = Blueprint("order", __name__ , description="Operations about order")


@order_bp.route("/order/new", methods=["POST"])
@jwt_required()
@order_bp.arguments(OrderSchema)
def create_order(data):
    try:
        
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        order_id = str(uuid.uuid4())
        paid_at = datetime.now()
        # Insert into Orders
        cursor.execute("""
            INSERT INTO Orders (id, userId, paidAt, itemPrice, taxPrice, shippingPrice, totalPrice)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (order_id, user_id, paid_at, data["itemPrice"], data["taxPrice"], data["shippingPrice"], data["totalPrice"]))

        # Insert into ShippingInfo
        shipping = data["shippingInfo"]
        shipping_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO ShippingInfo (id, orderId, address, city, state, country, pinCode, phoneNo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (shipping_id, order_id, shipping["address"], shipping["city"], shipping["state"], shipping["country"], shipping["pinCode"], shipping["phoneNo"]))

        # Insert OrderItems
        for item in data["orderItems"]:
            item_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO OrderItems (id, orderId, productId, name, price, quantity, image)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (item_id, order_id, item["product"], item["name"], item["price"], item["quantity"], item["image"]))

        # Insert PaymentInfo
        payment = data["paymentInfo"]
        payment_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO PaymentInfo (id, orderId, paymentId, status)
            VALUES (?, ?, ?, ?)
        """, (payment_id, order_id, payment["id"], payment["status"]))

        conn.commit()

        full_order = {
            "id": order_id,
            "user": user_id,
            "paidAt": paid_at.isoformat(),
            "itemPrice": data["itemPrice"],
            "taxPrice": data["taxPrice"],
            "shippingPrice": data["shippingPrice"],
            "totalPrice": data["totalPrice"],
            "orderStatus": "processing",
            "deliveredAt": None,
            "createdAt": paid_at.isoformat(),  # Simulating createdAt
            "shippingInfo": shipping,
            "orderItems": data["orderItems"],
            "paymentInfo": data["paymentInfo"]
        }

        return jsonify({"success": True, "order": full_order}), 201
    
    except Exception as e:
        conn.rollback()
        raise e
    

        
@order_bp.route('/order/<order_id>', methods=['GET'])
@jwt_required()
def get_single_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Fetch order
        cursor.execute("SELECT * FROM Orders WHERE id = ?", (order_id,))
        order_row = cursor.fetchone()
        if not order_row:
            return jsonify({"success": False, "message": "Order not found with this ID"}), 404

        order_columns = [col[0] for col in cursor.description]
        order = dict(zip(order_columns, order_row))

        # Fetch user info
        cursor.execute("SELECT name, email FROM Users WHERE id = ?", (order['userId'],))
        user_info = cursor.fetchone()
        if user_info:
            order["user"] = {"name": user_info[0], "email": user_info[1]}

        # Fetch shipping info
        cursor.execute("SELECT * FROM ShippingInfo WHERE orderId = ?", (order_id,))
        shipping_row = cursor.fetchone()
        shipping_columns = [col[0] for col in cursor.description]
        order["shippingInfo"] = dict(zip(shipping_columns, shipping_row))

        # Fetch order items
        cursor.execute("SELECT * FROM OrderItems WHERE orderId = ?", (order_id,))
        items = cursor.fetchall()

        item_columns = [col[0] for col in cursor.description]
        order["orderItems"] = [dict(zip(item_columns, item)) for item in items]


        # Fetch payment info
        cursor.execute("SELECT * FROM PaymentInfo WHERE orderId = ?", (order_id,))
        payment_row = cursor.fetchone()

        payment_columns = [col[0] for col in cursor.description]
        order["paymentInfo"] = dict(zip(payment_columns, payment_row))


        return jsonify({"success": True, "order": order}), 200

    except Exception as e:
        raise e




@order_bp.route('/orders/me', methods=['GET'])
@jwt_required()
def my_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        user_id = get_jwt_identity()

        cursor.execute("SELECT * FROM Orders WHERE userId = ?", (user_id,))
        order_rows = cursor.fetchall()
        order_columns = [column[0] for column in cursor.description]
        
        orders = []
        for order in order_rows:
            order_dict = dict(zip(order_columns, order))
            order_id = order_dict['id']

            # ShippingInfo
            cursor.execute("SELECT * FROM ShippingInfo WHERE orderId = ?", (order_id,))
            shipping_info = cursor.fetchone()
            shipping_columns = [col[0] for col in cursor.description]
            shipping = dict(zip(shipping_columns, shipping_info)) if shipping_info else None

            # OrderItems
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = ?", (order_id,))
            order_items = cursor.fetchall()
            item_columns = [col[0] for col in cursor.description]
            items = [dict(zip(item_columns, item)) for item in order_items]

            # PaymentInfo
            cursor.execute("SELECT * FROM PaymentInfo WHERE orderId = ?", (order_id,))
            payment_info = cursor.fetchone()
            payment_columns = [col[0] for col in cursor.description]
            payment = dict(zip(payment_columns, payment_info)) if payment_info else None

            order_dict["shippingInfo"] = shipping
            order_dict["orderItems"] = items
            order_dict["paymentInfo"] = payment

            orders.append(order_dict)

        return jsonify({"success": True, "orders": orders}), 200
    except Exception as e:
        raise e


@order_bp.route('/admin/orders', methods=['GET'])
@jwt_required()
@is_admin
def get_all_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Orders")
        order_rows = cursor.fetchall()
        order_columns = [col[0] for col in cursor.description]

        orders = []
        total_amount = 0

        for order in order_rows:
            order_dict = dict(zip(order_columns, order))
            total_amount += float(order_dict.get("totalPrice", 0))

            order_id = order_dict["id"]

            # ShippingInfo
            cursor.execute("SELECT * FROM ShippingInfo WHERE orderId = ?", (order_id,))
            shipping_info = cursor.fetchone()
            shipping_columns = [col[0] for col in cursor.description]
            shipping = dict(zip(shipping_columns, shipping_info)) if shipping_info else None

            # OrderItems
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = ?", (order_id,))
            order_items = cursor.fetchall()
            item_columns = [col[0] for col in cursor.description]
            items = [dict(zip(item_columns, item)) for item in order_items]

            # PaymentInfo
            cursor.execute("SELECT * FROM PaymentInfo WHERE orderId = ?", (order_id,))
            payment_info = cursor.fetchone()
            payment_columns = [col[0] for col in cursor.description]
            payment = dict(zip(payment_columns, payment_info)) if payment_info else None

            order_dict["shippingInfo"] = shipping
            order_dict["orderItems"] = items
            order_dict["paymentInfo"] = payment

            orders.append(order_dict)

        return jsonify({"success": True, "orders": orders, "totalAmount": total_amount}), 200

    except Exception as e:
        raise e


@order_bp.route('/admin/order/<order_id>', methods=['PUT'])
@jwt_required()
@is_admin
@order_bp.arguments(UpdateOrderStatus)
def update_order(data , order_id):
    try:
        new_status = data['status']
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch order
        cursor.execute("SELECT * FROM Orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 400

        order_status = order.orderStatus  
        
        if new_status == order_status:
            return jsonify({"success": False, "message": f"Order is already in '{new_status}' status"}), 400

        if order_status == "delivered":
            return jsonify({"success": False, "message": "You have already delivered this product"}), 400


        if order_status == "processing":
            # Check and update product stock
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = ?", (order_id,))
            order_items = cursor.fetchall()

            for item in order_items:

                product_id = item.productId
                quantity = item.quantity
                
                cursor.execute("SELECT Stock FROM Products WHERE id = ?", (product_id,))
                product_row = cursor.fetchone()
                if not product_row:
                    return jsonify({"success": False, "message": f"Product {product_id} not found"}), 400
                stock = product_row[0]
                if stock < quantity:
                    return jsonify({"success": False, "message": f"Product {product_id} is not available in desired quantity"}), 400

                new_stock = stock - quantity
                cursor.execute("UPDATE Products SET Stock = ? WHERE id = ?", (new_stock, product_id))

        # Update order status and deliveredAt
        delivered_at = datetime.now() if new_status == "delivered" else None
        if delivered_at:
            cursor.execute("UPDATE Orders SET orderStatus = ?, deliveredAt = ? WHERE id = ?", (new_status, delivered_at, order_id))
        else:
            cursor.execute("UPDATE Orders SET orderStatus = ? WHERE id = ?", ("shipped", order_id))

        conn.commit()
        return jsonify({"success": True}), 200

    except Exception as e:
        raise e
    


@order_bp.route('/admin/order/<order_id>', methods=['DELETE'])
@jwt_required()
@is_admin
def delete_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if the order exists
        cursor.execute("SELECT * FROM Orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            return jsonify({"success": False, "message": "Order not found"}), 400

        # Delete from Orders (ON DELETE CASCADE handles ShippingInfo, OrderItems, PaymentInfo)
        cursor.execute("DELETE FROM Orders WHERE id = ?", (order_id,))
        conn.commit()

        return jsonify({"success": True}), 200

    except Exception as e:
        conn.rollback()
        raise e


