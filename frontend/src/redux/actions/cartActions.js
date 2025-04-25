import axios from "axios";


export const addItemsToCart = (id,quantity , dec=false) => async (dispatch , getState)=>{
    let cartItems = getState().cartReducer.cartItems
    try {
        const {data} = await axios.get(`/api/v1/product/${id}`);

        let item = {
          product: data?.product.id,
          name: data?.product.name,
          price: data?.product.price,
          image: data?.product?.image[0],
          stock: data?.product.Stock,
          quantity:quantity
        }
        let isFound  = false;
        if(cartItems.length > 0){
          isFound= cartItems?.find(item => item.product === data?.product.id);
        }

        if(isFound) {
          item.quantity = isFound.quantity + quantity
          cartItems =  cartItems.map((i)=>{
           return i.product === data?.product.id ? item : i;
        })

        }else{
            cartItems= [...cartItems, item];
          }

          if(item.stock<item.quantity){
            dispatch({
              type:"cartErros",
              payload:{
                error: "Item is not available in that quantity"
              }
            })
            return ;        
          }

          if(item.quantity<1){
            dispatch({
              type:"cartErros",
              payload:{
                error: "Quntity cannot be less than 1"
              }
            })
            return ;        
          }
          
            dispatch({
              type:"addToCart",
              payload:{
                cartItems:cartItems,
                message: dec ? "Quantity has been decresed" :"Your item has been added to cart!!"
                
              }
            })
            
            localStorage.setItem("cartItems" , JSON.stringify(cartItems));    
        
      } catch (error) {
        // console.log(error)
        dispatch({
          type:"cartErros",
          payload:{
            error: error.response?.data?.message
          }
        })
      }
}

export const clearErrorsCart = () =>(dispatch)=>{
  dispatch({
    type : "clearErrorsCart"
  })
}



export const removeItemFromCart = (id) => async (dispatch,getState) => {
  
  let cartItems = getState().cartReducer.cartItems

  try {
    const {data} = await axios.get(`/api/v1/product/${id}`);
    cartItems = cartItems.filter(i => i.product !== data.product.id );

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    dispatch({
      type:"addToCart",
      payload:{
        cartItems:cartItems,
        message: "Your item has been removed from cart!!"
        
      }
    })
  } catch (error) {
    // console.log( "fbgf", error)
    dispatch({
      type:"cartErros",
      payload:{
        error: error?.response?.data?.message
      }
    })
  }
}

export const saveShippingInfo = (data)=>(dispatch)=>{

  dispatch({
    type:"saveShippingInfo",
    payload: data
  })

  localStorage.setItem("shippingInfo", JSON.stringify(data));
}

export const refreashCart = ()=>(dispatch)=>{
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  dispatch({
    type:"refreashCart",
    payload: cartItems
  })
}