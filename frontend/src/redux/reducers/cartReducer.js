import {createReducer } from "@reduxjs/toolkit"
const initialState = {
    cartItems:localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingInfo:localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')) : {},
}
export const cartReducer = createReducer(initialState,{
    addToCart: (state, action) =>{
        state.cartItems = action.payload.cartItems
        state.messageCart = action.payload.message
    },
    cartErros: (state, action) =>{
        state.errorCart = action.payload.error
    },
    clearErrorsCart: (state, action) =>{
        state.errorCart = null
        state.messageCart = null
    },
    refreashCart: (state, action) =>{
        state.cartItems = action.payload
    },
    saveShippingInfo: (state, action) =>{
        state.shippingInfo=action.payload
    }
})