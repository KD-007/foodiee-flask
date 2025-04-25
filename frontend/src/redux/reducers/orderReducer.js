import {createReducer} from "@reduxjs/toolkit";

export const orderReducer = createReducer({},{
    createOrderRequest:(state,action)=>{
        state.loading= true
    },
    createOrderSuccess:(state,action)=>{
        state.loading= false
        state.order= action.payload
    },
    createOrderFail:(state,action)=>{
        state.loading= false
        state.error=action.payload
    },
    myOrderDetailRequest:(state,action)=>{
        state.loading= true
    },
    myOrderDetailSuccess:(state,action)=>{
        state.loading= false
        state.order= action.payload
    },
    myOrderDetailFail:(state,action)=>{
        state.loading= false
        state.error=action.payload
    },
    
    clearErrors:(state,action)=>{
        state.loading= false
        state.error=null
        state.message=null
    },

})


export const myordersReducer = createReducer({},{
    myOrdersRequest:(state,action)=>{
        state.loading= true
    },
    myOrdersSuccess:(state,action)=>{
        state.loading= false
        state.orders= action.payload
    },
    myOrdersFail:(state,action)=>{
        state.loading= false
        state.error=action.payload
    },
    clearErrors:(state,action)=>{
        state.loading= false
        state.error=null
        state.message=null
    },
})


export const allOrdersReducer = createReducer({},{
    allOrdersRequest:(state,action)=>{
        state.loading= true
    },
    allOrdersSuccess:(state,action)=>{
        state.loading= false
        state.orders= action.payload
    },
    allOrdersFail:(state,action)=>{
        state.loading= false
        state.error=action.payload
    },
    clearErrors:(state,action)=>{
        state.loading= false
        state.error=null
        state.message=null
    },
})


export const editOrderReducer = createReducer({}, {
     orderDeleteRequest: (state , action)=>{
        state.loading=true     
      },
      orderDeleteSuccess: (state , action)=>{
        state.loading=false
        state.isDeleted = action.payload.success
      },
      ordertDeleteFail: (state , action)=>{
        state.loading=false
        state.isDeleted = false
        state.error = action.payload
      },



      updateorderRequest: (state , action)=>{
        state.loading=true 
      },
      updateorderSuccess: (state , action)=>{
        state.loading=false
        state.isUpdated = action.payload.success
        // state.product = action.payload.product
      },
      updateorderFail: (state , action)=>{
        state.loading=false
        state.error = action.payload
      },

      
      clearErrors:(state, action)=>{
        state.loading=false
        state.error = null
        state.isDeleted = null
        state.isUpdated = null
      },
  
  })