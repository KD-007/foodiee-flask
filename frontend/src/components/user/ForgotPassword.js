import React, { Fragment, useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../redux/actions/UserActions";
import MetaData from "../layout/MetaData";
import { notify } from "../../utils/Notification";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector((state) => state.forgotPasswordReducer);

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      notify("error", error);

    }

    if (message) {
      notify("success", message);
    }
    dispatch(clearErrors());
    
  }, [dispatch, error, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Forgot Password | Foodiee" />
            <div className="row justify-content-center mt-5 m-2 pt-5">
            <div className=" col-md-6 mt-5 border shadow-lg  rounded-3  ">
              <h2 className="text-center text-warning p-3 border-bottom" >Forgot Password</h2>
            <form className="p-3 loginForm" style={{maxWidth:'700px'}} onSubmit={forgotPasswordSubmit} >
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
                    aria-describedby="emailHelp" /> 
        </div>
      
        <div className="text-center">

          <button type="submit" className="btn btn-outline-warning  fw-bold ">Send Reset Link</button>
        </div>
      </form>
            </div>
            </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
