import axios from "axios";


 export const getProducts =(keyword="",currentPage=1,price=[0,3000],category, ratings=0)=> async (dispatch)=>{
   
    try {
      dispatch({
        type:"fetchProductRequest",
      })
      let link = `/api/v1/products?&currentPage=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
      if(category){
        link += `&category=${category}`;
      }
      if (keyword!=""){
        link += `&keyword=${keyword}`;
      }

      const {data} = await axios.get(link);

        dispatch({
          type:"fetchProductSuccess",
          payload:{
            products:data.products,
            productCount:data.productCount,
            resultPerPage:data.resultPerPage,
            filteredProductsCount:data.filteredProductsCount
            }
        })
      
    } catch (error) {
     
      dispatch({
        type:"fetchProductFail",
        payload:error.response.data.message
      })
    }

  }

  export const getSingleProduct =(id)=> async (dispatch)=>{
    try {
      dispatch({
        type:"fetchSingleProductRequest",
      })
      const {data} = await axios.get(`/api/v1/product/${id}`);
        dispatch({
          type:"fetchSingleProductSuccess",
          payload:{
            product:data.product,
          
            }
        })
      
    } catch (error) {
      dispatch({
        type:"fetchSingleProductFail",
        payload:error.response.data.message
      })
    }

  }

  export const newReview =(reviewData)=> async (dispatch)=>{
    try {
      dispatch({
        type:"newReviewRequest",
      })
    
      const config = { headers: { "Content-Type": "application/json" }   };
      const {data} = await axios.post(`/api/v1/product/review`, 
            reviewData,
            config
            );

        dispatch({
          type:"newReviewSuccess",
          payload:data.message,
          
            
        })
      
    } catch (error) {
      
      dispatch({
        type:"newReviewFail",
        payload:error.response.data.message
      })
    }

  }
  
  export const getProductsAdmin =()=> async (dispatch)=>{
   
    try {
      dispatch({
        type:"fetchProductRequest",
      })
      const config = { headers: { "Content-Type": "application/json" }   };
      const { data } = await axios.get(
        `/api/v1/admin/products`,
        config
      );
     
        dispatch({
          type:"fetchProductSuccess",
          payload:{
            products:data.products,
            }
        })
      
    } catch (error) {
      
      dispatch({
        type:"fetchProductFail",
        payload:error.response.data.message
      })
    }

  }  

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type:"clearErrors",
  })
}

export const createProduct = (newProduct) => async (dispatch) => { 
  try {
    dispatch({
      type:"newProductRequest",
    })
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.post(
      `/api/v1/admin/product/new`,
      newProduct,
      config
    );
    
      dispatch({
        type:"newProductSuccess",
        payload:data
      })
    
  } catch (error) {
    
    dispatch({
      type:"newProductFail",
      payload:error.response.data.message
    })
  }}

export const deleteProduct =  (id)=> async (dispatch) => { 
   try {
  dispatch({
    type:"productDeleteRequest",
  })
  const config = { headers: { "Content-Type": "application/json" }   };
  const { data } = await axios.delete(
    `/api/v1/admin/product/${id}`,
    config
  );

    dispatch({
      type:"productDeleteSuccess",
      payload:data
    })
  
} catch (error) {
 
  dispatch({
    type:"productDeleteFail",
    payload:error.response.data.message
  })
}}


export const updateProduct = (updatedData , id) =>async (dispatch)=>{
  try {
    dispatch({
      type:"updateProductRequest",
    })
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      updatedData,
      config
    );
    
      dispatch({
        type:"updateProductSuccess",
        payload:data
      })
    
  } catch (error) {
    
    dispatch({
      type:"updateProductFail",
      payload:error.response.data.message
    })
  }
}


export const getAllReviews = (id)=> async(dispatch)=>{ 
   try {
  dispatch({
    type:"allReviewRequest",
  })
  const config = { headers: { "Content-Type": "application/json" }   };
  const { data } = await axios.get(
    `/api/v1/admin/reviews/${id}`,
    config
  );

    dispatch({
      type:"allReviewSuccess",
      payload:data
    })
  
} catch (error) {

  dispatch({
    type:"allReviewFail",
    payload:error.response.data.message
  })
}}
export const deleteReviews = (id , productID)=>async (dispatch)=>{
  try {
    dispatch({
      type:"deleteReviewRequest",
    })
    const config = { headers: { "Content-Type": "application/json" }   };
    const { data } = await axios.delete(
      `/api/v1/admin/reviews?id=${id}&productID=${productID}`,
      config
    );
      dispatch({
        type:"deleteReviewSuccess",
        payload:data
      })
    
  } catch (error) {
  
    dispatch({
      type:"deleteReviewFail",
      payload:error.response.data.message
    })
  }
}