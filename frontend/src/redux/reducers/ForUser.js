import {createReducer} from "@reduxjs/toolkit";
let userData={};

export const userReducer= createReducer(userData, {
    loginRequest:( state,action)=>{
        state.loading=true
        state.isAuthenticated=false
    },
    loginSuccess:( state,action)=>{
        state.loading=false
        state.isAuthenticated=true
        state.user= action.payload
    },
    loginFail:( state,action)=>{
        state.loading=false
        state.isAuthenticated=false
        state.user= null
        state.error= action.payload
    },


    clearErrors:(state, action)=>{
        state.loading=false
        state.error = null
        state.message = null
      },



    registerRequest:( state,action)=>{
        state.loading=true
        state.isAuthenticated=false
    },
    registerSuccess:( state,action)=>{
        state.loading=false
        state.isAuthenticated=true
        state.user= action.payload
    },
    registerFail:( state,action)=>{
        state.loading=false
        state.isAuthenticated=false
        state.user= null
        state.error= action.payload
    },
    
    loadUserRequest:( state,action)=>{
        state.loading=true
        // state.isAuthenticated=false
    },
    loadUserSuccess:( state,action)=>{
        state.loading=false
        state.isAuthenticated=true
        state.user= action.payload
    },
    noUserFound:(state,action)=>{
        state.loading=false
    },
    loadUserFail:( state,action)=>{
        state.loading=false
        state.isAuthenticated=false
        state.user= null
        state.error= action.payload
    },
    logoutRequest:( state,action)=>{
        state.loading=true
    },
    logoutSuccess:( state,action)=>{
        state.loading=false
        state.isAuthenticated=false
        state.message= action.payload
        state.user= null
    },
    logoutFail:( state,action)=>{
        state.loading=false
        state.error= action.payload
    },

})



export const profileReducer = createReducer({},{
    updateProfileRequest:(state,action)=>{
        state.loading=true
    },
    updateProfileSuccess:(state,action)=>{
        state.loading=false
        state.isUpdated=true
        state.message=action.payload

    },
    updateProfileFail:(state,action)=>{
        state.loading= false
        state.error = action.payload
    },

    clearErrors:(state,action)=>{
        state.loading=false
        state.error = null
        state.isUpdated = false
        state.message=null
    },

    updatePasswordRequest:(state,action)=>{
        state.loading=true
    },
    updatePasswordSuccess:(state,action)=>{
        state.loading=false
        state.isUpdated=true
        state.message=action.payload

    },
    updatePasswordFail:(state,action)=>{
        state.loading= false
        state.error = action.payload
    },
    updatePasswordeReset:(state,action)=>{
        state.isUpdated = false
    },
})


export const forgotPasswordReducer = createReducer({},{
    forgotPasswordRequest:(state,action)=>{
        state.loading=true
    },
    forgotPasswordSuccess:(state,action)=>{
        state.loading=false
        state.message=action.payload

    },
    forgotPasswordFail:(state,action)=>{
        state.loading= false
        state.error = action.payload
    },
    resetPasswordRequest:(state,action)=>{
        state.loading=true
    },
    resetPasswordSuccess:(state,action)=>{
        state.loading=false
        state.message=action.payload

    },
    resetPasswordFail:(state,action)=>{
        state.loading= false
        state.error = action.payload
    },
    clearErrors:(state,action)=>{
        state.loading=false
        state.error = null
        state.isUpdated = false
        state.message=null
    },
})


export const getAllUsers = createReducer({}, {
    getAllUsersRequest:( state,action)=>{
        state.loading=true
        // state.isAuthenticated=false
    },
    getAllUsersSuccess:( state,action)=>{
        state.loading=false
        state.users= action.payload
    },
    getAllUsersFail:( state,action)=>{
        state.loading=false
        state.users= null
        state.error= action.payload
    },
    clearErrors:(state, action)=>{
        state.loading=false
        state.error = null
        state.message = null
      },
})


export const getSpecificUser = createReducer({}, {
    getSpecificUserRequest:( state,action)=>{
        state.loading=true
        // state.isAuthenticated=false
    },
    getSpecificUserSuccess:( state,action)=>{
        state.loading=false
        state.user= action.payload
    },
    getSpecificUserFail:( state,action)=>{
        state.loading=false
        state.user= null
        state.error= action.payload
    },

    updateSpecificUserRequest:(state,action)=>{
        state.updateLoading=true
    },
    updateSpecificUserSuccess:(state,action)=>{
        state.updateLoading=false
        state.isUpdated=true
        state.message=action.payload

    },
    updateSpecificUserFail:(state,action)=>{
        state.updateLoading= false
        state.error = action.payload
    },

    deleteSpecificUserRequest:(state,action)=>{
        state.loading=true
    },
    deleteSpecificUserSuccess:(state,action)=>{
        state.loading=false
        state.isDeleted=true
        state.message=action.payload

    },
    deleteSpecificUserFail:(state,action)=>{
        state.loading= false
        state.error = action.payload
    },
    clearErrors:(state, action)=>{
        state.loading=false
        state.error = null
        state.message = null
        state.user= null
        state.isDeleted = null
        state.isUpdated = null
        state.updateLoading = null
      },
})