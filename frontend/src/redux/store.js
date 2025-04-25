import {configureStore} from '@reduxjs/toolkit';
import { cartReducer } from './reducers/cartReducer';
import  {productsReducer,singleProductReducer,reviewReducer ,newProductReducer,ProductReducer , allReviewReducer} from './reducers/ForProduct';
import { userReducer, profileReducer, forgotPasswordReducer,getAllUsers,getSpecificUser } from './reducers/ForUser';
import { myordersReducer, orderReducer,allOrdersReducer,editOrderReducer } from './reducers/orderReducer';

export const store = configureStore({
    reducer:{
        getProduct:productsReducer,
        getSingleProduct:singleProductReducer,
        getUser:userReducer,
        profileReducer: profileReducer,
        forgotPasswordReducer:forgotPasswordReducer,
        cartReducer:cartReducer,
        orderReducer:orderReducer,
        myordersReducer:myordersReducer,
        reviewReducer:reviewReducer,
        allReviewReducer:allReviewReducer,
        allOrdersReducer:allOrdersReducer,
        getAllUsers:getAllUsers,
        getSpecificUser:getSpecificUser,
        newProductReducer:newProductReducer,
        ProductReducer:ProductReducer,
        editOrderReducer:editOrderReducer,
    }
})
