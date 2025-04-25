import React, { Fragment, useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updateProfile, loadUser } from "../../redux/actions/UserActions";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.getUser);
  const { error, isUpdated, loading , message } = useSelector((state) => state.profileReducer);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [uploadingImage, setuploadingImage] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);


  const uploadImage=async(image)=>{
    const data = new FormData();
    data.append('file' , image);
    data.append('upload_preset', 'fzhcr1nb');
    try {
      setuploadingImage(true)
      let res = await fetch("http://api.cloudinary.com/v1_1/dsyz3bvhp/image/upload", {
            method:"post",
            body:data
      })
      const urlData = await res.json();
      setuploadingImage(false);
      return urlData.url
      
    } catch (error) {
      setuploadingImage(false);
      notify("error", error);
    }
  }

  const updateProfileSubmit = async (e) => {
    e.preventDefault();
    let url = user.avatar;
    if(image){
      url =  await uploadImage(image);
    }

    dispatch(updateProfile({name: name , email: email , avatar:url}));
  };

  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];
    if(file.size> 1048576){
      return notify("error", "Image size exceeds 1MB");
    }else{
      setImage(file)
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar);
    }

    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      notify("success", message);
      dispatch(loadUser());
      dispatch(clearErrors());
      navigate("/account");
    }
    // eslint-disable-next-line
  }, [dispatch, error, navigate, user, isUpdated]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile | Foodiee" />


          {/* ------------- */}
          <div className="row justify-content-center mt-5 m-2 pt-5">
            <div className=" col-md-6 mt-5 border shadow-lg  rounded-3  ">
              <h2 className="text-center text-warning p-3 border-bottom" >Update Profile</h2>
              <form className="p-3  signUpForm" style={{maxWidth:'700px'}} encType="multipart/form-data"
                onSubmit={updateProfileSubmit}>
        <div className="mb-3">
          <label for="exampleInputname1" className="form-label">Name</label>
          <input type="text" className="form-control" id="exampleInputname1" aria-describedby="nameHelp" placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/> 
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="mb-3 d-flex" id="registerImage">
          <img src={avatarPreview} className="rounded-5" style={{maxWidth:"60px"}} alt="Avatar Preview" />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={updateProfileDataChange}
          />
        </div>
        <div className="text-center">

          <button disabled={uploadingImage===true ? true : false} type="submit" value={ uploadingImage ?"please wait..." : "Update"} className="btn btn-outline-warning  fw-bold  signUpBtn ">Update</button>
        </div>
      </form>
            </div>
            </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
