import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component" 


const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    precision: 0.5,
    isHalf: true,
  };
  return (
    <Link className="text-decoration-none m-3  " to={`/product/${product.id}`}>

      <div className="card product-card border-0"  style={{maxWidth:'12rem' , maxHeight:'15rem' , minHeight: '12px' , minWidth:'10px'}}>
  <img src={ product.image && product.image[0]} alt={product.name} className="card-img-top" />
  <div className="card-body">
    <p className="card-text m-0 ">{product.name}</p>
    <div className="row">
      <div className="col-md-6 ">
        <ReactStars {...options} />
      </div>
      <div className="col-6 text-start p-0">
        <span className="badge text-secondary  m-0 ">({product.numOfReviews} Reviews)</span>

      </div>
    </div>
      <span className="fw-bold" >{`₹${product.price}`}</span>
        <br />
  </div>
</div>
    </Link>
  );
};

export default ProductCard;
