import React, { Fragment, useEffect, useState } from "react";
import  ReviewCard from "./ReviewCard"
import Loader from "../layout/Loader/Loader"
import {useSelector, useDispatch} from 'react-redux';
import {clearErrors, getSingleProduct} from '../../redux/actions/ProductActions';
import { useParams } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import Rating from '@mui/material/Rating';
import { notify } from "../../utils/Notification";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../redux/actions/cartActions";
import { clearErrorsCart } from "../../redux/actions/cartActions";
import { newReview } from "../../redux/actions/ProductActions";
import { useNavigate } from "react-router-dom";



const ProductDetails = () => {

   const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const {product, loading , error} = useSelector((state)=> state.getSingleProduct)
  const { errorCart , messageCart } = useSelector((state)=> state.cartReducer)
  const { message:revsuccess, error: reviewError } = useSelector((state) => state.reviewReducer);

  useEffect(()=>{
    dispatch(getSingleProduct(id)) 
  },[dispatch , id , revsuccess])

  useEffect(()=>{
    if(error || errorCart || reviewError){
      notify("warn", error|| errorCart || reviewError);
    }
    if( messageCart|| revsuccess){
      notify("success",  messageCart|| revsuccess);
    }

    if(!loading && !product && error){
      navigate("*");
    }

    dispatch(clearErrorsCart())
    dispatch(clearErrors())

    
  },[dispatch , error  , errorCart , messageCart , reviewError ,revsuccess])




  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState("0");
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
  };


  const reviewSubmitHandler = () => {
    dispatch(newReview({rating: rating, comment: comment , productID: id}));
  };

  const options = {
    size: "large",
    value: product?.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return ( <Fragment>{loading ? <Loader/>:<>{product && <Fragment>
    <MetaData title={`${product.name} -- Foodiee`} />
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-md-6 pb-3" >
        <div id="carouselExampleIndicators" className="carousel slide">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner">
        {product.image &&
             product.image.map((item, i) => (
              
              <div className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <img  className="d-block w-100" key={i}
                         src={item}
                         alt={`${i} Slide`}
                       />
            </div>
             ))}


  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
        </div>



        <div className="col-md-6 ps-3">
          
         <div className="row border-bottom py-2">
           <h2>{product.name}</h2>

           <p>Product # {product.id}</p>
         </div>
         <div className="row border-bottom py-2 ">
           <Rating {...options} />
           <span >
             {" "}
             ({product.numOfReviews} Reviews)
           </span>
         </div>
         <div className="row border-bottom py-2">
           <h2>{`₹${product.price}`}</h2>
           <div className="border-bottom py-2 d-flex flex-row">

                    <button className="btn btn-secondary mx-2" onClick={decreaseQuantity}>-</button>
                    <span className="mt-1">{quantity}</span>
                    <button className="btn btn-secondary mx-2" onClick={increaseQuantity}>+</button>
                  
             <button className="btn btn-warning text-light mx-2"
               disabled={product.Stock < 1 ? true : false}
               onClick={addToCartHandler}
             >
               Add to Cart
             </button>
           </div>
 
           <p >
             Status:
             <b className={product.Stock < 1 ? "text-secondary" : "text-success"}>
               {product.Stock < 1 ? "OutOfStock" : "InStock"}
             </b>
           </p>
         </div>
 
         <div className="row border-bottom py-2">
           <p> <b> Description : </b> {product.description}</p>
         </div>
 
         <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-warning mt-3 text-light">
           Submit Review
         </button>
       </div>
        </div>
      </div>
             
 {/* ---------------------------------- */}
     <h3 className="text-center border-bottom p-4 m-2">REVIEWS</h3>

          {/* <!-- Modal --> */}
<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

      <div className="form-floating">
            <textarea className="form-control" value={comment}
                onChange={(e) => setComment(e.target.value)}
                 placeholder="Leave a comment here" id="floatingTextarea"></textarea>
            <label for="floatingTextarea">Review</label>
          </div>
             <div className="container">
             <Rating
                onChange={(e) => {setRating(e.target.value)}}
                value={Number(rating)}
                size="large"
              />
             </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" onClick={reviewSubmitHandler} data-bs-dismiss="modal" className="btn btn-warning text-light">Save changes</button>
      </div>
    </div>
  </div>
</div>
        




 
     {product.reviews && product.reviews[0] ? (
       <div className="d-flex flex-row overflow-x-auto">
         {product.reviews &&
           product.reviews.map((review) => (
             <ReviewCard key={review.id} review={review} />
           ))}
       </div>
     ) : (
       <p className="text-center">No Reviews Yet</p>
     )}
   </Fragment>}
   </> }

     </Fragment>     
  )
};

export default ProductDetails;
