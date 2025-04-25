import React from "react";
import profilePng from "../../images/Profile.png";
import ReactStars from "react-rating-stars-component" 

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
      <div className="card me-1 text-center overflow-y-auto"style={{width:'15rem' , height:'15rem' , minWidth:'15rem' }} >
        <div className="container " style={{maxWidth:'30%' }}>

        <img src={profilePng} alt="User"className="card-img-top border-bottom  " />
        </div>
        <div className="card-body">
          <p className="card-text m-0"> 
         <b> {review.name}</b></p>
         <div className="row justify-content-center w-100 ">
          <div className="col-6 ms-5">
        <ReactStars {...options} />
      </div>
      </div>
     <p className="card-text m-0 overflow-y-auto">{review.comment}</p>
        </div>
      </div>

  );
};

export default ReviewCard;
