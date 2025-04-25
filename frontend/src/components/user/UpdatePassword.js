import React, { Fragment, useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../redux/actions/UserActions";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isUpdated, loading, message } = useSelector((state) => state.profileReducer);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      notify("success", message);
      dispatch(clearErrors());
      navigate("/account");

    }
    // eslint-disable-next-line
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password | Foodiee" />

{/* ------------------- */}

        <div className="row justify-content-center mt-5 m-2 pt-5">
            <div className=" col-md-6 mt-5 border shadow-lg  rounded-3  ">
              <h2 className="text-center text-warning p-3 border-bottom" >Update Password</h2>
            <form className="p-3 loginForm" style={{maxWidth:'700px'}} onSubmit={updatePasswordSubmit} >
            <div className="mb-3">
          <input type="password" className="form-control"  placeholder="Current Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}/>
        </div>
        <div className="mb-3">
          
          <input type="password" className="form-control"  placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}/>
        </div>
        <div className="mb-3">
          <input type="password" className="form-control"  placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>
      
        <div className="text-center">

          <button type="submit" className="btn btn-outline-warning  fw-bold ">Change</button>
        </div>
      </form>
            </div>
            </div>



        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
