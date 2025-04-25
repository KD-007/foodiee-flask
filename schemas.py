from marshmallow import Schema, fields, validate

# -------------------------------------------------------------------------------------------
# product schema

class ReviewSchema(Schema):
    productID = fields.UUID(required=True, error_messages={"required": "product id is missing"})
    rating = fields.Float(
        required=True,
        validate=validate.Range(min=0, max=5),
        error_messages={"required": "Please enter Rating"}
    )
    comment = fields.String(required=True, error_messages={"required": "Please enter  comment"})


class ProductSchema(Schema):
    id = fields.UUID(dump_only=True)
    name = fields.String(required=True, error_messages={"required": "Please enter product name"})
    description = fields.String(required=True, error_messages={"required": "Please enter product description"})
    price = fields.Float(
        required=True,
        validate=validate.Range(min=0, max=99999999.99),
        error_messages={"required": "Please enter product price"}
    )
    image = fields.List(fields.String(), required=True , error_messages={"required": "Please add product images"})
    category = fields.String(required=True, error_messages={"required": "Please enter product category"})
    Stock = fields.Integer(
        missing=1,
        validate=validate.Range(max=9999),
        error_messages={"required": "Please enter product quantity"}
    )
    numOfReviews = fields.Integer(missing=0)
    reviews = fields.List(fields.Nested(ReviewSchema), missing=[])
    user = fields.UUID(dump_only=True)
    createdAt = fields.DateTime(dump_only=True)

# ---------------------------------------------------------------------------------------------------
# ----------------------------------------------------------------------------------------------------
# user schemas
class UserSchema(Schema):
    id = fields.UUID(dump_only=True)  # Generated on server
    name = fields.String(
        required=True,
        error_messages={"required": "Please enter a name"}
    )
    email = fields.Email(
        required=True,
        error_messages={
            "required": "Please enter an email",
            "invalid": "Please enter a valid email"
        }
    )
    password = fields.String(
        required=True,
        load_only=True,
        error_messages={"required": "Please enter a password"}
    )
    avatar = fields.String(
        required=True,
        error_messages={"required": "Please provide an avatar"}
    )
    role = fields.String(missing="user", dump_only=True)
    createdAt = fields.DateTime(dump_only=True)
    resetPasswordToken = fields.String(allow_none=True, dump_only=True)
    resetPasswordExpire = fields.DateTime(allow_none=True, dump_only=True)



# ----------------------------------------------------------------------------------------

class LoginSchema(Schema):
    email = fields.Email(
        required = True,
        error_messages={"required": "Please provide an email"}
    )
    password = fields.String(
        required = True,
        error_messages={"required": "Please provide an password"}
    )
 
  
# ------------------------------------------------------------------------------

class ForgotPasswordSchema(Schema):
    email = fields.Email(
        required = True,
        error_messages={"required": "Please provide an email"}
    )
    
    
#--------------------------------------------------------------------
class ResetPasswordSchema(Schema):
    password = fields.String(
        required = True,
        error_messages={"required": "Please provide an password"}
    )
    confirmPassword = fields.String(
        required = True,
        error_messages={"required": "Please provide an confirm password"}
    )  
    

    
# ---------------------------------------------------------
class UpdatePasswordSchema(Schema):
    oldPassword = fields.String(
        required = True,
        error_messages={"required": "Please provide an oldPassword"}
    )
    newPassword = fields.String(
        required = True,
        error_messages={"required": "Please provide an newPassword"}
    )
    confirmPassword = fields.String(
        required = True,
        error_messages={"required": "Please provide an confirm password"}
    )  
    
# -----------------------------------------------------------------------------
class UpdateUserSchema(Schema):
    name = fields.String(
        required=True,
        error_messages={"required": "Please enter a name"}
    )
    email = fields.Email(
        required=True,
        error_messages={"required": "Please enter an email", "invalid": "Please enter a valid email"}
    )
    avatar = fields.String(
        required=False
    )
    
#---------------------------------------------------------------------------
class UpdateUserRoleSchema(Schema):
    name = fields.String(
        required=True,
        error_messages={"required": "Please enter a name"}
    )
    email = fields.Email(
        required=True,
        error_messages={"required": "Please enter an email", "invalid": "Please enter a valid email"}
    )
    role = fields.String(
        required=True,
        validate=validate.OneOf(["admin", "user"], error="Role must be 'admin' or 'user'"),
        error_messages={"required": "Please specify user role"}
    ) 
    

# ------------------------------------------------------------------------------------------
# -----------------------------------------------------------------------------------------
# order schemas


class ShippingInfoSchema(Schema):
    address = fields.String(required=True, error_messages={"required": "Address is required."})
    city = fields.String(required=True, error_messages={"required": "City is required."})
    state = fields.String(required=True, error_messages={"required": "State is required."})
    country = fields.String(required=True, error_messages={"required": "Country is required."})
    pinCode = fields.Integer(required=True, error_messages={"required": "Pin code is required."})
    phoneNo = fields.Integer(required=True, error_messages={"required": "Phone number is required."})

class OrderItemSchema(Schema):
    product = fields.UUID(required=True, error_messages={"required": "Product ID is required."})
    name = fields.String(required=True, error_messages={"required": "Product name is required."})
    price = fields.Float(required=True, error_messages={"required": "Product price is required."})
    quantity = fields.Integer(required=True, error_messages={"required": "Product quantity is required."})
    image = fields.String(required=True, error_messages={"required": "Product image URL is required."})
    stock = fields.Integer()

class PaymentInfoSchema(Schema):
    id = fields.String(required=True, error_messages={"required": "Payment ID is required."})
    status = fields.String(required=True, error_messages={"required": "Payment status is required."})

class OrderSchema(Schema):
    shippingInfo = fields.Nested(ShippingInfoSchema, required=True, error_messages={"required": "Shipping information is required."})
    orderItems = fields.List(fields.Nested(OrderItemSchema), required=True, error_messages={"required": "Order items are required."})
    paymentInfo = fields.Nested(PaymentInfoSchema, required=True, error_messages={"required": "Payment information is required."})
    itemPrice = fields.Float(required=True, error_messages={"required": "Item price is required."})
    taxPrice = fields.Float(required=True, error_messages={"required": "Tax price is required."})
    shippingPrice = fields.Float(required=True, error_messages={"required": "Shipping price is required."})
    totalPrice = fields.Float(required=True, error_messages={"required": "Total price is required."})

class UpdateOrderStatus(Schema):
    status = fields.String(
        required=True,
        validate=validate.OneOf(["shipped", "delivered"], error="status must be 'shipped' or 'delivered'"),
        error_messages={"required": "Please specify order status"}
    ) 

class Payment(Schema):
    amount = fields.Integer(required=True, error_messages={"required": "Order amount is required."})
