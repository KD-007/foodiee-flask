import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const toastData = {
    position: "bottom-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    }
export const notify = (type , error) =>{
    switch(type){
        case "error":
            toast.error(error,toastData);
            break;
        case "success":
            toast.success(error,toastData);
            break;
        case "warn":
            toast.warn(error,toastData);
            break;
        case "info":
            toast.info(error,toastData);
            break;            
    }
}