import {createReducer} from '@reduxjs/toolkit';

  var initialProducts  ={}


 export const productsReducer = createReducer(initialProducts, {
    fetchProductRequest: (state , action)=>{
      state.loading=true
    },
    fetchProductSuccess: (state , action)=>{
      state.loading=false
      state.products = action.payload.products
      state.productCount = action.payload.productCount
      state.resultPerPage = action.payload.resultPerPage
      state.filteredProductsCount = action.payload.filteredProductsCount
    },
    fetchProductFail: (state , action)=>{
      state.loading=false
      state.error = action.payload
    },
    clearErrors:(state, action)=>{
      state.loading=false
      state.error = null
    }

})



var singleProduct  ={}

export const singleProductReducer = createReducer(singleProduct, {
  fetchSingleProductRequest: (state , action)=>{
    state.loading=true
   
  },
  fetchSingleProductSuccess: (state , action)=>{
    state.loading=false
    state.product = action.payload.product
  },
  fetchSingleProductFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },
  clearErrors:(state, action)=>{
    state.loading=false
    state.error = null
  }

})


export const reviewReducer = createReducer({}, {
  newReviewRequest: (state , action)=>{
    state.loading=true
   
  },
  newReviewSuccess: (state , action)=>{
    state.loading=false
    state.message = action.payload
  },
  newReviewFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },

  deleteReviewRequest: (state , action)=>{
    state.loading=true
   
  },
  deleteReviewSuccess: (state , action)=>{
    state.loading=false
    state.isDeleted = true
  },
  deleteReviewFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },

  clearErrors:(state, action)=>{
    state.loading=false
    state.error = null
    state.message = null
    state.isDeleted = null
  }

})


export const allReviewReducer = createReducer({}, {
  allReviewRequest: (state , action)=>{
    state.loading=true
   
  },
  allReviewSuccess: (state , action)=>{
    state.loading=false
    state.reviews = action.payload.reviews
  },
  allReviewFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },

  clearErrors:(state, action)=>{
    state.loading=false
    state.error = null
  }

})


export const newProductReducer = createReducer({}, {
  newProductRequest: (state , action)=>{
    state.loading=true
   
  },
  newProductSuccess: (state , action)=>{
    state.loading=false
    state.success = action.payload.success
    state.product = action.payload.product
  },
  newProductFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },
  clearErrors:(state, action)=>{
    state.loading=false
    state.error = null
    state.success = null
  }

})

export const ProductReducer = createReducer({}, {
  productDeleteRequest: (state , action)=>{
    state.loading=true
   
  },
  productDeleteSuccess: (state , action)=>{
    state.loading=false
    state.success = action.payload.success
    state.product = action.payload.product
  },
  productDeleteFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },
  updateProductRequest: (state , action)=>{
    state.loading=true
   
  },
  updateProductSuccess: (state , action)=>{
    state.loading=false
    state.success = action.payload.success
    state.product = action.payload.product
  },
  updateProductFail: (state , action)=>{
    state.loading=false
    state.error = action.payload
  },
  clearErrors:(state, action)=>{
    state.loading=false
    state.error = null
    state.success = null
  }

})

