import './App.css';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './components/Home/Home.js';
import {ToastContainer} from "react-toastify";
import { notify } from './utils/Notification';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useDispatch,useSelector} from "react-redux";
import{clearErrors, loadUser} from "./redux/actions/UserActions";
import ProductDetails from './components/Product/ProductDetails';
import Products from "./components/Product/Products"
import LoginSignup from './components/user/LoginSignup';
import { useEffect,useState } from 'react';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from './components/Cart/Payment';
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import ProcessOrder from './components/Admin/ProcessOrder';
import OrderList from './components/Admin/OrderList';
import UsersList from './components/Admin/UserList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReviews from './components/Admin/ProductReviews';
import About from './components/layout/About/About';
import NotFound from './components/layout/Not Found/NotFound';
import MetaData from './components/layout/MetaData';



function App() {
  const {user, error,message,isAuthenticated} = useSelector((state)=>state.getUser);
  const dispatch = useDispatch();
  
  let role = null;
  const [stripeApiKey, setstripeApiKey] = useState("");

  const getStripeApi = async()=>{
    try {
      const config = { headers: { "Content-Type": "application/json" }   };
 
      const {data} = await axios.get(`/api/v1/stipeapikey`,config);

      setstripeApiKey(data.stripeApiKey);
    } catch (error) {
      notify("error" , error);
    }

  }

  role = user?.role;
  useEffect(()=>{
    if(error){
        notify("error", error)
      }
     if(message){
      notify("success", message)
     } 
      dispatch(clearErrors());
      if(user){
        getStripeApi();
      }
  
    // eslint-disable-next-line
  },[error,message , user])
  

  useEffect(()=>{
    dispatch(loadUser());
    console.log(role)
    // eslint-disable-next-line
  },[])
  return (
    <BrowserRouter>
    <MetaData title="Foodiee" />
    <Routes>
      <Route path='/' element={<Header isAuthenticated = {isAuthenticated} user={user} error = {error} />}>
      <Route index element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/account' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :<Profile/>}/>
      <Route path='/profile/update' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :<UpdateProfile/>}/>
      <Route path='/password/update' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :<UpdatePassword/>}/>
      <Route path='/shipping' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :  <Shipping/>}/>
      <Route path='/order/confirm' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :<ConfirmOrder/>}/>
      <Route path='/order/:id' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> : <OrderDetails/> }/>
      <Route>{stripeApiKey && (<Route exact path="/process/payment" element={isAuthenticated===false ? (<Navigate to="/LoginSignup" />)  :(<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>) }/> )}</Route>
      <Route path='/success' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :<OrderSuccess/>}/>
      <Route path='/orders' element={ isAuthenticated !==true ? <Navigate to="/LoginSignup" /> :<MyOrders/>}/>
      <Route path='/password/forgot' element={<ForgotPassword/>}/>
      <Route path='/product/:id' element={<ProductDetails/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/products' element={<Products/>}/>
      <Route path='/products/:keyword' element={<Products/>}/>
      <Route path='/LoginSignup' element={<LoginSignup/>}/>


      <Route path='/admin/dashboard' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<Dashboard/>}/>
      <Route path='admin/products' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<ProductList/>}/>
      <Route path='admin/product' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<NewProduct/>}/>
      <Route path='admin/product/:id' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<UpdateProduct/>}/>
      <Route path='admin/orders' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<OrderList/>}/>
      <Route path='admin/order/:id' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<ProcessOrder/>}/>
      <Route path='admin/users' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<UsersList/>}/>
      <Route path='admin/user/:id' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<UpdateUser/>}/>
      <Route path='admin/reviews' element={isAuthenticated !==true && role!=="admin" ? <Navigate to="/LoginSignup" /> :<ProductReviews/>}/>
      </Route>
    </Routes>
    <Footer/>
    <ToastContainer/>
    </BrowserRouter>
  );
}

export default App;
