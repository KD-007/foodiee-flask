import axios from "axios";


export const createOrder = (order) =>async (dispatch)=>{
    try {
      // console.log(order)
        dispatch({ type: "createOrderRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.post(
          `/api/v1/order/new`,
          order,
          config
        );
        
        dispatch({ type: "createOrderSuccess", payload: data.order });

        let cartItems = [];
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        
    } catch (error) {
        dispatch({
            type:"createOrderFail",
            payload:error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
      type:"clearErrors",
    })
  }


export const myOrders= ()=> async (dispatch) => {
  try {
    dispatch({ type: "myOrdersRequest" });
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.get(
      `/api/v1/orders/me`,
      config
    );
    
    dispatch({ type: "myOrdersSuccess", payload: data.orders });
    
} catch (error) {
    dispatch({
        type:"myOrdersFail",
        payload:error.response.data.message
    })
}
}


export const getOrderDetails = (id)=> async (dispatch)=>{
  try {
    dispatch({ type: "myOrderDetailRequest" });
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.get(
      `/api/v1/order/${id}`,
      config
    );
   
    dispatch({ type: "myOrderDetailSuccess", payload: data.order });
    
} catch (error) {
    dispatch({
        type:"myOrderDetailFail",
        payload:error.response.data.message
    })
}
}


export const getAllOrders= ()=> async (dispatch) => {
  try {
    dispatch({ type: "allOrdersRequest" });
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.get(
      `/api/v1/admin/orders`,
      config
    );
    
    dispatch({ type: "allOrdersSuccess", payload: data.orders });
    
} catch (error) {
    dispatch({
        type:"allOrdersFail",
        payload:error.response.data.message
    })
}
}

export const updateOrder = (id,order)=>async (dispatch)=>{
  try {
    dispatch({ type: "updateorderRequest" });
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.put(
      `/api/v1/admin/order/${id}`,
      order,
      config
    );

    dispatch({ type: "updateorderSuccess", payload: data });
    
} catch (error) {
    dispatch({
        type:"updateorderFail",
        payload:error.response.data.message
    })
}
}

export const deleteOrder = (id)=>async (dispatch)=>{
  try {
    dispatch({ type: "orderDeleteRequest" });
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.delete(
      `/api/v1/admin/order/${id}`,
      config
    );

    dispatch({ type: "orderDeleteSuccess", payload: data });
    
} catch (error) {
    dispatch({
        type:"ordertDeleteFail",
        payload:error.response.data.message
    })
}
}