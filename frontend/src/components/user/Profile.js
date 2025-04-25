import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { logout , clearErrors } from "../../redux/actions/UserActions";


const Profile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.getUser);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  function logoutUser() {
    dispatch(logout());
    dispatch(clearErrors());
  } 

  useEffect(() => {
   
    if (isAuthenticated !== true && loading === false) {
      navigate("/LoginSignup");
    }
    // eslint-disable-next-line
  }, [navigate, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${user?.name}'s Profile | Foodiee`} />

          <h1 className="text-center text-secondary m-5 pt-4" >My Profile</h1>

<div className="container border"></div>
<div className="row w-100 mb-5 ">
  <div className="col-md-6 text-center  ">
    <img className="p-3"
    src={user?.avatar ? user?.avatar : "/Profile.png"}
    alt={user?.name}
    style={{maxWidth:'450px'}}
  />
  <br/>
  <Link  to="/profile/update">
    <button className="btn btn-warning text-light " >Edit Profile</button>
    </Link>
    <button onClick={logoutUser} className="btn btn-danger mx-2 " >Logout</button>
  </div>
  <div className="col-md-6 text-center p-3  " >
    <div className="row mt-5" >
      <h4>Full Name</h4>
      <p>{user?.name}</p>
    </div>
    <div className="row mt-5">
      <h4>Email</h4>
      <p>{user?.email}</p>
    </div>
    <div className="row mt-5 ">
      <h4>Joined On</h4>
      <p>{String(user?.createdAt).substring(0, 10)}</p>
    </div>

    <div className="m-2" >
      <Link to="/orders"><button className="btn btn-warning text-light m-2 " >My Orders</button></Link>
      <Link to="/password/update"><button className="btn btn-warning text-light " >Change Password</button></Link>
    </div>
  </div>
</div>
        </>
      )}
    </>
  );
};

export default Profile;
