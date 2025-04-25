
import axios from "axios";


export const loginUser = (email,password)=>async(dispatch)=>{
        try {
            dispatch({ type: "loginRequest" });
            const config = { headers: { "Content-Type": "application/json" }   };
            const { data } = await axios.post(
              `/api/v1/login`,
              { email, password },
              config
            );
            dispatch({ type: "loginSuccess", payload: data.user });
            
        } catch (error) {
            dispatch({
                type:"loginFail",
                payload:error.response.data.message
            })
        }
}

export const registerUser = (userdata)=>async(dispatch)=>{
    try {
        dispatch({ type: "registerRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.post(
          `/api/v1/register`,
          userdata,
          config
        );
        dispatch({ type: "registerSuccess", payload: data.user });
        
    } catch (error) {
        dispatch({
            type:"registerFail",
            payload:error.response.data.message
        })
    }
}


export const loadUser = ()=>async(dispatch)=>{
    try {


        dispatch({ type: "loadUserRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.get(
          `/api/v1/me`,
          config
        );
        if(!data.success){
            dispatch({type:"noUserFound"});
            return;
        }
        dispatch({ type: "loadUserSuccess", payload: data.user });
        
    } catch (error) {
        dispatch({
            type:"loadUserFail",
            payload:error.response.data.message
        })
    }
}


export const logout = ()=>async(dispatch)=>{
    try {
        dispatch({type:"logoutRequest"})
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.delete(
          `/api/v1/logout`,
          config
        );
        dispatch({ type: "logoutSuccess", payload: data.message });
        
    } catch (error) {
        dispatch({
            type:"logoutFail",
            payload:error.response.data.message
        })
    }
}

export const updateProfile = (userdata)=>async(dispatch)=>{
    try {
        dispatch({ type: "updateProfileRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.put(
          `/api/v1/me/update`,
          userdata,
          config
        );
        dispatch({ type: "updateProfileSuccess", payload: data.message });
        
    } catch (error) {
        dispatch({
            type:"updateProfileFail",
            payload:error.response.data.message
        })
    }
}

export const updatePassword = (userdata)=>async(dispatch)=>{
    try {
        dispatch({ type: "updatePasswordRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.put(
          `/api/v1/password/update`,
          userdata,
          config
        );
        dispatch({ type: "updatePasswordSuccess", payload: data.message });
        
    } catch (error) {
        dispatch({
            type:"updatePasswordFail",
            payload:error.response.data.message
        })
    }
}


export const forgotPassword = (userdata)=>async(dispatch)=>{
    try {
        dispatch({ type: "forgotPasswordRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.put(
          `/api/v1/password/forgot`,
          userdata,
          config
        );
        
        dispatch({ type: "forgotPasswordSuccess", payload: data.message });
        
    } catch (error) {
        dispatch({
            type:"forgotPasswordFail",
            payload:error.response.data.message
        })
    }
}


export const clearErrors = () => async (dispatch) => {
    dispatch({
      type:"clearErrors",
    })
  }


  export const getAllUsers = ()=>async(dispatch)=>{
    try {
        dispatch({ type: "getAllUsersRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.get(
          `/api/v1/admin/users`,
          config
        );
        // if(!data.success){
        //     dispatch({type:"noUserFound"});
        //     return;
        // }
        dispatch({ type: "getAllUsersSuccess", payload: data.users });
        
    } catch (error) {
        dispatch({
            type:"getAllUsersFail",
            payload:error.response.data.message
        })
    }
}
export const getSpecificUser = (id)=> async (dispatch)=>{
    try {
        dispatch({ type: "getSpecificUserRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.get(
          `/api/v1/admin/user/${id}`,
          config
        );
        dispatch({ type: "getSpecificUserSuccess", payload: data.user });
        
    } catch (error) {
        dispatch({
            type:"getSpecificUserFail",
            payload:error.response.data.message
        })
    }
}

export const deleteUser = (id)=> async (dispatch)=>{

    try {
        dispatch({ type: "deleteSpecificUserRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.delete(
          `/api/v1/admin/user/${id}`,
          config
        );
        dispatch({ type: "deleteSpecificUserSuccess", payload: data.message });
        
    } catch (error) {
        dispatch({
            type:"deleteSpecificUserFail",
            payload:error.response.data.message
        })
    }
}


export const updateUser = (id, userData)=> async (dispatch)=>{
    try {
        dispatch({ type: "updateSpecificUserRequest" });
        const config = { headers: { "Content-Type": "application/json" }   };
        const { data } = await axios.put(
          `/api/v1/admin/user/${id}`,
          userData,
          config
        );
        dispatch({ type: "updateSpecificUserSuccess", payload: data.message });
        
    } catch (error) {
        dispatch({
            type:"updateSpecificUserFail",
            payload:error.response.data.message
        })
    }
}