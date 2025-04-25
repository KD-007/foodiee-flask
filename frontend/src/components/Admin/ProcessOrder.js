import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import SideBar from "./Sidebar";
import { getOrderDetails, clearErrors, updateOrder } from "../../redux/actions/orderActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Button } from "@mui/material";
import { notify } from "../../utils/Notification";

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderReducer);
  const { error: updateError, isUpdated } = useSelector((state) => state.editOrderReducer);

  const params = useParams();

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateOrder(params.id, myForm));
  };

  const dispatch = useDispatch();


  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      notify("error" , error);
      dispatch(clearErrors());
 
    }
    if (updateError) {
      notify("error" , updateError);
      dispatch(clearErrors());
     
    }
    if (isUpdated) {
      notify("success", "order updated successfully");
      dispatch(clearErrors());
    }


    dispatch(getOrderDetails(params.id));
    // eslint-disable-next-line
  }, [dispatch, error, params.id, isUpdated, updateError]);

  return (
    <>{order && <Fragment>
      <MetaData title="Process Order | Foodiee" />
      <div className="row w-100">
        <SideBar />
        <div className="col-md-10 mt-5 pt-3">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="row w-100 mt-5 pt-3"
            >
              
                
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
                      order.orderStatus === "delivered"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {order.orderStatus}
                  </b>
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
              
              {/*  */}
              <div
                className={
                   order.orderStatus === "delivered" ? "d-none" : "row mt-4"
                }
              >
                <b className="py-3" >Process Order</b>
                <form
                  onSubmit={updateOrderSubmitHandler}
                >

                  <div className="input-group mb-3">
                    <div className="input-group-prepend px-2">
                          <AccountTreeIcon />
                    </div>
                    <select className="form-select"
                     onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order?.orderStatus === "processing" && (
                        <option value="shipped">Shipped</option>
                      )}

                      {order?.orderStatus === "shipped" && (
                        <option value="delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                  className="btn btn-warning w-100 border"
                    type="submit"
                    
                    disabled={
                      loading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>}</>
  );
};

export default ProcessOrder;
