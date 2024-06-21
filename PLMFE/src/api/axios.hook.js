import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CLEAR_SIGN_IN } from "../actions/types";
import { useNavigate } from "react-router-dom";
import { autoClearToken } from "../actions";
import { serverConfig } from "../config/config";

export function useAxios() {
  const token = useSelector((store) => store.auth.token);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const loginPage = useSelector((store) => store.auth.loginPage);

  const customAxios = axios.create({
    baseURL: serverConfig?.serverUrl + "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fileUpDownAxios = axios.create({
    baseURL: serverConfig?.serverUrl + "/dashboard/api",
    // headers: {
    //     'Authorization' : `Bearer ${token}`
    // }
  });

  const esignAxios = axios.create({
    baseURL: serverConfig?.serverUrl + "/esign/api",
    // headers: {
    //     'Authorization' : `Bearer ${token}`
    // }
  });

  const rosterAxios = axios.create({
    baseURL: serverConfig?.serverUrl + "/api/roster",
  });

  //    customAxios.interceptors.request.use(req =>{
  //        dispatch(autoClearToken());
  //        return req;
  //    })

  customAxios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status == 401) {
        alert("Your session has expired!");
        dispatch({ type: CLEAR_SIGN_IN, payload: null });
        if (loginPage == "DashboardLogin") {
          navigation("/DashboardLogin", { replace: true });
        } else if (loginPage == "PortalLogin") {
          navigation("/", { replace: true });
        }
      }
      return Promise.reject(err);
    }
  );

  return { customAxios, fileUpDownAxios, esignAxios, rosterAxios };
}
