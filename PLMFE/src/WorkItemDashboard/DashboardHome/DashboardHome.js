import { Outlet } from "react-router-dom";
import { useBeforeunload } from "react-beforeunload";
import { SIGN_OUT } from "../../actions/types";
import { useDispatch } from "react-redux";
import SessionTimeoutModal from "../../Components/Navbar/SessionTimeoutModal";


export default function DashboardHome (){

    const dispatch = useDispatch();
    
    const signout = () => {
        dispatch({type: SIGN_OUT, payload: null});
    }

    useBeforeunload(()=>{
        signout();
    });

    return(
        <>
        <Outlet/>
        <SessionTimeoutModal navTo={'/DashboardLogin'}></SessionTimeoutModal>
        </>
    ) 
}