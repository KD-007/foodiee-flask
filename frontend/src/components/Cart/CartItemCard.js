import React from "react";
import { Link } from "react-router-dom";


const CartItemCart = ({ item, deleteCartItems,decreaseQuantity , increaseQuantity }) => {
  return (

    <div className="d-flex w-100">
    <div >
        <img className="img-responsive" src={item.image} alt="ProductImage" style={{maxWidth:"120px"}} />
    </div>
    <div className="flex-fill mx-2">
    <Link to={`/product/${item.product}`} className="text-decoration-none text-dark"> <b >{item.name} </b></Link>

        <div  >
          <small className="text-center">
            Quantity:
            <div className="btn-group text-center" role="group" aria-label="Basic example">
            <button type="button" className="btn ">
            <i className="bi bi-caret-down-fill " onClick={() =>decreaseQuantity(item.product, item.quantity)} style={{maxWidth:"10px"}}></i>
            </button>
            <b className="m-auto" >{item.quantity}</b>
            <button type="button" className="btn ">
            <i className="bi bi-caret-up-fill " onClick={() =>increaseQuantity(item.product)} style={{maxWidth:"10px"}}></i>
            </button>
          </div>


        
         </small>
         
         <div>
         <small> {item.price} * {item.quantity} {   }</small>
          </div> 
         
         </div>
        
    </div>
    <div className="align-self-md-end d-block">
        <p>  <b>₹ {item.price * item.quantity}</b></p>
        <button className="btn btn-danger" onClick={() => deleteCartItems(item.product)} ><i className="bi bi-trash" style={{maxWidth:"20px"}} ></i></button>
    </div>
    
</div>

  );
};

export default CartItemCart;
