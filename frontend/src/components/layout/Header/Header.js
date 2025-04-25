import React , {useState} from "react";
import { Link, Outlet ,useNavigate} from "react-router-dom";


const Header = ({user , isAuthenticated}) => {

  const navigate = useNavigate();
  const [keyword, setkeyword] = useState("");

  const onChange= (e)=>{
    setkeyword(e.target.value);
  }

  const search=(e)=>{
    e.preventDefault();
    if(keyword.trim()){
      navigate(`/products/${keyword}`);
      setkeyword("");
    }

  }

    return <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black position-fixed top-0  w-100 z-3">
        <div className="container-fluid text-light ">
            <Link className="text-decoration-none" to="/" >
          <span className="navbar-brand fw-bold text-warning "  >foodieee</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <Link className="text-decoration-none" to="/products" >  
              <li className="nav-item">
                <span className="nav-link active" aria-current="page" >Products</span>
              </li>
              </Link>
              
              <Link className="text-decoration-none" to="/account" >
              <li className="nav-item">
                <span className="nav-link active" aria-current="page" >My Profile</span>
              </li>
              </Link>

              <Link className="text-decoration-none" to="/orders" >  
              <li className="nav-item">
                <span className="nav-link active" aria-current="page" >My orders</span>
              </li>
              </Link>
              <Link className="text-decoration-none" to="/cart" >
                <li className="nav-item">
                    <span className="nav-link active" aria-current="page" >Cart</span>
                  </li>
                  </Link>
                  {isAuthenticated && user.role === "admin" &&
              <Link className="text-decoration-none" to="/admin/dashboard" >    
              <li className="nav-item">
                <span className="nav-link active" aria-current="page" >Dashbord</span>
              </li>
              </Link>
                  }
              <Link className="text-decoration-none" to="/about" >
                <li className="nav-item">
                    <span className="nav-link active" aria-current="page" >About</span>
                  </li>
                  </Link>

            </ul>
            <form className="d-flex" role="search" onSubmit={search} >
              <input className="form-control me-2" type="text" value={keyword} onChange={onChange} placeholder="Search" aria-label="Search">
                </input>
              <button className="btn btn-outline-warning" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

  <Outlet/>
  </>
};

export default Header;
