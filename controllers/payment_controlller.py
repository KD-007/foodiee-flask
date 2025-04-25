from flask import  request, jsonify 
from flask_smorest import Blueprint
from schemas import Payment
from flask_jwt_extended import jwt_required
import os
import stripe


stripe.api_key = os.getenv("STRIPE_KEY")

payment_bp = Blueprint("payment", __name__  , description="Operations about payment")

@payment_bp.route('/payment/process', methods=['POST'])
@payment_bp.arguments(Payment)
@jwt_required()
def process_payment(data):
    try:
        # Create PaymentIntent
        payment_intent = stripe.PaymentIntent.create(
            amount=data.get('amount'),
            description="Software development services",
            currency='inr',
            metadata={
                'company': 'Foodiee'
            }
        )
        
        return jsonify({
            'success': True,
            'client_secret': payment_intent.client_secret
        }), 200
        
    except stripe.error.StripeError as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400
        
    except Exception as e:
        raise e

@payment_bp.route('/stipeapikey', methods=['GET'])
@jwt_required()
def send_stripe_key():
    try:
        stripe_api_key = os.getenv("STRIPE_ID")
        if not stripe_api_key:
            return jsonify({"success": False, "message": "Stripe ID is not set"}), 500

        return jsonify({
            "success": True,
            "stripeApiKey": stripe_api_key
        }), 200
    except Exception as e:
        raise e