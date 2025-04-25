import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../../redux/actions/orderActions";
import Loader from "../layout/Loader/Loader";
import { notify } from "../../utils/Notification";

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderReducer);


  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {order && <>
            <MetaData title="Order Details | Foodiee" />
          <div className="row ps-5 pt-5  w-100">
            <div className="row ps-5 pt-5">
              <h4>
                Order #{ order.id}
              </h4>
              <b>Shipping Info:</b>
              <div className="row">
                <div>
                  <p> <b> Name: </b><span>{order.user.name}</span></p>
                  
                </div>
                <div>
                  <p> <b>Phone: </b> {order.shippingInfo.phoneNo}</p>
                  <span>
                    
                  </span>
                </div>
                <div>
                  <p> <b>Address:  </b> <span>
                    {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                  </span></p>
                 
                </div>
              </div>
              <h3>Payment</h3>
              <div className="row">
                <div>
                  <b
                    className={
                      order.paymentInfo.status === "succeeded"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {order.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </b>
                </div>

                <div className="d-flex justify-content-between" >
                  <b>Amount:</b>
                  <span > ₹ { order.totalPrice}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between">
              <b>Order Status</b>
                <div>
                  <b
                    className={
                      order.orderStatus === "Delivered"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {order.orderStatus}
                  </b>
                </div>
              </div>
            </div>

            <div className="row ps-5 pt-5">
              <b>Order Items:</b>
              <div className="row">
              {order.orderItems &&
                  order.orderItems.map((item) => (
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
          </> }
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
