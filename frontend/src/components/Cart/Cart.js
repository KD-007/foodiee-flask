import React, {useEffect} from "react";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, clearErrorsCart, removeItemFromCart } from "../../redux/actions/cartActions";
import Typography from '@mui/material/Typography';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, errorCart , messageCart  } = useSelector((state) => state.cartReducer);
  const increaseQuantity = (id,) => {
    dispatch(addItemsToCart(id, 1));
  };

  const decreaseQuantity = (id, quantity) => {
    dispatch(addItemsToCart(id, -1,true));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  useEffect(()=>{
    if(errorCart){
      notify("warn",errorCart);
    }
    if( messageCart){
      notify("success",messageCart);
    }

    dispatch(clearErrorsCart())


    
  },[dispatch ,  errorCart , messageCart])
  return (
    <>
      {!cartItems || cartItems?.length === 0 ? (
        <div className="container mt-5 pt-5 h-50">
              <div className="text-center" >
              <RemoveShoppingCartIcon />

              <Typography>No Product in Your Cart </Typography>

              <Link className="text-decoration-none" to="/products"> View Products</Link>
              </div>
        </div>
      ) : (
        <>
          <div className="container pt-5 mt-5 h-50">
            <div className="bg-secondary w-100 text-light p-2 my-2 rounded">
              <b>Cart Items</b>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="row w-100 my-2 py-1 border-bottom" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} decreaseQuantity={decreaseQuantity} increaseQuantity={increaseQuantity} />
                </div>
              ))}

            <div className=" w-100 d-flex justify-content-between border-top pt-3 ">
                <div >Gross Total :
                {`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</div>
                <div >
                <button onClick={checkoutHandler} className="btn btn-warning text-light ">Check Out</button>

                </div>
              </div>
            </div>



  






        </>
      )}
    </>
  );
};

export default Cart;
