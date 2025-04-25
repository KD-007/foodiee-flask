import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SideBar from "./Sidebar";
import { getSpecificUser, updateUser, clearErrors } from "../../redux/actions/UserActions";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../utils/Notification";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { loading, error, user,isUpdated ,updateLoading} = useSelector((state) => state.getSpecificUser);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = params.id;

  useEffect(()=>{
    if(!user || user.id !== userId ){
      dispatch(getSpecificUser(userId));
    }
  },[dispatch,userId , user])
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      notify("success", "User updated successfully");
      navigate("/admin/users");
      dispatch(clearErrors());
    } 
  }, [dispatch, error, navigate, isUpdated, user]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Update User | Foodiee" />
      <div className="row w-100">
        <SideBar />
        <div className="col-md-10 mt-5 pt-5">
          {loading ? (
            <Loader />
          ) : (
            <div className="row justify-content-center ">
          <div className="col-md-6">
              <form
              onSubmit={updateUserSubmitHandler}
            >
              <h1 className="text-center">Update User</h1>

              <div className="input-group mb-3">
                    <div className="input-group-prepend px-2">
                          <PersonIcon />
                    </div>
                <input
                  type="text"
                  className="form-control" 
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                    <div className="input-group-prepend px-2">
                          <MailOutlineIcon />
                    </div>
                <input
                className="form-control" 
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                    <div className="input-group-prepend px-2">
                          <VerifiedUserIcon />
                    </div>
                
                <select
                className="form-select"
                 value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                className="btn bg-warning text-light w-100"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
            </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
