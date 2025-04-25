import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { getProductsAdmin } from "../../redux/actions/ProductActions";
import { getAllOrders } from "../../redux/actions/orderActions";
import { getAllUsers } from "../../redux/actions/UserActions";

const Dashboard = () => {

  const dispatch = useDispatch();

  const {products} = useSelector((state)=>state.getProduct)
  const { orders } = useSelector((state) => state.allOrdersReducer);
  const { users } = useSelector((state) => state.getAllUsers);

  let outOfStock = 0;



  let totalAmount = 0;
  useEffect(() => {
    dispatch(getProductsAdmin());
    dispatch(getAllOrders());
    dispatch(getAllUsers());

  }, [dispatch]);

  orders &&
  orders.forEach((item) => {
    totalAmount += parseFloat(item.totalPrice);
  });

  products &&
  products.forEach((item) => {
    if (item.stock === 0) {
      outOfStock += 1;
    }
  });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  };

  return (
    <div className="row w-100">
      <MetaData title="Dashboard - Admin Panel| Foodiee" />
      <Sidebar />

      <div className="col-md-10 mt-5 pt-3">
        <div className="row w-100 text-center">
 
            <h2 className="bg-primary text-light p-2" >
              Total Amount <br /> ₹{ totalAmount }
            </h2>
    
          <div className="d-flex justify-content-center ">
            <Link to="/admin/products" className="text-decoration-none">
              <div className="bg-primary rounded-circle text-light p-3 m-3">
              <h5 >Product
                <br />
                {products && products?.length}
              </h5>
  
              </div>
            </Link>
            <Link to="/admin/orders" className="text-decoration-none">
            <div className="bg-danger rounded-circle text-light p-3 m-3">
              <h5 >Orders
                <br />
                {orders && orders?.length}
              </h5>
  
              </div>
            </Link>
            <Link to="/admin/users" className="text-decoration-none">
            <div className="bg-secondary rounded-circle text-light p-3 px-4 m-3">
              <h5 >Users
                <br />
                {users && users?.length}
              </h5>
  
              </div>
            </Link>
          </div>
        </div>

        <div className="d-flex justify-content-center" style={{maxHeight:"25vmax"}}>
          <Line data={lineState} />
        </div>

        <div className="d-flex justify-content-center" style={{maxHeight:"25vmax"}}>
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
