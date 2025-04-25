import React ,{useEffect} from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { refreashCart } from "../../redux/actions/cartActions";


const OrderSuccess = () => {
  const disPatch = useDispatch();
  useEffect(() => {
  disPatch(refreashCart())
  }, [disPatch])
  return (
 
     <div className="row justify-content-center pt-5 mt-5 h-50 w-100 ">
          <div className="col-md-6 text-center">
      <div className=" row w-100 text-center">
      
        <b> <CheckCircleIcon className="text-warning fs-1" />
        Your Order has been Placed successfully </b>
        </div>
        <br />
      <Link to="/orders" className="text-decoration-none">View Orders</Link>
    </div>
    </div>

  );
};

export default OrderSuccess;
