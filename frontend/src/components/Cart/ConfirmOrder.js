import React from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

import { Link, useNavigate } from "react-router-dom";


const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cartReducer);
  const { user } = useSelector((state) => state.getUser);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 499 ? 0 : 49;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pinCode}, ${shippingInfo.state}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/process/payment");
  };

  return (
    <>
      <MetaData title="Confirm Order | Foodie" />
      <CheckoutSteps activeStep={1} />
      <div className="row w-100">
        <div className="col-lg-8" >
          <div className="row ps-5 pt-5">
            <b>Shipping Info:</b>
            <div>
              <div>
                <p><b>Name: </b><span>{user.name}</span></p>
              </div>
              <div>
                <p> <b>Phone:</b> <span>{shippingInfo.phoneNo}</span></p>
                
              </div>
              <div>
                <p><b>Address: </b><span>{address}</span></p>
                
              </div>
            </div>
          </div>
          <div className="row ps-5 pt-5">
            <b>Your Cart Items:</b>
            <div className="row">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product} className="py-2 border-bottom">
                            <img className="img-responsive" src={item.image} alt="ProductImage" style={{maxWidth:"120px"}} />

                    <Link to={`/product/${item.product}`}
                      className="text-decoration-none text-dark"> <b >{item.name} </b></Link>{"  "}
      
                    <span className="float-end mt-4">
                      {item.quantity} x ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div className="col-lg-4">
          <div className="row ps-5 pt-5 border">
            <b>Order Summery:</b>
            <div>
              <div className="d-flex justify-content-between pe-2">
                <b>Subtotal:</b>
                <span>₹{subtotal} </span>
              </div>
              <div className="d-flex justify-content-between pe-2">
                <b>Shipping Charges:</b>
                <span>₹{shippingCharges}</span>
              </div>
              <div className="d-flex justify-content-between pe-2">
                <b>GST:</b>
                <span>₹{Math.round(tax * 100) / 100}</span>
              </div>
            </div>
                <div className="border my-3"></div>
            <div className="d-flex justify-content-between pe-2">
                <b>Total:</b>
              <span>₹{Math.round(totalPrice * 100) / 100}</span>
            </div>

            <button className="btn btn-warning my-3  text-light" onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
