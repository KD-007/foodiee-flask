import React from 'react'
import {Link} from "react-router-dom"

const Sidebar = () => {
  return (

    // ----------------------------------------------------
    <div className="col-md-2 mt-5 pt-5  border">
              <ul className="list-unstyled ps-0">
                <li className="m-2 p-2 border-bottom">
                  <Link to="/admin/dashboard" className="nav-link link-dark ">
                    <i className="bi bi-speedometer2 "></i> 
                      <span>Dashboard</span>
                  </Link>
                </li>
                <li className="m-2 p-2 border-bottom">
                  <Link className=" nav-link link-dark" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                    <i className="bi bi-building"></i> Products
                  </Link>
                  <div className="collapse" id="dashboard-collapse">
                    <ul className="btn-toggle-nav list-unstyled fw-normal p-1 small">
                      <li><Link  to="/admin/products" className="nav-link link-dark rounded p-2"> <i className="bi bi-border-all"></i> All Products</Link></li>
                      <li><Link to="/admin/product" className="nav-link link-dark rounded p-2"> <i className="bi bi-plus"></i> Create</Link></li>
                    </ul>
                  </div>
                </li>
                <li className="m-2 p-2 border-bottom">
                  <Link to="/admin/orders" className="nav-link link-dark ">
                    <i className="bi bi-bricks"></i>
                      <span>Orders</span>
                  </Link>
                </li>
                
                <li className="m-2 p-2 border-bottom">
                  <Link to="/admin/users" className="nav-link link-dark ">
                    <i className="bi bi-people-fill"></i>
                      <span>Users</span>
                  </Link>
                </li>
                <li className="m-2 p-2 border-bottom">
                  <Link to="/admin/reviews" className="nav-link link-dark ">
                    <i className="bi bi-journal-text"></i>
                      <span>Reviews</span>
                  </Link>
                </li>
              </ul>
            </div>
  )
}

export default Sidebar