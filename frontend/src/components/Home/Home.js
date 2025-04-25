import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";
import "./Home.css";
import ProductCard from "./ProductCard";
import {useSelector , useDispatch} from 'react-redux'
import { clearErrors, getProducts } from "../../redux/actions/ProductActions";
import Loader from "../layout/Loader/Loader";
import { notify } from "../../utils/Notification";
import cover from "../../images/cover.jpg"

const Home = () => {
  const {products, loading , error , productCount} = useSelector((state)=>state.getProduct)

  const dispatch = useDispatch();
  useEffect( ()=>{
   dispatch(getProducts())
   // eslint-disable-next-line
  },[dispatch])

  useEffect(()=>{
    if(error){
      notify("error", error);
      dispatch(clearErrors())
    }
    // eslint-disable-next-line
  },[error])


  return (
    <div >
          {loading? <Loader/>:
          <>
          <div className="row w-100 text-center vh-100 m-0 position-relative mb-5 ">
          <img src={cover} className="img-fluid p-0 object-fit-cover " alt="cover image"/>
              <div className="position-absolute top-50 start-0 translate-middle-y text-warning">
              <p>Welcome to foodiee...</p>
              <br />
            <h2>FIND AMAZING PRODUCTS BELOW</h2>
            <br />
            <a href="#container">
              <button className="btn btn-outline-warning rounded-0 text-light px-4 fw-bold" >
                Scroll 
              </button>
            </a>
              </div>
          </div>

          <h2 className="text-center position-relative z-2"  ><span  className="border-bottom ">Featured Products</span></h2>

          <div className=" container" id="container">
            
            <div className="row">
            {products && products.map((product)=>{
              return <div className="col-6 col-lg-3 ">
                <ProductCard key={product?.id} product={product}/>
              </div>
            })}
            </div>
          </div>
          
          </>}

     <Outlet/>
          
    </div>
  );
};

export default Home;
