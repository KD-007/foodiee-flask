import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {loginUser,registerUser} from "../../redux/actions/UserActions";
import { useEffect } from "react";
import Loader from "../layout/Loader/Loader";
// import "./auth.css";
import MetaData from "../layout/MetaData";
import { notify } from "../../utils/Notification";
import Header from "../layout/Header/Header";


const LoginSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useSelector((state)=> state.getUser);



  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { email, name, password } = user;


  const [image, setimage] = useState(null);
  const [imagePreview, setimagePreview] = useState(null);
  const [uploadingImage, setuploadingImage] = useState(false);



  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginEmail, loginPassword));
  };
  const registerSubmit = async(e) => {
    e.preventDefault();
    if(!image) return alert("Please upload a profile image");
    const url = await uploadImage(image);
    dispatch(registerUser({name:name ,email:email,password:password , avatar:url}));
  };

  const uploadImage = async (image)=>{
    const data = new FormData();
    data.append('file' , image);
    data.append('upload_preset', 'f6qooums');
    try {

      let res = await fetch("https://api.cloudinary.com/v1_1/dojvydh84/image/upload", {
            method:"post",
            body:data
      })
      const urlData = await res.json();
      setuploadingImage(false);
      return urlData.url
      
    } catch (error) {
      setuploadingImage(false);
      notify("error" , error);
    }
  }
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if(file.size> 1048576){
        return notify("warn" , "Image size Exceeds 1MB");
      }else{
        setimage(file);
        setimagePreview(URL.createObjectURL(file));
      }
    }else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };


  useEffect(() => {

    if (isAuthenticated) {

      navigate("/account");
    }
  }, [dispatch, isAuthenticated, navigate]);

  const switchTabs = (e, tab) => {
    const loginHead = document.querySelector('.login-switcher');
    const registerHead = document.querySelector('.register-switcher');
    const loginForm = document.querySelector('.loginForm');
    const registerForm = document.querySelector('.signUpForm');


    if (tab === "login") {

      loginHead.classList.remove('text-warning');
      loginHead.classList.add('text-light');
      loginHead.classList.add('bg-warning');

      registerHead.classList.add('text-warning');
      registerHead.classList.remove('text-light');
      registerHead.classList.remove('bg-warning');
      
      loginForm.classList.remove('d-none');
      registerForm.classList.add('d-none');


    }
    if (tab === "register") {
      registerHead.classList.remove('text-warning');
      registerHead.classList.add('text-light');
      registerHead.classList.add('bg-warning');

      loginHead.classList.add('text-warning');
      loginHead.classList.remove('text-light');
      loginHead.classList.remove('bg-warning');

      registerForm.classList.remove('d-none');
      loginForm.classList.add('d-none');

    }
    
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
        <MetaData title={`Login-Signup | Foodiee`} />

          {/* ---------------------boot-------------------------- */}
    <div className="row justify-content-center mt-5 m-2 pt-5">    
    <div className=" col-md-6 mt-5 border shadow-lg  rounded-3  ">
      <div className="row border-bottom w-100 ">
        <div className="col-6 p-2 rounded text-center text-light bg-warning login-switcher " role="button" tabindex="0" onClick={(e) => switchTabs(e, "login")}  ><h3  >Login </h3></div>
        <div className="col-6 p-2 rounded text-center  text-warning register-switcher" role="button" tabindex="0" onClick={(e) => switchTabs(e, "register")} ><h3  >Register </h3></div>
      </div>
      {/* <!-- login   --> */}
      <div className="row w-100 justify-content-center " >
      <form className="p-3 loginForm" style={{maxWidth:'700px'}} onSubmit={loginSubmit}>
        <div className="mb-3">
          
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} aria-describedby="emailHelp" /> 
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}/>
        </div>
        <Link to="/password/forgot">Forget Password ?</Link>
        <div className="text-center">

          <button type="submit" className="btn btn-outline-warning  fw-bold ">Login</button>
        </div>
      </form>
      {/* <!-- signup --> */}
      <form className="p-3 d-none signUpForm" style={{maxWidth:'700px'}} encType="multipart/form-data"
                onSubmit={registerSubmit}>
        <div className="mb-3">
          <label for="exampleInputname1" className="form-label">Name</label>
          <input type="text" className="form-control" id="exampleInputname1" aria-describedby="nameHelp" placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}/> 
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}/>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}/>
        </div>
        <div className="mb-3 d-flex" id="registerImage">
          <img src={imagePreview} className="rounded-5" style={{maxWidth:"60px"}} alt="Avatar Preview" />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={registerDataChange}
          />
        </div>
        <div className="text-center">

          <button type="submit" value={ uploadingImage ?"please wait..." : "Register"} className="btn btn-outline-warning  fw-bold  signUpBtn ">Register</button>
        </div>
      </form>

    </div>
    </div>
    </div>  
        </>
      )}
      
    </>
  );
};

export default LoginSignup;
